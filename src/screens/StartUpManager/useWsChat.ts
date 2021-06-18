import { useEffect, useState } from "react";
import { Alert } from "react-native";

import { BASE_URL_WS } from "src/constants/env";
import { URLJoin, closeWsSafely, generateUuid4 } from "src/utils";
import { MessageJson, ProfileDispatch } from "src/types/Types.context";
import { WsResChat, WsResChatIoTs } from "src/types/Types";
import { useChatDispatch, useChatState } from "src/contexts/ChatContext";
import {
  useProfileDispatch,
  useProfileState,
} from "src/contexts/ProfileContext";
import { useWebsocket } from "src/hooks/useWebsocket";
import { useAuthState } from "src/contexts/AuthContext";
import { ALERT_MESSAGES } from "src/constants/alertMessages";

type ConnectWsChat = (roomId: string, shouldStart?: boolean) => void;
type UseWsChat = () => {
  connectWsChat: ConnectWsChat;
};
export const useWsChat: UseWsChat = () => {
  const chatDispatch = useChatDispatch();
  const chatState = useChatState();
  const profileState = useProfileState();
  const authState = useAuthState();
  const profileDispatch = useProfileDispatch();

  // useWebsocketのwsSettingsがroomIdに依存していて, かつroomIdがconnectWsChat()を呼び出さない限り確定しないため, もう一つwsSettings用のroomId・onSuccessAuthを用意 (詳しくはuseWebsocket.ts参照).
  const [roomId, setRoomId] = useState<string>();

  // 関数を直接stateで管理することはできない (https://zenn.dev/terrierscript/articles/2019-02-06-react-hooks-use-state-function-tips).
  const [onSuccessAuth, setOnSuccessAuth] = useState<{
    fn: (ws: WebSocket) => void;
  }>();
  const { connectWebsocket } = useWebsocket(
    {
      url: URLJoin(BASE_URL_WS, "chat/", roomId),
      typeIoTsOfResData: WsResChatIoTs,
      onopen: (ws: WebSocket) => {
        ws.send(
          JSON.stringify({
            type: "auth",
            token: authState.token ? authState.token : "",
          })
        );
      },
      onmessage: (eData, e, ws, isReconnect) => {
        const data = eData as WsResChat;

        switch (data.type) {
          case "auth":
            if (data.room) {
              chatDispatch({
                type: "UPDATE_TALKING_ROOM",
                roomJson: data.room,
              });
            }

            if (isReconnect && roomId) {
              chatDispatch({
                type: "RECONNECT_TALK",
                roomId: roomId,
                ws: ws,
              });
            } else {
              onSuccessAuth && onSuccessAuth.fn(ws);
            }

            if (
              "notStoredMessages" in data &&
              data.notStoredMessages.length > 0 &&
              roomId
            ) {
              const messages = data.notStoredMessages as MessageJson[];
              chatDispatch({
                type: "MERGE_MESSAGES",
                roomId: roomId,
                meId: profileState.profile.id,
                messages: messages,
                token: authState.token ? authState.token : "",
              });
            }

            if ("isAlreadyEnded" in data && data.isAlreadyEnded && roomId) {
              chatDispatch({
                type: "MEMBER_END_TALK",
                roomId: roomId,
                meId: profileState.profile.id,
              });
            }
            break;

          case "end_talk":
            if (roomId) {
              chatDispatch({
                type: "UPDATE_TALKING_ROOM",
                roomJson: data.room,
              });
              chatDispatch({
                type: "MEMBER_END_TALK",
                roomId: roomId,
                meId: profileState.profile.id,
              });
            }
            break;

          case "error":
            if (data.message) Alert.alert(data.message);
            closeWsSafely(ws);
            break;

          default:
            break;
        }
        if (roomId) {
          handleChatMessage(
            data,
            authState.token ? authState.token : "",
            roomId,
            profileDispatch
          );
        }
      },
      onclose: () => {
        return void 0;
      },
    },
    roomId ? chatState.talkingRoomCollection[roomId]?.ws : void 0,
    [chatState.talkingRoomCollection, authState.token],
    [roomId, onSuccessAuth]
  );

  const handleChatMessage = (
    data: WsResChat,
    token: string,
    roomId: string,
    profileDispatch: ProfileDispatch
  ) => {
    if (!(roomId in chatState.talkingRoomCollection)) {
      console.error(`not found the room (${roomId}).`);
    }

    if (data.type === "chat_message") {
      const {
        id: messageId,
        text,
        senderId,
        time,
      } = data.message as MessageJson;

      const room = chatState.talkingRoomCollection[roomId];
      const offlineMessages = room.offlineMessages;

      if (senderId === profileState.profile.id) {
        // appendMessage → offlineMessagesの該当messageを削除
        const offlineMsgIDs = offlineMessages.map(
          (offlineMessage) => offlineMessage.id
        );
        if (offlineMsgIDs.includes(messageId)) {
          chatDispatch({
            type: "APPEND_MESSAGE",
            roomId: roomId,
            messageId: messageId,
            text: text,
            senderId: senderId,
            time: time,
            meId: profileState.profile.id,
            token,
          });
          chatDispatch({
            type: "DELETE_OFFLINE_MESSAGE",
            roomId: roomId,
            messageId: messageId,
          });
        }
      } else {
        chatDispatch({
          type: "APPEND_MESSAGE",
          roomId: roomId,
          messageId: messageId,
          text: text,
          senderId: senderId,
          time: time,
          meId: profileState.profile.id,
          token,
        });
      }
    } else if (data.type === "chat_taboo_message") {
      const roomId = data.roomId;
      const messageId = data.messageId;

      Alert.alert(...ALERT_MESSAGES["SEND_TABOO"]);

      profileDispatch({
        type: "SET_IS_BANNED",
        isBan: true,
      });

      // offline messageの削除
      const room = chatState.talkingRoomCollection[roomId];
      const offlineMessages = room.offlineMessages;
      const offlineMsgIDs = offlineMessages.map(
        (offlineMessage) => offlineMessage.id
      );
      if (offlineMsgIDs.includes(messageId)) {
        chatDispatch({
          type: "DELETE_OFFLINE_MESSAGE",
          roomId: roomId,
          messageId: messageId,
        });
      }
    }
  };

  /**
   * チャットへのws接続 (roomがスタートしているかには依存しない).
   * システムメッセージの追加はここでは行わない.
   */
  const connectWsChat: ConnectWsChat = (_roomId, shouldStart) => {
    let isAlreadyStarted =
      _roomId in chatState.talkingRoomCollection &&
      chatState.talkingRoomCollection[_roomId].isStart;
    if (typeof shouldStart !== "undefined") {
      // shouldStartが指定された場合強制的にstart
      isAlreadyStarted = !shouldStart;
    }

    // set roomId・setOnSuccessAuth
    setRoomId(_roomId);
    setOnSuccessAuth({
      fn: (ws: WebSocket) => {
        if (isAlreadyStarted) {
          // すでにスタートしている
          chatDispatch({
            type: "RESTART_TALK",
            roomId: _roomId,
            ws: ws,
          });
        } else {
          // 未だスタートしていない
          chatDispatch({
            type: "START_TALK",
            roomId: _roomId,
            ws: ws,
          });
        }
      },
    });

    connectWebsocket();
  };

  return {
    connectWsChat,
  };
};

import React, { useEffect, useRef, useState } from "react";
import { Block } from "galio-framework";

import useAllContext from "../components/contexts/ContextUtils";
import { BASE_URL, BASE_URL_WS, isExpo } from "../constants/env";
import {
  URLJoin,
  asyncGetJson,
  closeWsSafely,
  Ws,
} from "../components/modules/support";
import requestAxios from "../components/modules/axios";
import {
  Dispatches,
  MeProfile,
  MeProfileIoTs,
  States,
  TalkInfoJson,
  TalkInfoJsonIoTs,
  TalkTicketCollection,
  TalkTicketCollectionJsonIoTs,
  ChatState,
  ChatDispatch,
  TalkTicketKey,
  MessageJson,
  TalkTicketJson,
} from "../components/types/Types.context";
import {
  WsResChat,
  WsResChatIoTs,
  WsSettings,
  WsResNotificationIoTs,
  WsResNotification,
} from "../components/types/Types";
import { Alert } from "react-native";
import { requestPatchProfile } from "./ProfileInput";
import { checkUpdateVersion } from "../components/modules/versionUpdate";
import { alertDeleteAuth } from "../components/modules/auth/crud";
import usePostWorry from "../components/hooks/usePostWorry";
import exeSiren from "../components/modules/siren";

const StartUpManager: React.FC = (props) => {
  const { children } = props;
  const [states, dispatches] = useAllContext();
  const { requestPostWorry } = usePostWorry(states.authState.token);

  // global stateとは別に即時反映されるmeProfile
  const [meProfileTemp, setMeProfileTemp] = useState<MeProfile>();
  const isConfiguredPushNotification = useRef(false);
  useEffect(() => {
    // meProfileTemp両方の準備が完了 && expoじゃない && pushNotification未設定 && アカウント作成済み && サインアップ終了
    if (
      meProfileTemp &&
      !isExpo &&
      !isConfiguredPushNotification.current &&
      states.authState.token &&
      states.authState.status === "Authenticated"
    ) {
      (async () => {
        const pushNotificationModule = await import(
          "../components/modules/firebase/pushNotification"
        );
        const configurePushNotification = pushNotificationModule.default;

        const deviceToken = await configurePushNotification();

        if (deviceToken) {
          if (meProfileTemp.deviceToken !== deviceToken) {
            // post deviceToken
            states.authState.token &&
              requestPatchProfile(
                states.authState.token,
                { device_token: deviceToken },
                dispatches.profileDispatch,
                () => {
                  // successSubmit
                  isConfiguredPushNotification.current = true;
                }
              );
          }
        }
      })();
    }
  }, [meProfileTemp, states.authState.token, states.authState.status]);

  useEffect(() => {
    // アカウント作成済み
    states.authState.token &&
      startUpLoggedin(
        states.authState.token,
        states,
        dispatches,
        setMeProfileTemp
      );
  }, [states.authState.token]);

  useEffect(() => {
    if (states.profileState.profileParams) {
      requestPostWorry(states.profileState.profileParams);
    }
  }, [states.authState.token, states.profileState.profileParams]);

  return <Block flex>{children}</Block>;
};

export default StartUpManager;

/**
 * ログイン済みでアプリを起動した時、またはsignup成功時に実行 */
export const startUpLoggedin = (
  token: string,
  states: States,
  dispatches: Dispatches,
  setMeProfileTemp: React.Dispatch<MeProfile>
): void => {
  if (typeof token !== "undefined") {
    checkUpdateVersion();
    exeSiren();
    requestGetProfile(token, dispatches, setMeProfileTemp);
    connectWsNotification(token, states, dispatches);
    updateTalk(token, states, dispatches);
  }
};

const requestGetProfile = (
  token: string,
  dispatches: Dispatches,
  setMeProfileTemp: React.Dispatch<MeProfile>
): void => {
  requestAxios(URLJoin(BASE_URL, "me/"), "get", MeProfileIoTs, {
    token: token,
    thenCallback: (resData) => {
      const _resData = resData as MeProfile;
      dispatches.profileDispatch({ type: "SET_ALL", profile: _resData });
      setMeProfileTemp(_resData);
    },
    catchCallback: (err) => {
      if (err?.response?.status === 401) {
        alertDeleteAuth(dispatches);
      }
    },
  });
};

/**
 * me/talk-info/をgetし、最新のtalk_tickets情報を更新。wsのconnect。
 * @param token
 * @param states
 * @param dispatches
 */
const updateTalk = (token: string, states: States, dispatches: Dispatches) => {
  requestAxios(URLJoin(BASE_URL, "me/talk-info/"), "get", TalkInfoJsonIoTs, {
    token: token,
    thenCallback: async (resData) => {
      const _resData = resData as TalkInfoJson;
      dispatches.chatDispatch({
        type: "SET_LENGTH_PARTICIPANTS",
        lengthParticipants: _resData["lengthParticipants"],
      });

      const talkTickets = _resData["talkTickets"];

      // connect wsChat
      const prevTalkTicketCollection = await asyncGetJson(
        "talkTicketCollection",
        TalkTicketCollectionJsonIoTs
      );
      if (prevTalkTicketCollection) {
        // 毎起動時
        const _prevTalkTicketCollection = prevTalkTicketCollection as TalkTicketCollection;

        // 復帰時, approvingだったら
        talkTickets
          .filter((talkTicket) => talkTicket.status.key === "approving")
          .forEach((talkTicket) => {
            if (
              _prevTalkTicketCollection[talkTicket.worry.key].status.key !==
                "approving" ||
              // prevがapprovingの時に, roomがtimeoutして別のroomとマッチしapprovingである状態
              (talkTicket.room?.id &&
                talkTicket.room.id !==
                  _prevTalkTicketCollection[talkTicket.worry.key].room.id)
            ) {
              // 未だトークの承認準備がされていない
              dispatches.chatDispatch({
                type: "UPDATE_TALK_TICKETS",
                talkTickets: [talkTicket],
              });
              startApprovingTalk(dispatches.chatDispatch, talkTicket.worry.key);
            }
          });

        // 復帰時, talkingだったら
        talkTickets
          .filter((talkTicket) => talkTicket.status.key === "talking")
          .forEach((talkTicket) => {
            if (
              _prevTalkTicketCollection[talkTicket.worry.key].status.key ===
              "talking"
            ) {
              // 既にトークは開始されているが、wsは接続されていない
              if (
                !states.chatState.talkTicketCollection[talkTicket.worry.key]
                  .room.ws
              )
                if (talkTicket.room)
                  reconnectWsChat(
                    talkTicket.room.id,
                    token,
                    states,
                    dispatches,
                    talkTicket
                  );
            } else {
              // 未だトークが開始されていない
              if (talkTicket.room) {
                dispatches.chatDispatch({
                  type: "UPDATE_TALK_TICKETS",
                  talkTickets: [talkTicket],
                });
                startApprovingTalk(
                  dispatches.chatDispatch,
                  talkTicket.worry.key
                );
              }
            }
          });

        // 復帰時, waitingだったら(実際, roomのtimeout後にマッチしなかった場合)
        talkTickets
          .filter((talkTicket) => talkTicket.status.key === "waiting")
          .forEach((talkTicket) => {
            if (
              _prevTalkTicketCollection[talkTicket.worry.key].status.key !==
                "waiting" ||
              // prevがwaitingの時に, roomがtimeoutして別のroomとマッチせずにwaitingである状態
              (talkTicket.room?.id &&
                talkTicket.room.id !==
                  _prevTalkTicketCollection[talkTicket.worry.key].room.id)
            ) {
              // statusがwaitingに切り替わっている
              dispatches.chatDispatch({
                type: "UPDATE_TALK_TICKETS",
                talkTickets: [talkTicket],
              });
            }
          });

        // 復帰時, finishingだったら
        talkTickets
          .filter((talkTicket) => talkTicket.status.key === "finishing")
          .forEach((talkTicket) => {
            if (
              _prevTalkTicketCollection[talkTicket.worry.key].status.key ===
              "talking"
            ) {
              // 既にトーク中であったが、quitからforegroundに復帰したらトークが終了していた。
              dispatches.chatDispatch({
                type: "END_TALK",
                talkTicketKey: talkTicket.worry.key,
              });
            } else {
              // quit中にトークの開始・終了が行われた。
              if (talkTicket.room) {
                dispatches.chatDispatch({
                  type: "UPDATE_TALK_TICKETS",
                  talkTickets: [talkTicket],
                });

                // 実際ここでやってるのはapprovingのcommonMessageの追加のみ
                startApprovingTalk(
                  dispatches.chatDispatch,
                  talkTicket.worry.key
                );

                // 実際ここでやってるのはtalk endのcommonMessageの追加のみ
                dispatches.chatDispatch({
                  type: "END_TALK",
                  talkTicketKey: talkTicket.worry.key,
                });
              }
            }
          });

        Object.keys(_prevTalkTicketCollection).forEach((key) => {
          if (!talkTickets.some((talkTicket) => talkTicket.worry.key === key)) {
            dispatches.chatDispatch({
              type: "REMOVE_TALK_TICKETS",
              talkTicketKeys: [key],
            });
          }
        });
      } else {
        // signup直後一回のみ
        dispatches.chatDispatch({
          type: "UPDATE_TALK_TICKETS",
          talkTickets: talkTickets,
        });
        talkTickets
          .filter((talkTicket) => talkTicket.status.key === "talking")
          .forEach((talkTicket) => {
            if (talkTicket.room) {
              startApprovingTalk(dispatches.chatDispatch, talkTicket.worry.key);
            }
          });
      }
    },
  });
};

const handleChatMessage = (
  data: WsResChat,
  chatState: ChatState,
  chatDispatch: ChatDispatch,
  token: string,
  talkTicketKey: TalkTicketKey
) => {
  if (data.type === "chat_message") {
    const { messageId, message, isMe, time } = data.message as MessageJson;

    // (謎)chatStateが更新されない←原因は救命できていない。talkTicketCollectionはObjectでアドレスは一定しているので成り立っている。
    const talkTicket = chatState.talkTicketCollection[talkTicketKey];
    const offlineMessages = talkTicket.room.offlineMessages;

    if (isMe) {
      // appendMessage → offlineMessagesの該当messageを削除
      const offlineMsgIDs = offlineMessages.map(
        (offlineMessage) => offlineMessage.messageId
      );
      if (offlineMsgIDs.indexOf(messageId) >= 0) {
        chatDispatch({
          type: "APPEND_MESSAGE",
          talkTicketKey,
          messageId: messageId,
          message,
          isMe,
          time,
          token,
        });
        chatDispatch({
          type: "DELETE_OFFLINE_MESSAGE",
          talkTicketKey,
          messageId: messageId,
        });
      }
    } else {
      chatDispatch({
        type: "APPEND_MESSAGE",
        talkTicketKey,
        messageId: messageId,
        message,
        isMe,
        time,
        token,
      });
    }
  }
  // else if (data.type === "multi_chat_messages") {
  //   const messages = data.messages as MessageJson[];
  //   chatDispatch({ type: "MERGE_MESSAGES", talkTicketKey, messages, token });
  // }
};

type WsProps = {
  roomId: string;
  token: string;
  states: States;
  dispatches: Dispatches;
  init: boolean;
  callbackSuccess: (data: WsResChat, ws: WebSocket) => void;
  talkTicket: TalkTicketJson;
};
/**
 * response talk request.
 * If you are a request user and you are starting a talk, init is true. */
const _connectWsChat = (wsProps: WsProps) => {
  const {
    roomId,
    token,
    states,
    dispatches,
    init,
    callbackSuccess,
    talkTicket,
  } = wsProps;

  const wsSettings: WsSettings = {
    url: URLJoin(BASE_URL_WS, "chat/", roomId),
    typeIoTsOfResData: WsResChatIoTs,
    onopen: (ws: WebSocket) => {
      ws.send(
        JSON.stringify({
          type: "auth",
          token,
          init,
          is_speaker: talkTicket.isSpeaker,
        })
      );
    },
    onmessage: (eData, e, ws, isReconnect) => {
      const data = eData as WsResChat;
      const talkTicketKey = talkTicket.worry.key;

      switch (data.type) {
        case "auth":
          if (isReconnect) {
            dispatches.chatDispatch({
              type: "RECONNECT_TALK",
              ws,
              talkTicketKey,
            });
          } else {
            callbackSuccess(data, ws);
          }

          if (
            "notStoredMessages" in data &&
            data.notStoredMessages.length > 0
          ) {
            const messages = data.notStoredMessages as MessageJson[];
            dispatches.chatDispatch({
              type: "MERGE_MESSAGES",
              talkTicketKey,
              messages,
              token,
            });
          }

          if ("isAlreadyEnded" in data && data.isAlreadyEnded) {
            dispatches.chatDispatch({
              type: "END_TALK",
              talkTicketKey: talkTicketKey,
            });
          }
          break;

        case "end_talk_alert":
          // not used
          dispatches.profileDispatch({
            type: "SET_ALL",
            profile: data.profile,
          });
          dispatches.chatDispatch({
            type: "APPEND_COMMON_MESSAGE",
            talkTicketKey,
            alert: true,
          });
          break;

        case "end_talk_time_out":
          // time out時は, statusをwaitingに
          dispatches.profileDispatch({
            type: "SET_ALL",
            profile: data.profile,
          });
          dispatches.chatDispatch({
            type: "UPDATE_TALK_TICKETS",
            talkTickets: [data.talkTicket],
          });
          break;

        case "end_talk":
          dispatches.profileDispatch({
            type: "SET_ALL",
            profile: data.profile,
          });
          dispatches.chatDispatch({ type: "END_TALK", talkTicketKey });
          break;

        case "error":
          if (data.message) Alert.alert(data.message);
          closeWsSafely(ws);
          break;

        default:
          break;
      }
      handleChatMessage(
        data,
        states.chatState,
        dispatches.chatDispatch,
        token,
        talkTicketKey
      );
    },
    onclose: () => {
      return void 0;
    },
  };
  new Ws(wsSettings);
};

export const initConnectWsChat = (
  roomId: string,
  token: string,
  states: States,
  dispatches: Dispatches,
  talkTicket: TalkTicketJson
): void => {
  _connectWsChat({
    roomId,
    token,
    states,
    dispatches,
    init: true,
    callbackSuccess: (data, ws) => {
      dispatches.chatDispatch({
        type: "START_TALK",
        talkTicketKey: talkTicket.worry.key,
        ws,
      });
    },
    talkTicket,
  });
};

const startApprovingTalk = (
  chatDispatch: ChatDispatch,
  _talkTicketKey: TalkTicketKey
): void => {
  chatDispatch({
    type: "START_APPROVING_TALK",
    talkTicketKey: _talkTicketKey,
  });
};

const reconnectWsChat = (
  roomId: string,
  token: string,
  states: States,
  dispatches: Dispatches,
  talkTicket: TalkTicketJson
) => {
  const talkTicketKey = talkTicket.worry.key;
  if (roomId) {
    _connectWsChat({
      roomId,
      token,
      states,
      dispatches,
      init: false,
      callbackSuccess: (data, ws) => {
        dispatches.chatDispatch({ type: "RESTART_TALK", talkTicketKey, ws });
      },
      talkTicket,
    });
  } else {
    // 相手が退出していた場合, talking statusだがroomがnullなため
    dispatches.chatDispatch({
      type: "RESTART_TALK_ONLY_MESSAGE",
      talkTicketKey,
    });
  }
};

const connectWsNotification = (
  token: string,
  states: States,
  dispatches: Dispatches
) => {
  const wsSettings: WsSettings = {
    url: URLJoin(BASE_URL_WS, "notification/"),
    typeIoTsOfResData: WsResNotificationIoTs,
    onopen: (ws) => {
      ws.send(JSON.stringify({ type: "auth", token: token }));
    },
    onmessage: (eData) => {
      const data = eData as WsResNotification;
      if (data.type === "auth") {
        // 認証完了
      } else if (data.type === "notice_talk") {
        if (data.status === "start") {
          if (data.talkTicket) {
            // updateTalk(token, states, dispatches);
            dispatches.chatDispatch({
              type: "UPDATE_TALK_TICKETS",
              talkTickets: [data.talkTicket],
            });
            startApprovingTalk(
              dispatches.chatDispatch,
              data.talkTicket.worry.key
            );
          }
        } else if (data.status === "end") {
          // end 多分使わない
        }
      }
    },
    onclose: () => {
      return void 0;
    },
  };

  // initWs(wsSettings);
  new Ws(wsSettings);
};

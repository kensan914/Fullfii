import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useRef,
} from "react";

import { isExpo } from "src/constants/env";
import { isString, closeWsSafely } from "src/utils";
import { asyncStoreTalkingRoomCollection } from "src/utils/asyncStorage";
import {
  ChatState,
  ChatDispatch,
  TalkTicketCollection,
  ChatActionType,
  TalkTicket,
  CommonMessage,
  Message,
  OfflineMessage,
  TalkingRoom,
  TalkingRoomCollection,
  Room,
  CommonMessageSettings,
  Profile,
} from "src/types/Types.context";
import {
  canAddCommonMessage,
  checkAndAddCommonMessage,
  geneCommonMessage,
  getTotalUnreadNum,
} from "src/utils/chat/chatContextUtils";
import { Alert } from "react-native";

/**
 * dispatchを遅延するべきか判定し、遅延する場合actionをchatDispatchTask.queueにエンキューしreturn
 * @param prevState
 * @param action
 */
const checkAndDoDelayDispatch = (
  prevState: ChatState,
  action: ChatActionType
): ChatState | null => {
  // TURN_ON_DELAY や TURN_OFF_DELAYの時や, excludeTypeに当てはまる時は遅延対象外
  if (
    action.type === "TURN_ON_DELAY" ||
    action.type === "TURN_OFF_DELAY" ||
    prevState.chatDispatchTask.excludeType.includes(action.type)
  ) {
    return null;
  }

  let _chatDispatchTask;
  if (prevState.chatDispatchTask.status === "DELAY") {
    _chatDispatchTask = prevState.chatDispatchTask;
    _chatDispatchTask.queue = [..._chatDispatchTask.queue, action];

    return {
      ...prevState,
      chatDispatchTask: _chatDispatchTask,
    };
  }
  return null;
};

const consoleErrorNotFountRoom = (_roomId: string): void => {
  console.error(`not found the room (id: ${_roomId}).`);
};

const chatReducer = (
  prevState: ChatState,
  action: ChatActionType
): ChatState => {
  let _offlineMessages: OfflineMessage[];
  let _talkTicketCollection: TalkTicketCollection;
  let _talkTicket: TalkTicket;
  // ↑未使用

  let _talkingRoomCollection: TalkingRoomCollection;
  let _talkingRoom: TalkingRoom;

  // 遅延するべきか判定 ? return chatState : return null;
  const resultDelay = checkAndDoDelayDispatch(prevState, action);
  if (resultDelay) return resultDelay;

  switch (action.type) {
    case "INIT_TALKING_ROOM": {
      /** roomJson(RoomJson)を受け取り、TalkingRoomParts部分を追加してtalkingRoomCollectionに追加. 既に存在する場合は更新(上書き)する.
       * @param {Object} action [type, roomJson] */

      _talkingRoomCollection = { ...prevState.talkingRoomCollection };

      // RoomJsonの場合、createdAtをインスタンス化し、Roomに
      const roomJson = action.roomJson;
      const room: Room = { ...roomJson, ...{ createdAt: new Date() } };
      if (roomJson.createdAt) {
        room.createdAt = new Date(roomJson.createdAt);
      }

      const talkingRoom = {
        ...room,
        messages: [],
        offlineMessages: [],
        unreadNum: 0,
        ws: null,
        isStart: false,
      };

      _talkingRoomCollection[talkingRoom.id] = talkingRoom;

      return {
        ...prevState,
        talkingRoomCollection: _talkingRoomCollection,
      };
    }

    case "UPDATE_TALKING_ROOM": {
      /** 受け取ったroomJsonから既に登録されている該当のtalkingRoomのプロパティを更新.
       * TalkingRoomParts部分(messages等)は更新しない. 該当のtalkingRoomが存在しなかったらスキップ.
       * @param {Object} action [type, roomJson] */

      _talkingRoomCollection = { ...prevState.talkingRoomCollection };

      if (!(action.roomJson.id in _talkingRoomCollection)) {
        return { ...prevState };
      }

      const roomJson = action.roomJson;
      const room: Room = { ...roomJson, ...{ createdAt: new Date() } };
      if (roomJson.createdAt) {
        room.createdAt = new Date(roomJson.createdAt);
      }

      _talkingRoomCollection[roomJson.id] = {
        ..._talkingRoomCollection[roomJson.id],
        ...room,
      };

      return {
        ...prevState,
        talkingRoomCollection: _talkingRoomCollection,
      };
    }

    case "APPEND_OFFLINE_MESSAGE": {
      /** offlineMessageを作成し、追加
       * @param {Object} action [type, roomId, messageId, text, senderId, time] */

      const offlineMessage: OfflineMessage = {
        id: action.messageId,
        text: action.text,
        senderId: action.senderId,
        time: action.time,
        isOffline: true,
      };

      _talkingRoomCollection = { ...prevState.talkingRoomCollection };
      _talkingRoom = _talkingRoomCollection[action.roomId];
      if (!_talkingRoom) {
        return { ...prevState };
      }

      _offlineMessages = [..._talkingRoom.offlineMessages, offlineMessage];
      _talkingRoomCollection[action.roomId].offlineMessages = _offlineMessages;

      asyncStoreTalkingRoomCollection(_talkingRoomCollection);
      return {
        ...prevState,
        talkingRoomCollection: _talkingRoomCollection,
      };
    }

    case "APPEND_COMMON_MESSAGE": {
      /** 各システムメッセージ追加.
       * @param {Object} action [type, roomId, commonMessageSettings] */

      _talkingRoomCollection = { ...prevState.talkingRoomCollection };
      _talkingRoom = _talkingRoomCollection[action.roomId];
      if (!_talkingRoom) {
        consoleErrorNotFountRoom(action.roomId);
        return { ...prevState };
      }

      _talkingRoom.messages = checkAndAddCommonMessage(
        _talkingRoom.messages,
        action.commonMessageSettings
      );

      _talkingRoomCollection[action.roomId] = _talkingRoom;

      asyncStoreTalkingRoomCollection(_talkingRoomCollection);
      return {
        ...prevState,
        talkingRoomCollection: _talkingRoomCollection,
      };
    }

    case "START_TALK": {
      /** トーク開始時(作成者にとっては初の参加者が入った時, 参加者にとっては参加した時)に1回だけ実行.
       * talkingRoom.isStartがfalseの時にのみ処理を行う. 完了後, talkingRoom.isStartをtrueに.
       * initMessage追加 & set ws.
       * @param {Object} action [type, roomId, ws] */

      _talkingRoomCollection = { ...prevState.talkingRoomCollection };
      _talkingRoom = _talkingRoomCollection[action.roomId];
      if (!_talkingRoom) {
        consoleErrorNotFountRoom(action.roomId);
        return { ...prevState };
      }

      // すでにスタート済み
      if (_talkingRoom.isStart) {
        console.error(`the room (id: ${action.roomId}) has already started.`);
        return { ...prevState };
      }

      if (
        /* not空object判定(すでにwsが入っている場合). 空objectはtrueを返すため, このような評価 */
        _talkingRoom.ws !== null &&
        Object.keys(_talkingRoom.ws).length
      ) {
        // WSの重複を防ぐ
        closeWsSafely(action.ws);
        return { ...prevState };
      } else {
        _talkingRoom.ws = action.ws;
        _talkingRoom.isStart = true;

        _talkingRoomCollection[action.roomId] = _talkingRoom;

        asyncStoreTalkingRoomCollection(_talkingRoomCollection);
        return {
          ...prevState,
          talkingRoomCollection: _talkingRoomCollection,
        };
      }
    }

    case "RESTART_TALK": {
      /** トーク再接続時に実行.
       * talkingRoom.isStartがtrueの時にのみ処理を行う. (="START_TALK"実行済み)
       * messagesのtimeのインスタンス化 & offlineMessages = [] & set ws.
       * @param {Object} action [type, talkTicketKey, ws] */

      _talkingRoomCollection = { ...prevState.talkingRoomCollection };
      _talkingRoom = _talkingRoomCollection[action.roomId];
      if (!_talkingRoom) {
        consoleErrorNotFountRoom(action.roomId);
        return { ...prevState };
      }

      // 未だスタートしていない
      if (!_talkingRoom.isStart) {
        console.error(`the room (id: ${action.roomId}) has already started.`);
        return { ...prevState };
      }

      if (
        /* not空object判定(すでにwsが入っている場合). 空objectはtrueを返すため, このような評価 */
        _talkingRoom.ws !== null &&
        Object.keys(_talkingRoom.ws).length
      ) {
        // WSの重複を防ぐ
        closeWsSafely(action.ws);
        return { ...prevState };
      } else {
        _talkingRoom.ws = action.ws;
        _talkingRoom.messages.forEach((message, index) => {
          const targetMessage = _talkingRoom.messages[index];
          if ("time" in targetMessage && "time" in message)
            targetMessage.time = new Date(message.time);
        });
        _talkingRoom.offlineMessages = [];

        _talkingRoomCollection[action.roomId] = _talkingRoom;

        asyncStoreTalkingRoomCollection(_talkingRoomCollection);
        return {
          ...prevState,
          talkingRoomCollection: _talkingRoomCollection,
        };
      }
    }

    case "RECONNECT_TALK": {
      /** wsをset. wsが切断され再接続された際に実行
       * @param {Object} action [type, ws, roomId] */

      _talkingRoomCollection = { ...prevState.talkingRoomCollection };
      _talkingRoom = _talkingRoomCollection[action.roomId];
      if (!_talkingRoom) {
        consoleErrorNotFountRoom(action.roomId);
        return { ...prevState };
      }

      _talkingRoom.ws = action.ws;

      _talkingRoomCollection[action.roomId] = _talkingRoom;

      asyncStoreTalkingRoomCollection(_talkingRoomCollection);
      return {
        ...prevState,
        talkingRoomCollection: _talkingRoomCollection,
      };
    }

    case "MERGE_MESSAGES": {
      /** 受け取ったmessagesを統合 未読値をインクリメント ストア通知 (messagesの中身は全てキャメルケース)
       * @param {Object} action [type, roomId, meId, messages, token] */

      _talkingRoomCollection = { ...prevState.talkingRoomCollection };
      _talkingRoom = _talkingRoomCollection[action.roomId];
      if (!_talkingRoom) {
        consoleErrorNotFountRoom(action.roomId);
        return { ...prevState };
      }

      let incrementNum_MM = 0;
      const messages: Message[] = action.messages
        .filter((elm) => {
          if (
            _talkingRoom.messages.some((_message) => {
              return _message.id === elm.id;
            })
          ) {
            // 既に該当のmessageが存在する(保存状況の送信がうまくいっていなかった場合)
            return false;
          } else {
            return true;
          }
        })
        .map((elm) => {
          if (elm.senderId !== action.meId) incrementNum_MM += 1; // 他人のメッセージだったらインクリメント
          return {
            id: elm.id,
            text: elm.text,
            senderId: elm.senderId,
            time: isString(elm.time) ? new Date(elm.time) : elm.time,
          };
        });

      _talkingRoom.messages = [..._talkingRoom.messages, ...messages];
      const prevUnreadNum_MM = _talkingRoom.unreadNum;
      _talkingRoom.unreadNum = prevUnreadNum_MM + incrementNum_MM;

      _talkingRoomCollection[action.roomId] = _talkingRoom;

      asyncStoreTalkingRoomCollection(_talkingRoomCollection);

      // store message data. and report that it was stored safely to the server.
      _talkingRoom.ws &&
        _talkingRoom.ws.send(
          JSON.stringify({ type: "store_by_room", token: action.token })
        );

      return {
        ...prevState,
        talkingRoomCollection: _talkingRoomCollection,
        totalUnreadNum: prevState.totalUnreadNum + incrementNum_MM,
      };
    }

    case "I_END_TALK": {
      /** 自身がトークを終了した. messages, offlineMessagesの削除, unreadNum, totalUnreadNumの変更., ws.close(). ルームを終了状態に.
       * どのメンバーも(被退室メンバーも)必ず自分で退室したタイミングに実行する.
       * @param {Object} action [type, roomId] */

      _talkingRoomCollection = { ...prevState.talkingRoomCollection };
      _talkingRoom = _talkingRoomCollection[action.roomId];
      if (!_talkingRoom) {
        consoleErrorNotFountRoom(action.roomId);
        return { ...prevState };
      }

      // _talkingRoom.messages = [];
      _talkingRoom.offlineMessages = [];
      _talkingRoom.isEnd = true;
      _talkingRoom.ws && closeWsSafely(_talkingRoom.ws);

      _talkingRoomCollection[action.roomId] = _talkingRoom;

      asyncStoreTalkingRoomCollection(_talkingRoomCollection);
      return {
        ...prevState,
        talkingRoomCollection: _talkingRoomCollection,
      };
    }

    case "MEMBER_END_TALK": {
      /** メンバーがトークを終了した. システムメッセージの追加. ルームを終了状態に.
       * @param {Object} action [type, roomId, meId] */

      _talkingRoomCollection = { ...prevState.talkingRoomCollection };
      _talkingRoom = _talkingRoomCollection[action.roomId];
      if (!_talkingRoom) {
        consoleErrorNotFountRoom(action.roomId);
        return { ...prevState };
      }

      // すでに終了していた場合, ルーム退室者本人であるため処理をスキップ (参加者が１人までという現時点での仕様により).
      // if (_talkingRoom.isEnd) {
      //   return { ...prevState };
      // }

      if (_talkingRoom.messages.length > 0) {
        const leftCommonMessages: CommonMessage[] = [];
        _talkingRoom.leftMembers
          .filter((_leftMember) => _leftMember.id !== action.meId) // 自身を含めない
          .forEach((_leftMember) => {
            const leftCommonMessageSettings: CommonMessageSettings = {
              type: "END",
              targetUser: _leftMember,
            };
            if (
              canAddCommonMessage(
                _talkingRoom.messages,
                leftCommonMessageSettings
              )
            ) {
              leftCommonMessages.push(
                geneCommonMessage(leftCommonMessageSettings)
              );
            }
          });

        _talkingRoom.messages = [
          ..._talkingRoom.messages,
          ...leftCommonMessages,
        ];

        // let targetUser: Profile | undefined;
        // if (_talkingRoom.owner.id === action.meId) {
        //   // 自身が作成者の時
        //   if (_talkingRoom.participants.length > 0) {
        //     targetUser = _talkingRoom.participants[0]; // 参加者が１人までという現時点での仕様により
        //   }
        // } else {
        //   // 自身が参加者の時
        //   targetUser = _talkingRoom.owner;
        // }

        // if (targetUser) {
        //   _talkingRoom.messages = checkAndAddCommonMessage(_talkingRoom.messages, {
        //     type: "END",
        //     targetUser: targetUser,
        //   });
        // }
      }

      _talkingRoom.isEnd = true;

      _talkingRoomCollection[action.roomId] = _talkingRoom;

      asyncStoreTalkingRoomCollection(_talkingRoomCollection);
      return {
        ...prevState,
        talkingRoomCollection: _talkingRoomCollection,
      };
    }

    case "CLOSE_TALK": {
      /** トークのクローズ. stateからのルームの削除.
       * @param {Object} action [type, roomId] */

      _talkingRoomCollection = { ...prevState.talkingRoomCollection };
      _talkingRoom = _talkingRoomCollection[action.roomId];
      if (!_talkingRoom) {
        consoleErrorNotFountRoom(action.roomId);
        return { ...prevState };
      }

      delete _talkingRoomCollection[action.roomId];

      asyncStoreTalkingRoomCollection(_talkingRoomCollection);
      return {
        ...prevState,
        talkingRoomCollection: _talkingRoomCollection,
      };
    }

    case "APPEND_MESSAGE": {
      /** messageを作成し, 追加. 未読値をインクリメント ストア通知
       * @param {Object} action [type, roomId, messageId, text, senderId, time(str or Date), meId, token] */

      const message: Message = {
        id: action.messageId,
        text: action.text,
        senderId: action.senderId,
        time:
          typeof action.time === "string" ? new Date(action.time) : action.time,
      };

      _talkingRoomCollection = { ...prevState.talkingRoomCollection };
      _talkingRoom = _talkingRoomCollection[action.roomId];
      if (!_talkingRoom) {
        consoleErrorNotFountRoom(action.roomId);
        return { ...prevState };
      }

      _talkingRoom.messages = [..._talkingRoom.messages, message];
      const prevUnreadNum_AM = _talkingRoom.unreadNum;
      const incrementNum_AM = action.senderId === action.meId ? 0 : 1;
      _talkingRoom.unreadNum = prevUnreadNum_AM + incrementNum_AM;

      _talkingRoomCollection[action.roomId] = _talkingRoom;

      asyncStoreTalkingRoomCollection(_talkingRoomCollection);

      // store message data. and report that it was stored safely to the server.
      _talkingRoom.ws &&
        _talkingRoom.ws.send(
          JSON.stringify({
            type: "store",
            message_id: action.messageId,
          })
        );

      return {
        ...prevState,
        talkingRoomCollection: _talkingRoomCollection,
        totalUnreadNum: prevState.totalUnreadNum + incrementNum_AM,
      };
    }

    case "DELETE_OFFLINE_MESSAGE": {
      /** 受け取ったmessageIdに該当するofflineMessageを削除
       * @param {Object} action [type, roomId, messageId] */

      _talkingRoomCollection = { ...prevState.talkingRoomCollection };
      _talkingRoom = _talkingRoomCollection[action.roomId];
      if (!_talkingRoom) {
        consoleErrorNotFountRoom(action.roomId);
        return { ...prevState };
      }

      const prevOfflineMessages = _talkingRoom.offlineMessages;
      _offlineMessages = prevOfflineMessages.filter(
        (elm) => elm.id !== action.messageId
      );
      _talkingRoomCollection[action.roomId].offlineMessages = _offlineMessages;

      asyncStoreTalkingRoomCollection(_talkingRoomCollection);

      return {
        ...prevState,
        talkingRoomCollection: _talkingRoomCollection,
      };
    }

    case "READ_BY_ROOM": {
      /** トーキングルームごとの既読処理 該当のチャットルームの全てのmessageを既読に チャットルームを開いたときに実行
       * @param {Object} action [type, roomId] */

      _talkingRoomCollection = { ...prevState.talkingRoomCollection };
      _talkingRoom = _talkingRoomCollection[action.roomId];
      if (!_talkingRoom) {
        consoleErrorNotFountRoom(action.roomId);
        return { ...prevState };
      }

      const unreadNum = _talkingRoom.unreadNum;
      const totalUnreadNum = prevState.totalUnreadNum - unreadNum;
      _talkingRoomCollection[action.roomId].unreadNum = 0;

      // send read (既読をサーバに通知)
      _talkingRoom.ws &&
        // isForceSendReadNotification(Chat内で呼ばれた時)は強制送信.
        // それ以外(HomeからChatに画面遷移等)は未読が存在する時にのみ送信.
        (action.isForceSendReadNotification || unreadNum > 0) &&
        _talkingRoom.ws.send(
          JSON.stringify({ type: "read", token: action.token })
        );

      // update badge count
      (action.isForceSendReadNotification || unreadNum > 0) &&
        !isExpo &&
        (async () => {
          const pushNotificationModule = await import(
            "src/utils/firebase/pushNotification"
          );
          const updateBudgeCount = pushNotificationModule.updateBudgeCount;
          updateBudgeCount(totalUnreadNum);
        })();

      asyncStoreTalkingRoomCollection(_talkingRoomCollection);
      return {
        ...prevState,
        talkingRoomCollection: _talkingRoomCollection,
        totalUnreadNum: totalUnreadNum,
      };
    }

    case "TURN_ON_DELAY": {
      /** delayモードをONにする. ONの間, chatDispatchは遅延される
       * @param {Object} action [type, excludeType] */

      return {
        ...prevState,
        chatDispatchTask: {
          status: "DELAY",
          queue: [],
          excludeType: action.excludeType,
        },
      };
    }

    case "TURN_OFF_DELAY": {
      /** delayモードをOFFにする. taskの実行はコード下部useEffect内で
       * @param {Object} action [type] */

      return {
        ...prevState,
        chatDispatchTask: {
          status: "GO",
          queue: prevState.chatDispatchTask.queue,
          excludeType: [],
        },
      };
    }

    case "EXECUTED_DELAY_DISPATCH": {
      /** delayモードがONからOFFになった時に実行されたdispatchの実行直後
       * @param {Object} action [type] */

      return {
        ...prevState,
        chatDispatchTask: {
          status: "GO",
          queue: [],
          excludeType: [],
        },
      };
    }

    case "DANGEROUSLY_RESET":
      /** chat stateを初期化.
       * @param {Object} action [type] */

      return { ...initChatState };

    default:
      console.warn(`Not found thi action.type.`);
      return { ...prevState };
  }
};

const initChatState: ChatState = Object.freeze({
  chatDispatchTask: { status: "GO", queue: [], excludeType: [] },
  totalUnreadNum: 0,
  talkingRoomCollection: {},
});
const ChatStateContext = createContext<ChatState>(initChatState);
const ChatDispatchContext = createContext<ChatDispatch>(() => {
  return void 0;
});

export const useChatState = (): ChatState => {
  const context = useContext(ChatStateContext);
  return context;
};
export const useChatDispatch = (): ChatDispatch => {
  const context = useContext(ChatDispatchContext);
  return context;
};

type Props = {
  talkingRoomCollection: TalkingRoomCollection | null;
};
export const ChatProvider: React.FC<Props> = ({
  children,
  talkingRoomCollection,
}) => {
  const [chatState, chatDispatch] = useReducer(chatReducer, {
    chatDispatchTask: { status: "GO", queue: [], excludeType: [] },
    totalUnreadNum: talkingRoomCollection
      ? getTotalUnreadNum(talkingRoomCollection)
      : 0,
    talkingRoomCollection: talkingRoomCollection
      ? { ...talkingRoomCollection }
      : {},
  });

  // delayモードが終了した時にtaskを全て実行
  const prevChatDispatchTaskStatus = useRef("GO");
  useEffect(() => {
    if (
      chatState.chatDispatchTask.status !==
        prevChatDispatchTaskStatus.current &&
      chatState.chatDispatchTask.status === "GO"
    ) {
      const _chatDispatchTask = chatState.chatDispatchTask;
      _chatDispatchTask.queue.forEach((chatDispatchAction) => {
        chatDispatch(chatDispatchAction);
      });
      chatDispatch({ type: "EXECUTED_DELAY_DISPATCH" });
    }
    prevChatDispatchTaskStatus.current = chatState.chatDispatchTask.status;
  }, [chatState.chatDispatchTask.status]);

  return (
    <ChatStateContext.Provider value={chatState}>
      <ChatDispatchContext.Provider value={chatDispatch}>
        {children}
      </ChatDispatchContext.Provider>
    </ChatStateContext.Provider>
  );
};

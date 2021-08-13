import { useChatDispatch, useChatState } from "src/contexts/ChatContext";
import {
  TalkInfoJson,
  TalkingRoomCollectionAsync,
  TalkingRoomCollectionAsyncIoTs,
} from "src/types/Types.context";
import { equalsArray } from "src/utils";
import { asyncGetObject } from "src/utils/asyncStorage";
import { useWsChat } from "./useWsChat";

type UpdateTalk = (talkInfoJson: TalkInfoJson) => void;
type UseUpdateTalk = () => {
  updateTalk: UpdateTalk;
};
export const useUpdateTalk: UseUpdateTalk = () => {
  const chatDispatch = useChatDispatch();
  const chatState = useChatState();
  const { connectWsChat } = useWsChat();

  /**トークを最新状態にする
   *
   * @param createdRoomsJson
   * @param participatingRoomsJson
   */
  const updateTalk: UpdateTalk = async (talkInfoJson) => {
    const createdRoomsJson = talkInfoJson["createdRooms"];
    const participatingRoomsJson = talkInfoJson["participatingRooms"];

    // タイトル等々, 上書き更新 (メッセージ等以外)
    // if (exists) 更新 else 新規作成.
    createdRoomsJson.forEach((_createdRoomJson) => {
      if (_createdRoomJson.id in chatState.talkingRoomCollection) {
        chatDispatch({
          type: "UPDATE_TALKING_ROOM",
          roomJson: _createdRoomJson,
        });
      } else {
        // async storageに古いtalkingRoomCollectionが存在しないにもかかわらず, バック側でtalkingRoom情報があった場合 (本来起こるはずがないイレギュラー処理だが, 万が一対応できるように)
        if (!_createdRoomJson.isEnd) {
          chatDispatch({
            type: "INIT_TALKING_ROOM",
            roomJson: _createdRoomJson,
          });
          chatDispatch({
            type: "APPEND_COMMON_MESSAGE",
            roomId: _createdRoomJson.id,
            commonMessageSettings: {
              type: "CREATED_ROOM",
            },
          });
        }
      }
    });
    participatingRoomsJson.forEach((_participatingRoomJson) => {
      if (_participatingRoomJson.id in chatState.talkingRoomCollection) {
        chatDispatch({
          type: "UPDATE_TALKING_ROOM",
          roomJson: _participatingRoomJson,
        });
      } else {
        // async storageに古いtalkingRoomCollectionが存在しないにもかかわらず, バック側でtalkingRoom情報があった場合 (本来起こるはずがないイレギュラー処理だが, 万が一対応できるように)
        if (!_participatingRoomJson.isEnd) {
          chatDispatch({
            type: "INIT_TALKING_ROOM",
            roomJson: _participatingRoomJson,
          });
          connectWsChat(_participatingRoomJson.id, true);
          chatDispatch({
            type: "APPEND_COMMON_MESSAGE",
            roomId: _participatingRoomJson.id,
            commonMessageSettings: {
              type: "I_PARTICIPATED",
              owner: _participatingRoomJson.owner,
              isSpeaker: _participatingRoomJson.isSpeaker,
            },
          });
        }
      }
    });

    const prevTalkingRoomCollection = (await asyncGetObject(
      "talkingRoomCollection",
      TalkingRoomCollectionAsyncIoTs
    )) as TalkingRoomCollectionAsync;

    // async storageに古いtalkingRoomCollectionが存在する場合のみ処理
    if (prevTalkingRoomCollection) {
      // chat websocket再接続. 終了していたとしてもメッセージ更新のため, 全てのスタート済みのトークは再接続する.
      // そもそもトーク終了は, chat_authのレスポンスで検知するため, 始まっているトークは必ず再接続.
      Object.values(prevTalkingRoomCollection).forEach((_prevTalkingRoom) => {
        if (_prevTalkingRoom.isStart) {
          connectWsChat(_prevTalkingRoom.id, false);
        }

        // HACK: トーク開始時isStartがtrueにならなかった場合の対処. (☚現在原因を調査中)
        if (
          !_prevTalkingRoom.isStart &&
          _prevTalkingRoom.participants.length > 0
        ) {
          connectWsChat(_prevTalkingRoom.id, true);
        }
      });

      // 参加者追加. quit時に自身が作成したルームに誰かが参加してくれた場合.
      createdRoomsJson.forEach((_createdRoomJson) => {
        const prevParticipantIds = prevTalkingRoomCollection[
          _createdRoomJson.id
        ].participants.map((_prevParticipant) => _prevParticipant.id);
        const newParticipantIds = _createdRoomJson.participants.map(
          (_newParticipant) => _newParticipant.id
        );

        // 誰かが参加した
        if (!equalsArray(prevParticipantIds, newParticipantIds)) {
          // 未スタートの場合, トーク開始
          if (!prevTalkingRoomCollection[_createdRoomJson.id].isStart) {
            connectWsChat(_createdRoomJson.id, true);
          }

          // 古いtalkingRoom.participantsに含まれない新参加者
          const participants = _createdRoomJson.participants.filter(
            (_newParticipant) => {
              return !prevParticipantIds.includes(_newParticipant.id);
            }
          );
          participants.forEach((_participant) => {
            chatDispatch({
              type: "APPEND_COMMON_MESSAGE",
              roomId: _createdRoomJson.id,
              commonMessageSettings: {
                type: "SOMEONE_PARTICIPATED",
                participant: _participant,
                isSpeaker: _createdRoomJson.isSpeaker,
              },
            });
          });
        }
      });
    }

    // else {
    //   createdRoomsJson.forEach((_createdRoomJson) => {
    //     chatDispatch({ type: "INIT_TALKING_ROOM", roomJson: _createdRoomJson });
    //   });
    //   participatingRoomsJson.forEach((_participatingRoomJson) => {
    //     chatDispatch({
    //       type: "INIT_TALKING_ROOM",
    //       roomJson: _participatingRoomJson,
    //     });
    //   });
    // }
  };

  return {
    updateTalk,
  };
};

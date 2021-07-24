import { BASE_URL } from "src/constants/env";
import { useAuthState } from "src/contexts/AuthContext";
import { URLJoin } from "src/utils";
import { useAxios } from "src/hooks/useAxios";
import { RoomJson, RoomJsonIoTs } from "src/types/Types.context";
import { Request } from "src/types/Types";
import { useChatDispatch, useChatState } from "src/contexts/ChatContext";
import { useProfileState } from "src/contexts/ProfileContext";
import { useWsChat } from "src/screens/StartUpManager/useWsChat";
import { asyncStoreObjectIncludeId } from "src/utils/asyncStorage";

type UseRequestPostRoomParticipant = (
  roomId: string,
  additionalThenCallback?: (roomJson: RoomJson) => void
) => {
  requestPostRoomParticipants: Request;
  isLoadingPostRoomParticipants: boolean;
};
/**
 * 自身のルームへの参加
 * @param roomId
 * @param additionalThenCallback
 * @returns
 */
export const useRequestPostRoomParticipant: UseRequestPostRoomParticipant = (
  roomId,
  additionalThenCallback = () => void 0
) => {
  const authState = useAuthState();
  const profileState = useProfileState();
  const chatDispatch = useChatDispatch();

  const { connectWsChat } = useWsChat();

  const {
    isLoading: isLoadingPostRoomParticipants,
    request: requestPostRoomParticipants,
  } = useAxios(
    URLJoin(BASE_URL, "rooms/", roomId, "participants/"),
    "post",
    RoomJsonIoTs,
    {
      data: {
        account_id: profileState.profile.id,
      },
      thenCallback: (resData) => {
        const roomJson = resData as RoomJson;
        chatDispatch({ type: "INIT_TALKING_ROOM", roomJson: roomJson });
        connectWsChat(roomJson.id, true);
        chatDispatch({
          type: "APPEND_COMMON_MESSAGE",
          roomId: roomJson.id,
          commonMessageSettings: {
            type: "I_PARTICIPATED",
            owner: roomJson.owner,
          },
        });

        additionalThenCallback && additionalThenCallback(roomJson);
      },
      token: authState.token ? authState.token : "",
    }
  );

  return {
    requestPostRoomParticipants,
    isLoadingPostRoomParticipants,
  };
};

type UseRequestPostRoomLeftMembers = (
  roomId: string,
  additionalThenCallback?: (roomJson: RoomJson) => void,
  additionalCloseThenCallback?: () => void
) => {
  requestPostRoomLeftMembers: Request;
  isLoadingPostRoomLeftMembers: boolean;
};
/**
 * 自身のルームからの退室
 * @param roomId
 * @param additionalThenCallback
 * @returns
 */
export const useRequestPostRoomLeftMembers: UseRequestPostRoomLeftMembers = (
  roomId,
  additionalThenCallback = () => void 0,
  additionalCloseThenCallback = () => void 0
) => {
  const authState = useAuthState();
  const profileState = useProfileState();
  const chatDispatch = useChatDispatch();

  const { requestPostRoomClosedMembers } = useRequestPostRoomClosedMembers(
    roomId,
    additionalCloseThenCallback
  );

  const {
    isLoading: isLoadingPostRoomLeftMembers,
    request: requestPostRoomLeftMembers,
  } = useAxios(
    URLJoin(BASE_URL, "rooms/", roomId, "left-members/"),
    "post",
    RoomJsonIoTs,
    {
      data: {
        account_id: profileState.profile.id,
      },
      thenCallback: (resData) => {
        const roomJson = resData as RoomJson;
        chatDispatch({
          type: "I_END_TALK",
          roomId: roomId,
        });

        // クローズ
        requestPostRoomClosedMembers();

        additionalThenCallback && additionalThenCallback(roomJson);
      },
      token: authState.token ? authState.token : "",
    }
  );

  return {
    requestPostRoomLeftMembers,
    isLoadingPostRoomLeftMembers,
  };
};

type UseRequestPostRoomClosedMembers = (
  roomId: string,
  additionalThenCallback?: () => void
) => {
  requestPostRoomClosedMembers: Request;
  isLoadingPostRoomClosedMembers: boolean;
};
/**
 * ルームのクローズ
 * @param roomId
 * @param additionalThenCallback
 * @returns
 */
export const useRequestPostRoomClosedMembers: UseRequestPostRoomClosedMembers =
  (roomId, additionalThenCallback = () => void 0) => {
    const authState = useAuthState();
    const profileState = useProfileState();
    const chatDispatch = useChatDispatch();
    const chatState = useChatState();

    const {
      isLoading: isLoadingPostRoomClosedMembers,
      request: requestPostRoomClosedMembers,
    } = useAxios(
      URLJoin(BASE_URL, "rooms/", roomId, "closed-members/"),
      "post",
      null,
      {
        data: {
          account_id: profileState.profile.id,
        },
        thenCallback: async () => {
          // メッセージ履歴のストア
          if (roomId in chatState.talkingRoomCollection) {
            for (const userId of chatState.talkingRoomCollection[roomId]
              .addedFavoriteUserIds)
              await asyncStoreObjectIncludeId(
                "messageHistory",
                userId,
                chatState.talkingRoomCollection[roomId].messages
              );
          }

          chatDispatch({
            type: "CLOSE_TALK",
            roomId: roomId,
          });

          additionalThenCallback && additionalThenCallback();
        },
        token: authState.token ? authState.token : "",
      }
    );

    return {
      requestPostRoomClosedMembers,
      isLoadingPostRoomClosedMembers,
    };
  };

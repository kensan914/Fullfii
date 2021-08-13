import { BASE_URL } from "src/constants/env";
import { useAuthState } from "src/contexts/AuthContext";
import { URLJoin } from "src/utils";
import { useAxios } from "src/hooks/useAxios";
import { RoomJson, RoomJsonIoTs } from "src/types/Types.context";
import {
  PostRoomClosedMembersResData,
  PostRoomClosedMembersResDataIoTs,
  Request,
} from "src/types/Types";
import { useChatDispatch, useChatState } from "src/contexts/ChatContext";
import {
  useProfileDispatch,
  useProfileState,
} from "src/contexts/ProfileContext";
import { useWsChat } from "src/screens/StartUpManager/useWsChat";
import { asyncStoreObjectIncludeId } from "src/utils/asyncStorage";
import { useDomDispatch } from "src/contexts/DomContext";

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
            isSpeaker: roomJson.isSpeaker,
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
  additionalCloseThenCallback?: (isLeveledUp?: boolean) => void
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
  const domDispatch = useDomDispatch();
  const profileState = useProfileState();
  const chatDispatch = useChatDispatch();

  const { requestPostRoomClosedMembers } = useRequestPostRoomClosedMembers(
    roomId,
    (isLeveledUp) => {
      additionalCloseThenCallback(isLeveledUp);
      domDispatch({
        type: "SET_IS_SHOW_SPINNER",
        value: false,
      });
    },
    () => {
      domDispatch({
        type: "SET_IS_SHOW_SPINNER",
        value: false,
      });
    }
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
      didRequestCallback: () => {
        domDispatch({
          type: "SET_IS_SHOW_SPINNER",
          value: true,
        });
      },
      catchCallback: () => {
        domDispatch({
          type: "SET_IS_SHOW_SPINNER",
          value: false,
        });
      },
    }
  );

  return {
    requestPostRoomLeftMembers,
    isLoadingPostRoomLeftMembers,
  };
};

type UseRequestPostRoomClosedMembers = (
  roomId: string,
  additionalThenCallback?: (isLeveledUp?: boolean) => void,
  additionalCatchCallback?: () => void
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
  (
    roomId,
    additionalThenCallback = () => void 0,
    additionalCatchCallback = () => void 0
  ) => {
    const authState = useAuthState();
    const profileState = useProfileState();
    const chatDispatch = useChatDispatch();
    const chatState = useChatState();
    const profileDispatch = useProfileDispatch();
    const domDispatch = useDomDispatch();

    const {
      isLoading: isLoadingPostRoomClosedMembers,
      request: requestPostRoomClosedMembers,
    } = useAxios(
      URLJoin(BASE_URL, "rooms/", roomId, "closed-members/"),
      "post",
      PostRoomClosedMembersResDataIoTs,
      {
        data: {
          account_id: profileState.profile.id,
        },
        thenCallback: async (_resData) => {
          const resData = _resData as PostRoomClosedMembersResData;

          profileDispatch({ type: "SET_ALL", profile: resData.me });

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

          let isLeveledUp = false;
          if (resData.resultLevelUp === "LEVELED_UP") {
            domDispatch({ type: "SCHEDULE_TASK", taskKey: "openLevelUpModal" });
            isLeveledUp = true;
          }

          additionalThenCallback && additionalThenCallback(isLeveledUp);
        },
        token: authState.token ? authState.token : "",
        catchCallback: () => {
          additionalCatchCallback();
        },
      }
    );

    return {
      requestPostRoomClosedMembers,
      isLoadingPostRoomClosedMembers,
    };
  };

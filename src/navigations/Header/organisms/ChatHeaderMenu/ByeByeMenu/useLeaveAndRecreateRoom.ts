import { useEffect, useState } from "react";
import { useRequestPostRoom } from "src/hooks/requests/useRequestRooms";
import { AxiosReActionType, Request } from "src/types/Types";
import { TalkingRoom } from "src/types/Types.context";

type LeaveAndRecreateRoom = (
  _talkingRoom: TalkingRoom,
  postDataIncludeLeaveMessage?: AxiosReActionType
) => void;
type UseLeaveAndRecreateRoom = (
  requestPostRoomLeftMembers: Request,
  thenRecreateRoom?: () => void
) => {
  leaveAndRecreateRoom: LeaveAndRecreateRoom;
  additionalThenClose:
    | {
        fn: () => void;
      }
    | undefined;
};
export const useLeaveAndRecreateRoom: UseLeaveAndRecreateRoom = (
  requestPostRoomLeftMembers,
  thenRecreateRoom
) => {
  const { requestPostRoom } = useRequestPostRoom(null, null, null, null);
  const [additionalThenClose, setAdditionalThenClose] = useState<{
    fn: () => void;
  }>();
  const [postDataRecreate, setPostDataRecreate] =
    useState<AxiosReActionType | null>();
  const leaveAndRecreateRoom: LeaveAndRecreateRoom = (
    _talkingRoom,
    postDataIncludeLeaveMessage
  ) => {
    setAdditionalThenClose({
      fn: () => {
        // 再募集処理
        requestPostRoom({
          data: {
            name: _talkingRoom.name,
            is_exclude_different_gender: _talkingRoom.isExcludeDifferentGender,
          },
          thenCallback: () => {
            thenRecreateRoom && thenRecreateRoom();
          },
        });
      },
    });
    setPostDataRecreate(
      postDataIncludeLeaveMessage ? postDataIncludeLeaveMessage : null
    );
  };
  useEffect(() => {
    // additionalThenCloseのrerenderが終了したら, 遅延したrequestTask実行.
    if (
      typeof additionalThenClose !== "undefined" &&
      typeof postDataRecreate !== "undefined"
    ) {
      if (postDataRecreate !== null) {
        requestPostRoomLeftMembers(postDataRecreate);
      } else {
        requestPostRoomLeftMembers();
      }
      // 初期化
      setPostDataRecreate(void 0);
      setAdditionalThenClose(void 0);
    }
  }, [additionalThenClose, postDataRecreate]);

  return {
    leaveAndRecreateRoom,
    additionalThenClose,
  };
};

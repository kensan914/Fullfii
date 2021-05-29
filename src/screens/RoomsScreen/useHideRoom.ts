import { useEffect, useState } from "react";

import { Room } from "src/types/Types.context";
import { useAxios } from "src/hooks/useAxios";
import { BASE_URL } from "src/constants/env";
import { URLJoin } from "src/utils";
import { BlockRoom, HideRoom } from "src/types/Types";
import { useAuthState } from "src/contexts/AuthContext";
import { showToast } from "src/utils/customModules";
import { TOAST_SETTINGS } from "src/constants/alertMessages";

export const useHideRoom = (
  handleRefresh: () => void,
  rooms: Room[]
): {
  hiddenRoomIds: string[];
  hideRoom: HideRoom;
  resetHiddenRooms: () => void;
  blockRoom: BlockRoom;
} => {
  const authState = useAuthState();
  const [hiddenRoomIds, setHiddenRoomIds] = useState<string[]>([]);

  // リフレッシュ時、hiddenRoomIds初期化
  useEffect(() => {
    if (rooms.length <= 0 && hiddenRoomIds.length > 0) {
      setHiddenRoomIds([]);
    }
  }, [rooms.length]);

  const { request: requestPatchHiddenRooms } = useAxios(
    URLJoin(BASE_URL, "me/hidden-rooms/"),
    "patch",
    null,
    {
      // thenCallback: (resData) => {},
      token: authState.token ? authState.token : "",
    }
  );

  const { request: requestDeleteHiddenRooms } = useAxios(
    URLJoin(BASE_URL, "me/hidden-rooms/"),
    "delete",
    null,
    {
      thenCallback: () => {
        handleRefresh();
        setHiddenRoomIds([]);
      },
      token: authState.token ? authState.token : "",
    }
  );

  const { request: requestPatchBlockedRooms } = useAxios(
    URLJoin(BASE_URL, "me/blocked-rooms/"),
    "patch",
    null,
    {
      // thenCallback: (resData) => {},
      token: authState.token ? authState.token : "",
    }
  );

  const hideRoom: HideRoom = (roomId) => {
    setHiddenRoomIds([...hiddenRoomIds, roomId]);
    requestPatchHiddenRooms({
      data: {
        room_id: roomId,
      },
      thenCallback: () => {
        showToast(TOAST_SETTINGS["HIDE_ROOM"]);
      },
    });
  };

  const resetHiddenRooms = (): void => {
    requestDeleteHiddenRooms();
  };

  const blockRoom: BlockRoom = (roomId) => {
    setHiddenRoomIds([...hiddenRoomIds, roomId]);
    requestPatchBlockedRooms({
      data: {
        room_id: roomId,
      },
      thenCallback: () => {
        showToast(TOAST_SETTINGS["BLOCK_ROOM"]);
      },
    });
  };

  return {
    hiddenRoomIds,
    hideRoom,
    resetHiddenRooms,
    blockRoom,
  };
};

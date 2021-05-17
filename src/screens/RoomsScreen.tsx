import React, { useEffect, useRef, useState } from "react";

import { RoomsTemplate } from "src/components/templates/RoomsTemplate";
import { Room } from "src/types/Types.context";
import { useProfileState } from "src/contexts/ProfileContext";
import { useAxios } from "src/hooks/useAxios";
import { BASE_URL } from "src/constants/env";
import { useAuthState } from "src/contexts/AuthContext";
import { URLJoin } from "src/utils";
import { GetRoomsResDataIoTs, GetRoomsResData } from "src/types/Types";
import { useDomDispatch, useDomState } from "src/contexts/DomContext";

export const RoomsScreen: React.FC = () => {
  const profileState = useProfileState();
  const authState = useAuthState();
  const domState = useDomState();
  const domDispatch = useDomDispatch();

  const [hiddenRoomIds, setHiddenRoomIds] = useState<string[]>([]);
  const [isOpenRoomEditorModal, setIsOpenRoomEditorModal] = useState<boolean>(
    false
  );

  const [rooms, setRooms] = useState<Room[]>([]);

  const page = useRef(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isRefreshingRef = useRef(false);
  const isLoadingGetRoomsRef = useRef(false); // 即時反映

  const [urlExcludePage] = useState(URLJoin(BASE_URL, "rooms/"));
  const { isLoading: isLoadingGetRooms, request: requestGetRooms } = useAxios(
    URLJoin(urlExcludePage, `?page=${page.current}`),
    "get",
    GetRoomsResDataIoTs,
    {
      thenCallback: (resData) => {
        const _resData = resData as GetRoomsResData;
        const _roomsJson = _resData.rooms;
        const _hasMore = _resData.hasMore;

        const _rooms: Room[] = _roomsJson.map((roomJson) => {
          const room: Room = { ...roomJson, ...{ createdAt: new Date() } };
          if (roomJson.createdAt) {
            room.createdAt = new Date(roomJson.createdAt);
          }
          return room;
        });

        if (isRefreshingRef.current) {
          setRooms([..._rooms]);
        } else {
          setRooms([...rooms, ..._rooms]);
        }

        setHasMore(_hasMore);
      },
      finallyCallback: () => {
        page.current += 1;
        isRefreshingRef.current = false;
        isLoadingGetRoomsRef.current = false;
      },
      token: authState.token ? authState.token : "",
      didRequestCallback: () => {
        isLoadingGetRoomsRef.current = true;
      },
    }
  );

  useEffect(() => {
    setIsRefreshing(isRefreshingRef.current);
  }, [isRefreshingRef.current]);

  const onEndReached = () => {
    if (hasMore && !isLoadingGetRooms && !isLoadingGetRoomsRef.current) {
      requestGetRooms({
        url: URLJoin(urlExcludePage, `?page=${page.current}`),
      });
    }
  };
  const handleRefresh = () => {
    if (!isLoadingGetRooms && !isLoadingGetRoomsRef.current) {
      setRooms([]);
      page.current = 1;
      setHasMore(true);
      isRefreshingRef.current = true;
      requestGetRooms({ url: URLJoin(urlExcludePage, `?page=${1}`) });
    }
  };

  useEffect(() => {
    handleRefresh();
    domDispatch({ type: "DONE_TASK", taskKey: "refreshRooms" });
  }, [domState.taskSchedules.refreshRooms]);

  return (
    <RoomsTemplate
      rooms={rooms}
      hiddenRoomIds={hiddenRoomIds}
      setHiddenRoomIds={setHiddenRoomIds}
      isOpenRoomEditorModal={isOpenRoomEditorModal}
      setIsOpenRoomEditorModal={setIsOpenRoomEditorModal}
      onEndReached={onEndReached}
      handleRefresh={handleRefresh}
      isRefreshing={isRefreshing}
      hasMore={hasMore}
      isLoadingGetRooms={isLoadingGetRooms}
    />
  );
};

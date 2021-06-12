import { Dispatch, useEffect, useRef, useState } from "react";

import { Room } from "src/types/Types.context";
import { useAxios } from "src/hooks/useAxios";
import { BASE_URL } from "src/constants/env";
import { URLJoin } from "src/utils";
import { GetRoomsResDataIoTs, GetRoomsResData } from "src/types/Types";
import { useAuthState } from "src/contexts/AuthContext";
import { useDomDispatch, useDomState } from "src/contexts/DomContext";

export const useFetchRooms = (
  rooms: Room[],
  setRooms: Dispatch<Room[]>
): {
  onEndReached: () => void;
  handleRefresh: () => void;
  isRefreshing: boolean;
  hasMore: boolean;
  isLoadingGetRooms: boolean;
} => {
  const authState = useAuthState();
  const domState = useDomState();
  const domDispatch = useDomDispatch();

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
      page.current = 1;
      setHasMore(true);
      isRefreshingRef.current = true;
      requestGetRooms({ url: URLJoin(urlExcludePage, `?page=${1}`) });
    }
  };

  // ヘッダーからの再読み込みトリガー
  useEffect(() => {
    handleRefresh();
    domDispatch({ type: "DONE_TASK", taskKey: "refreshRooms" });
  }, [domState.taskSchedules.refreshRooms]);

  return {
    onEndReached,
    handleRefresh,
    isRefreshing,
    hasMore,
    isLoadingGetRooms,
  };
};

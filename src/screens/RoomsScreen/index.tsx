import React, { useEffect, useRef, useState } from "react";
import { useScrollToTop } from "@react-navigation/native";

import { RoomsTemplate } from "src/components/templates/RoomsTemplate";
import { Room } from "src/types/Types.context";
import { useHideRoom } from "src/screens/RoomsScreen/useHideRoom";
import { useCanCreateRoom } from "src/screens/RoomsScreen/useCanAction";
import { useDomDispatch, useDomState } from "src/contexts/DomContext";
import { useFetchItems } from "src/hooks/useFetchItems";
import { URLJoin } from "src/utils";
import { GetRoomsResData, GetRoomsResDataIoTs } from "src/types/Types";
import { BASE_URL } from "src/constants/env";

export const RoomsScreen: React.FC = () => {
  const domState = useDomState();
  const domDispatch = useDomDispatch();

  // アクティブなホームタブをプレスした時, topにスクロール
  // https://reactnavigation.org/docs/use-scroll-to-top
  const roomsFlatListRef = useRef(null);
  useScrollToTop(roomsFlatListRef);

  const [rooms, setRooms] = useState<Room[]>([]);

  const cvtJsonToObject = (resData: GetRoomsResData): Room[] => {
    const roomsJson = resData.rooms;
    return roomsJson.map((roomJson) => {
      const room: Room = { ...roomJson, ...{ createdAt: new Date() } };
      if (roomJson.createdAt) {
        room.createdAt = new Date(roomJson.createdAt);
      }
      return room;
    });
  };
  const getHasMore = (resData: GetRoomsResData) => resData.hasMore;
  const {
    onEndReached,
    handleRefresh,
    isRefreshing,
    hasMore,
    isLoadingGetItems,
  } = useFetchItems<Room, GetRoomsResData>(
    rooms,
    setRooms,
    URLJoin(BASE_URL, "rooms/"),
    GetRoomsResDataIoTs,
    cvtJsonToObject,
    getHasMore
  );

  // ヘッダーからの再読み込みトリガー
  useEffect(() => {
    handleRefresh();
    domDispatch({ type: "DONE_TASK", taskKey: "refreshRooms" });
  }, [domState.taskSchedules.refreshRooms]);

  const { hiddenRoomIds, hideRoom, resetHiddenRooms, blockRoom } = useHideRoom(
    handleRefresh,
    rooms
  );

  const [isOpenRoomEditorModal, setIsOpenRoomEditorModal] =
    useState<boolean>(false);

  const { checkCanCreateRoom } = useCanCreateRoom();

  return (
    <RoomsTemplate
      rooms={rooms}
      hiddenRoomIds={hiddenRoomIds}
      hideRoom={hideRoom}
      isOpenRoomEditorModal={isOpenRoomEditorModal}
      setIsOpenRoomEditorModal={setIsOpenRoomEditorModal}
      onEndReached={onEndReached}
      handleRefresh={handleRefresh}
      isRefreshing={isRefreshing}
      hasMore={hasMore}
      isLoadingGetRooms={isLoadingGetItems}
      resetHiddenRooms={resetHiddenRooms}
      blockRoom={blockRoom}
      checkCanCreateRoom={checkCanCreateRoom}
      roomsFlatListRef={roomsFlatListRef}
    />
  );
};

import React, { RefObject, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useScrollToTop } from "@react-navigation/native";

import { useDomDispatch, useDomState } from "src/contexts/DomContext";
import { Room } from "src/types/Types.context";
import {
  GetPrivateRoomsResData,
  GetPrivateRoomsResDataIoTs,
} from "src/types/Types";
import { useFetchItems } from "src/hooks/useFetchItems";
import { URLJoin } from "src/utils";
import { BASE_URL } from "src/constants/env";
import { RoomsTemplate } from "src/components/templates/RoomsTemplate";
import { useCanCreateRoom } from "src/screens/RoomsScreen/useCanAction";
import { useHideRoom } from "src/screens/RoomsScreen/useHideRoom";
import { PrivateRoomListEmpty } from "src/components/templates/PrivateRoomsTemplate/organisms/PrivateRoomListEmpty";

type Props = {
  flatListRef: RefObject<FlatList>;
};
export const PrivateRoomsScreen: React.FC<Props> = (props) => {
  const { flatListRef } = props;

  const domState = useDomState();
  const domDispatch = useDomDispatch();

  useScrollToTop(flatListRef);

  const [privateRooms, setPrivateRooms] = useState<Room[]>([]);

  const cvtJsonToObject = (resData: GetPrivateRoomsResData): Room[] => {
    const roomsJson = resData.privateRooms;
    return roomsJson.map((roomJson) => {
      const room: Room = { ...roomJson, ...{ createdAt: new Date() } };
      if (roomJson.createdAt) {
        room.createdAt = new Date(roomJson.createdAt);
      }
      return room;
    });
  };
  const getHasMore = (resData: GetPrivateRoomsResData) => resData.hasMore;
  const {
    onEndReached,
    handleRefresh,
    isRefreshing,
    hasMore,
    isLoadingGetItems,
  } = useFetchItems<Room, GetPrivateRoomsResData>(
    privateRooms,
    setPrivateRooms,
    URLJoin(BASE_URL, "private-rooms/"),
    GetPrivateRoomsResDataIoTs,
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
    privateRooms
  );

  const [isOpenRoomEditorModal, setIsOpenRoomEditorModal] =
    useState<boolean>(false);

  const { checkCanCreateRoom } = useCanCreateRoom();

  return (
    <RoomsTemplate
      rooms={privateRooms}
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
      roomsFlatListRef={flatListRef}
      ListEmptyComponent={PrivateRoomListEmpty}
    />
  );
};

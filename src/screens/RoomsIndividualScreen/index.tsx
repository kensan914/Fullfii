import { useRoute, useScrollToTop } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { RecommendTemplate } from "src/components/templates/RecommendTemplate";

import { BASE_URL } from "src/constants/env";
import { useFetchItems } from "src/hooks/useFetchItems";
import {
  GetRoomsResData,
  GetRoomsResDataIoTs,
  RoomsIndividualRouteProp,
} from "src/types/Types";
import { Room } from "src/types/Types.context";
import { URLJoin } from "src/utils";
import { useCanCreateRoom } from "src/screens/RecommendScreen/useCanAction";
import { useHideRoom } from "src/screens/RecommendScreen/useHideRoom";

export const RoomsIndividual: React.FC = () => {
  const route = useRoute<RoomsIndividualRouteProp>();

  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);

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
    isLoading: isLoadingGetItems,
  } = useFetchItems<Room, GetRoomsResData>(
    rooms,
    setRooms,
    URLJoin(
      BASE_URL,
      "rooms/",
      typeof route.params.tagKey !== "undefined"
        ? `?tags=${route.params.tagKey}`
        : void 0
    ),
    GetRoomsResDataIoTs,
    cvtJsonToObject,
    getHasMore,
    typeof route.params.filterKey !== "undefined"
      ? [`?filter=`, [route.params.filterKey]]
      : void 0
  );
  useEffect(() => {
    handleRefresh();
  }, []);

  const { hiddenRoomIds, hideRoom, resetHiddenRooms, blockRoom } = useHideRoom(
    handleRefresh,
    rooms
  );

  const [isOpenRoomEditorModal, setIsOpenRoomEditorModal] =
    useState<boolean>(false);

  const { checkCanCreateRoom } = useCanCreateRoom();

  return (
    <RecommendTemplate
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
      roomsFlatListRef={flatListRef}
      shouldShowRoomEditorModal={false}
    />
  );
};

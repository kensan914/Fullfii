import React, { RefObject, useEffect, useRef, useState } from "react";
import { useScrollToTop } from "@react-navigation/native";
import { FlatList } from "react-native";

import { RoomsTemplate } from "src/components/templates/RoomsTemplate";
import { Room } from "src/types/Types.context";
import { useHideRoom } from "src/screens/RoomsScreen/useHideRoom";
import { useCanCreateRoom } from "src/screens/RoomsScreen/useCanAction";
import { useDomDispatch, useDomState } from "src/contexts/DomContext";
import { useFetchItems } from "src/hooks/useFetchItems";
import { URLJoin } from "src/utils";
import { GetRoomsResData, GetRoomsResDataIoTs } from "src/types/Types";
import { BASE_URL } from "src/constants/env";
import { TabInListSettingsProps } from "src/hooks/tabInList/useTabInList";
import { useAnimatedListProps } from "src/hooks/tabInList/useAnimatedListProps";
import { FilterKey } from "src/navigations/Header/organisms/FilterHeaderMenu/useFilterRoom";

type Props = {
  flatListRef: RefObject<FlatList>;
  filterKey: FilterKey;
  tagKey?: string;
};
export const RoomsScreen: React.FC<Props & TabInListSettingsProps> = (
  props
) => {
  const { flatListRef, filterKey, tagKey, tabInListSettings } = props;

  const domState = useDomState();
  const domDispatch = useDomDispatch();

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
      typeof tagKey !== "undefined" ? `?tags=${tagKey}` : void 0
    ),
    GetRoomsResDataIoTs,
    cvtJsonToObject,
    getHasMore,
    [`?filter=${filterKey}`]
  );

  // ヘッダーからの再読み込みトリガー
  useEffect(() => {
    handleRefresh();
    domDispatch({ type: "DONE_TASK", taskKey: "refreshRooms" });
  }, [domState.taskSchedules.refreshRooms]);

  // 絞り込み
  const prevFilterKey = useRef<FilterKey>("all");
  useEffect(() => {
    if (prevFilterKey.current !== filterKey) {
      handleRefresh();
      prevFilterKey.current = filterKey;
    }
  }, [filterKey]);

  const { hiddenRoomIds, hideRoom, resetHiddenRooms, blockRoom } = useHideRoom(
    handleRefresh,
    rooms
  );

  const [isOpenRoomEditorModal, setIsOpenRoomEditorModal] =
    useState<boolean>(false);

  const { checkCanCreateRoom } = useCanCreateRoom();

  const { animatedFlatListProps } = useAnimatedListProps(tabInListSettings, {
    isRefreshing: isRefreshing,
    handleRefresh: handleRefresh,
  });

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
      roomsFlatListRef={flatListRef}
      animatedFlatListProps={animatedFlatListProps}
    />
  );
};

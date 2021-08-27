import React, { RefObject, useEffect, useRef, useState } from "react";
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
import { RecommendTemplate } from "src/components/templates/RecommendTemplate";
import { useCanCreateRoom } from "src/screens/RecommendScreen/useCanAction";
import { useHideRoom } from "src/screens/RecommendScreen/useHideRoom";
import { PrivateRoomListEmpty } from "src/components/templates/PrivateRoomsTemplate/organisms/PrivateRoomListEmpty";
import { TabInListSettingsProps } from "src/hooks/tabInList/useTabInList";
import { useAnimatedListProps } from "src/hooks/tabInList/useAnimatedListProps";
import { FilterKey } from "src/navigations/Header/organisms/FilterHeaderMenu/useFilterRoom";

type Props = {
  flatListRef: RefObject<FlatList>;
  filterKey: FilterKey;
};
export const PrivateRoomsScreen: React.FC<TabInListSettingsProps & Props> = (
  props
) => {
  const { flatListRef, filterKey, tabInListSettings } = props;

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
    isLoading: isLoadingGetItems,
  } = useFetchItems<Room, GetPrivateRoomsResData>(
    privateRooms,
    setPrivateRooms,
    URLJoin(BASE_URL, "private-rooms/"),
    GetPrivateRoomsResDataIoTs,
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
    privateRooms
  );

  const [isOpenRoomEditorModal, setIsOpenRoomEditorModal] =
    useState<boolean>(false);

  const { checkCanCreateRoom } = useCanCreateRoom();

  const { animatedFlatListProps } = useAnimatedListProps(tabInListSettings, {
    isRefreshing: isRefreshing,
    handleRefresh: handleRefresh,
  });

  return (
    <RecommendTemplate
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
      animatedFlatListProps={animatedFlatListProps}
    />
  );
};

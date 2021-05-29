import React, { useState } from "react";

import { RoomsTemplate } from "src/components/templates/RoomsTemplate";
import { Room } from "src/types/Types.context";
import { useFetchRooms } from "./useFetchRooms";
import { useHideRoom } from "./useHideRoom";
import { useCanCreateRoom } from "./useCanAction";

export const RoomsScreen: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  const {
    onEndReached,
    handleRefresh,
    isRefreshing,
    hasMore,
    isLoadingGetRooms,
  } = useFetchRooms(rooms, setRooms);

  const { hiddenRoomIds, hideRoom, resetHiddenRooms, blockRoom } = useHideRoom(
    handleRefresh,
    rooms
  );

  const [isOpenRoomEditorModal, setIsOpenRoomEditorModal] = useState<boolean>(
    false
  );
  const [isOpenRoomCreatedModal, setIsOpenRoomCreatedModal] = useState<boolean>(
    false
  );
  const [
    isOpenNotificationReminderModal,
    setIsOpenNotificationReminderModal,
  ] = useState<boolean>(false);

  const { checkCanCreateRoom } = useCanCreateRoom();

  return (
    <RoomsTemplate
      rooms={rooms}
      hiddenRoomIds={hiddenRoomIds}
      hideRoom={hideRoom}
      isOpenRoomEditorModal={isOpenRoomEditorModal}
      setIsOpenRoomEditorModal={setIsOpenRoomEditorModal}
      isOpenRoomCreatedModal={isOpenRoomCreatedModal}
      setIsOpenRoomCreatedModal={setIsOpenRoomCreatedModal}
      isOpenNotificationReminderModal={isOpenNotificationReminderModal}
      setIsOpenNotificationReminderModal={setIsOpenNotificationReminderModal}
      onEndReached={onEndReached}
      handleRefresh={handleRefresh}
      isRefreshing={isRefreshing}
      hasMore={hasMore}
      isLoadingGetRooms={isLoadingGetRooms}
      resetHiddenRooms={resetHiddenRooms}
      blockRoom={blockRoom}
      checkCanCreateRoom={checkCanCreateRoom}
    />
  );
};

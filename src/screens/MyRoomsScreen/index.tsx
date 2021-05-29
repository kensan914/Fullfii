import React, { useEffect, useState } from "react";

import { MyRoomsTemplate } from "src/components/templates/MyRoomsTemplate";
import { useChatState } from "src/contexts/ChatContext";
import { TalkingRoom } from "src/types/Types.context";
import { useProfileState } from "src/contexts/ProfileContext";
import { useCanCreateRoom } from "src/screens/RoomsScreen/useCanAction";

export const MyRoomsScreen: React.FC = () => {
  const chatState = useChatState();
  const profileState = useProfileState();

  const [createdRooms, setCreatedRooms] = useState<TalkingRoom[]>([]);
  const [participatingRooms, setParticipatingRooms] = useState<TalkingRoom[]>(
    []
  );
  useEffect(() => {
    const _createdRooms: TalkingRoom[] = [];
    const _participatingRooms: TalkingRoom[] = [];

    Object.values(chatState.talkingRoomCollection).forEach((talkingRoom) => {
      if (talkingRoom.owner.id === profileState.profile.id) {
        _createdRooms.push(talkingRoom);
      } else {
        _participatingRooms.push(talkingRoom);
      }
    });

    setCreatedRooms(_createdRooms);
    setParticipatingRooms(_participatingRooms);
  }, [chatState.talkingRoomCollection]);

  const [isOpenRoomEditorModal, setIsOpenRoomEditorModal] = useState(false);
  const [isOpenRoomCreatedModal, setIsOpenRoomCreatedModal] = useState(false);
  const [
    isOpenNotificationReminderModal,
    setIsOpenNotificationReminderModal,
  ] = useState<boolean>(false);

  const { checkCanCreateRoom } = useCanCreateRoom();

  return (
    <MyRoomsTemplate
      createdRooms={createdRooms}
      participatingRooms={participatingRooms}
      isOpenRoomEditorModal={isOpenRoomEditorModal}
      setIsOpenRoomEditorModal={setIsOpenRoomEditorModal}
      isOpenRoomCreatedModal={isOpenRoomCreatedModal}
      setIsOpenRoomCreatedModal={setIsOpenRoomCreatedModal}
      isOpenNotificationReminderModal={isOpenNotificationReminderModal}
      setIsOpenNotificationReminderModal={setIsOpenNotificationReminderModal}
      checkCanCreateRoom={checkCanCreateRoom}
    />
  );
};

import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";

import { ChatTemplate } from "src/components/templates/ChatTemplate";
import { useChatState } from "src/contexts/ChatContext";
import { ChatRouteProp, RoomMemberCollection } from "src/types/Types";
import { Profile } from "src/types/Types.context";

export const ChatScreen: React.FC = () => {
  const route = useRoute<ChatRouteProp>();
  const chatState = useChatState();

  const roomId = route.params.roomId;
  const talkingRoom = chatState.talkingRoomCollection[roomId];

  const geneRoomMemberCollection = () => {
    if (talkingRoom) {
      const _roomMemberCollection: RoomMemberCollection = {};
      const roomMembers = [talkingRoom.owner, ...talkingRoom.participants];

      roomMembers.forEach((roomMember) => {
        _roomMemberCollection[roomMember.id] = roomMember;
      });

      return _roomMemberCollection;
    } else {
      return {};
    }
  };

  // idをkeyとしたルームメンバー(オーナー&参加者)のコレクションstate
  const [
    roomMemberCollection,
    setRoomMemberCollection,
  ] = useState<RoomMemberCollection>(geneRoomMemberCollection());
  useEffect(() => {
    setRoomMemberCollection(geneRoomMemberCollection());
  }, [chatState.talkingRoomCollection]);

  // profile modal
  const [isOpenProfileModal, setIsOpenProfileModal] = useState(false);
  const [
    userWillShowProfileModal,
    setUserWillShowProfileModal,
  ] = useState<Profile>();
  const openProfileModal = (userId: string) => {
    roomMemberCollection &&
      setUserWillShowProfileModal(roomMemberCollection[userId]);
    setIsOpenProfileModal(true);
  };

  const [
    isOpenNotificationReminderModal,
    setIsOpenNotificationReminderModal,
  ] = useState<boolean>(false);

  if (talkingRoom) {
    return (
      <ChatTemplate
        talkingRoom={talkingRoom}
        roomMemberCollection={roomMemberCollection}
        isOpenProfileModal={isOpenProfileModal}
        userWillShowProfileModal={userWillShowProfileModal}
        setIsOpenProfileModal={setIsOpenProfileModal}
        openProfileModal={openProfileModal}
        isOpenNotificationReminderModal={isOpenNotificationReminderModal}
        setIsOpenNotificationReminderModal={setIsOpenNotificationReminderModal}
      />
    );
  } else {
    return <></>;
  }
};

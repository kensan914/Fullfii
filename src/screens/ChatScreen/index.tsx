import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import { ChatTemplate } from "src/components/templates/ChatTemplate";
import { useChatState } from "src/contexts/ChatContext";
import { ChatRouteProp, RoomMemberCollection } from "src/types/Types";
import { Profile } from "src/types/Types.context";

export const ChatScreen: React.FC = () => {
  const route = useRoute<ChatRouteProp>();
  const chatState = useChatState();
  const navigation = useNavigation();

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
  const [roomMemberCollection, setRoomMemberCollection] =
    useState<RoomMemberCollection>(geneRoomMemberCollection());
  useEffect(() => {
    setRoomMemberCollection(geneRoomMemberCollection());
  }, [chatState.talkingRoomCollection]);

  // profile
  const navigateProfile = (_profile: Profile) => {
    navigation.navigate("Profile", { profile: _profile });
  };

  const [isOpenNotificationReminderModal, setIsOpenNotificationReminderModal] =
    useState<boolean>(false);

  if (talkingRoom) {
    return (
      <ChatTemplate
        talkingRoom={talkingRoom}
        roomMemberCollection={roomMemberCollection}
        isOpenNotificationReminderModal={isOpenNotificationReminderModal}
        setIsOpenNotificationReminderModal={setIsOpenNotificationReminderModal}
        navigateProfile={navigateProfile}
      />
    );
  } else {
    return <></>;
  }
};

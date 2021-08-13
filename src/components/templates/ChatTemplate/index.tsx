import React, { Dispatch } from "react";
import { StyleSheet } from "react-native";
import { Block } from "galio-framework";

import { Profile, TalkingRoom } from "src/types/Types.context";
import { ChatBody } from "src/components/templates/ChatTemplate/organisms/ChatBody";
import { COLORS } from "src/constants/colors";
import { RoomMemberCollection } from "src/types/Types";
import { NotificationReminderModal } from "src/components/organisms/NotificationReminderModal";

type Props = {
  talkingRoom: TalkingRoom;
  roomMemberCollection: RoomMemberCollection;
  isOpenNotificationReminderModal: boolean;
  setIsOpenNotificationReminderModal: Dispatch<boolean>;
  navigateProfile: (userProfile: Profile) => void;
};
export const ChatTemplate: React.FC<Props> = (props) => {
  const {
    talkingRoom,
    roomMemberCollection,
    isOpenNotificationReminderModal,
    setIsOpenNotificationReminderModal,
    navigateProfile,
  } = props;

  return (
    <Block flex space="between" style={styles.container}>
      <ChatBody
        roomMemberCollection={roomMemberCollection}
        roomId={talkingRoom.id}
        messages={talkingRoom.messages}
        offlineMessages={talkingRoom.offlineMessages}
        ws={talkingRoom.ws}
        isEnd={talkingRoom.isEnd}
        setIsOpenNotificationReminderModal={setIsOpenNotificationReminderModal}
        isStart={talkingRoom.isStart}
        navigateProfile={navigateProfile}
        inputTextBuffer={talkingRoom.inputTextBuffer}
      />
      <NotificationReminderModal
        isOpenNotificationReminderModal={isOpenNotificationReminderModal}
        setIsOpenNotificationReminderModal={setIsOpenNotificationReminderModal}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,
  },
});

import React, { Dispatch } from "react";
import { StyleSheet } from "react-native";
import { Block } from "galio-framework";

import { Profile, TalkingRoom } from "src/types/Types.context";
import ChatBody from "src/components/templates/ChatTemplate/organisms/ChatBody";
import { COLORS } from "src/constants/theme";
import { RoomMemberCollection } from "src/types/Types";
import { ProfileModal } from "src/components/molecules/ProfileModal";
import { NotificationReminderModal } from "src/components/organisms/NotificationReminderModal";
import { formatGender } from "src/utils";

type Props = {
  talkingRoom: TalkingRoom;
  roomMemberCollection: RoomMemberCollection;
  isOpenProfileModal: boolean;
  userWillShowProfileModal: Profile | undefined;
  setIsOpenProfileModal: Dispatch<boolean>;
  openProfileModal: (userId: string) => void;
  isOpenNotificationReminderModal: boolean;
  setIsOpenNotificationReminderModal: Dispatch<boolean>;
};
export const ChatTemplate: React.FC<Props> = (props) => {
  const {
    talkingRoom,
    roomMemberCollection,
    userWillShowProfileModal,
    isOpenProfileModal,
    setIsOpenProfileModal,
    openProfileModal,
    isOpenNotificationReminderModal,
    setIsOpenNotificationReminderModal,
  } = props;

  const formattedGender =
    userWillShowProfileModal &&
    formatGender(
      userWillShowProfileModal?.gender,
      userWillShowProfileModal?.isSecretGender
    );
  return (
    <Block flex space="between" style={styles.container}>
      <ChatBody
        roomMemberCollection={roomMemberCollection}
        roomId={talkingRoom.id}
        messages={talkingRoom.messages}
        offlineMessages={talkingRoom.offlineMessages}
        ws={talkingRoom.ws}
        isEnd={talkingRoom.isEnd}
        openProfileModal={openProfileModal}
        setIsOpenNotificationReminderModal={setIsOpenNotificationReminderModal}
        isStart={talkingRoom.isStart}
      />
      <ProfileModal
        userName={userWillShowProfileModal ? userWillShowProfileModal.name : ""}
        userImage={
          userWillShowProfileModal?.image ? userWillShowProfileModal.image : ""
        }
        userJob={
          userWillShowProfileModal?.job?.label
            ? userWillShowProfileModal.job.label
            : ""
        }
        userGender={formattedGender ? formattedGender.label : ""}
        isOpen={isOpenProfileModal}
        setIsOpen={setIsOpenProfileModal}
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

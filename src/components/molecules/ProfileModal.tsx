import React from "react";
import { StyleSheet } from "react-native";
import { Block, Text } from "galio-framework";
import Modal from "react-native-modal";

import { Avatar } from "src/components/atoms/Avatar";
import { COLORS } from "src/constants/theme";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<boolean>;
  userName: string;
  userImage: string;
  userJob: string;
  userGender: string;
};
export const ProfileModal: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen, userName, userImage, userJob, userGender } = props;

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isOpen}
      onBackdropPress={() => {
        setIsOpen(false);
      }}
      style={styles.modal}
    >
      <Block style={styles.modalContents}>
        <Block
          row
          center
          style={{ marginTop: 24, marginBottom: 48, marginHorizontal: 16 }}
        >
          <Block flex={0.4} center>
            <Text bold size={15} color={COLORS.GRAY}>
              {userName}
            </Text>
          </Block>
          <Block flex={0.4} center>
            <Avatar size={75} imageUri={userImage} hasBorder={false} />
          </Block>
          <Block flex={0.4} center>
            <Text bold size={15} color={COLORS.GRAY}>
              {userJob}
            </Text>
            <Text bold size={15} style={{ marginTop: 8 }} color={COLORS.GRAY}>
              {userGender}
            </Text>
          </Block>
        </Block>
      </Block>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContents: {
    backgroundColor: COLORS.WHITE,
    flexDirection: "column",
    alignItems: "center",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
});

import React from "react";
import { Block, Button, Text } from "galio-framework";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";

import { COLORS } from "src/constants/theme";
import IconExtra from "src/components/atoms/Icon";
import { width } from "src/constants";

const NotificationModal = (props) => {
  const { isOpenNotificationModal, setIsOpenNotificationModal } = props;

  return (
    <Modal
      isVisible={isOpenNotificationModal}
      deviceWidth={width}
      style={styles.modal}
    >
      <Block column style={styles.modalContent}>
        <Block center style={styles.checkIcon}>
          <IconExtra
            name="bell"
            family="Feather"
            size={80}
            color={COLORS.LIGHT_GRAY}
          />
        </Block>
        <Block center style={styles.notification}>
          <Text bold size={15} color={COLORS.WHITE}>
            1{/* 100以上は99表示 */}
          </Text>
        </Block>
        <Block center style={styles.title}>
          <Text bold size={18} color={COLORS.BLACK}>
            通知を「オン」に設定しましょう
          </Text>
        </Block>
        <Block center style={styles.description}>
          <Text size={14} color={COLORS.BLACK} center>
            他ユーザーのメッセージを見逃すことがなくなります
          </Text>
        </Block>
        <Block center>
          <Button
            style={styles.okButton}
            color={COLORS.BROWN}
            shadowless
            onPress={() => {
              setIsOpenNotificationModal(false);
            }}
          >
            <Text size={20} color={COLORS.WHITE} bold>
              OK
            </Text>
          </Button>
        </Block>
      </Block>
    </Modal>
  );
};

export default NotificationModal;

const styles = StyleSheet.create({
  modal: {},
  modalContent: {
    width: width - 40,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: "relative",
  },
  closeIcon: {
    marginBottom: 32,
    width: 32,
  },
  checkIcon: {
    marginTop: 32,
    marginBottom: 32,
  },
  title: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 40,
  },
  okButton: {
    marginBottom: 24,
    width: 303,
    height: 48,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
  },
  notification: {
    position: "absolute",
    justifyContent: "center",
    left: width / 2,
    top: 48,
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: COLORS.RED,
  },
});

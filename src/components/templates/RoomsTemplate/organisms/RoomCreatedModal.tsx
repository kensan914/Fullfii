import React, { Dispatch } from "react";
import { Block, Button, Text } from "galio-framework";
import { StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

import { COLORS } from "src/constants/colors";
import { Icon } from "src/components/atoms/Icon";
import { width } from "src/constants";
import { useDomState } from "src/contexts/DomContext";

type Props = {
  isOpenRoomCreatedModal: boolean;
  setIsOpenRoomCreatedModal: Dispatch<boolean>;
  setIsOpenNotificationReminderModal: Dispatch<boolean>;
};
export const RoomCreatedModal: React.FC<Props> = (props) => {
  const {
    isOpenRoomCreatedModal,
    setIsOpenRoomCreatedModal,
    setIsOpenNotificationReminderModal,
  } = props;

  const domState = useDomState();

  const close = () => {
    setIsOpenRoomCreatedModal(false);
  };

  return (
    //RoomEditorModal.jsのModalコンポーネントのModalHideでsetIsOpenRoomCreatedModal(true)を呼び出す
    <Modal
      isVisible={isOpenRoomCreatedModal}
      deviceWidth={width}
      onBackdropPress={close}
      style={styles.modal}
      onModalHide={() => {
        if (!domState.pushNotificationParams.isChosenPermission) {
          setIsOpenNotificationReminderModal(true);
        }
      }}
    >
      <Block column style={styles.modalContent}>
        <TouchableOpacity style={styles.closeIcon} onPress={close}>
          <Icon
            name="close"
            family="Ionicons"
            size={32}
            color={COLORS.HIGHLIGHT_GRAY}
          />
        </TouchableOpacity>
        <Block center style={styles.checkIcon}>
          <Icon
            name="check-circle"
            family="Feather"
            size={80}
            color={COLORS.GREEN}
          />
        </Block>
        <Block center style={styles.title}>
          <Text bold size={18} color={COLORS.BLACK}>
            ルームを作成しました
          </Text>
        </Block>
        <Block center style={styles.description}>
          <Text size={14} color={COLORS.BLACK}>
            他のユーザーが入室するのを待ちましょう
          </Text>
        </Block>
        <Block center>
          <Button
            style={styles.okButton}
            color={COLORS.BROWN}
            shadowless
            onPress={close}
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

const styles = StyleSheet.create({
  modal: {},
  modalContent: {
    width: width - 40,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  closeIcon: {
    marginBottom: 32,
    width: 32,
  },
  checkIcon: {
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
});

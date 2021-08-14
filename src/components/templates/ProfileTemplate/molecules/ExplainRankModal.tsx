import React, { Dispatch } from "react";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Block, Text, Button } from "galio-framework";

import { COLORS } from "src/constants/colors";
import { geneFadeModalProps } from "src/utils/customModules";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
};
export const ExplainRankModal: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen } = props;
  const close = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isOpen}
      onBackdropPress={close}
      style={styles.modal}
      {...geneFadeModalProps()}
    >
      <Block style={styles.modalInnerContainer}>
        <Block style={styles.titleContainer}>
          <Text bold size={20} color={COLORS.BLACK}>
            レベルが上がると参加できるルーム数が増えます（beta版）
          </Text>
        </Block>
        <Block style={styles.descriptionContainer}>
          <Text size={14} color={COLORS.BLACK} style={styles.lineHeight}>
            相談した数や、話したい人リストに追加された数などによってレベルが上がります。
            {"\n"}
            レベルが上がると、参加できるルーム数が増えます。{"\n"}
            beta版のためレベル上限は2となっています。
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
  modal: {
    marginHorizontal: 20,
  },
  modalInnerContainer: {
    backgroundColor: COLORS.WHITE,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginTop: 32,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  lineHeight: {
    lineHeight: 20,
  },
  okButton: {
    marginTop: 24,
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

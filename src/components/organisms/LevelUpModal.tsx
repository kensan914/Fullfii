import React, { useState } from "react";
import {
  StyleSheet,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import { Block, Text, Button } from "galio-framework";

import { COLORS } from "src/constants/colors";
import { LAURELS_IMG } from "src/constants/imagePath";

export const LevelUpModal = () => {
  const [isOpen, setIsOpen] = useState(true)

  const close = () => {
    setIsOpen(false)
  }
  return (
    <Modal
      animationIn="fadeIn"
      animationInTiming={300}
      animationOut="fadeOut"
      animationOutTiming={300}
      backdropOpacity={0.7}
      isVisible={isOpen}
      onBackdropPress={close}
      style={styles.modal}
    >
      <Block style={styles.modalInnerContainer}>
      <Image
        source={LAURELS_IMG}
        style={styles.informationImage}
      />
      <Block center style={styles.mainTextContainer}>
        <Text size={96} color={COLORS.WHITE}>2</Text>
        <Text center size={16} color={COLORS.WHITE}>レベル</Text>
      </Block>
      <Block center >
        <Text size={16} color={COLORS.WHITE}>参加できるルーム数が2つに増えました！</Text>
      </Block>
      </Block>
      <Block center>
        <Button
          style={styles.okButton}
          color={COLORS.HIGHLIGHT_GRAY}
          shadowless
          onPress={close}
        >
          <Text size={20} color={COLORS.WHITE} bold>
            閉じる
          </Text>
        </Button>
      </Block>
    </Modal>
  )

}

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 20,

  },
  modalInnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative",
  },
  informationImage: {
    justifyContent: "center",
    alignItems: "center",
    resizeMode: 'cover',
    width: 250,
    height: 250,
  },
  mainTextContainer : {
    position: "absolute"
  },
  okButton: {
    marginTop: 24 ,
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

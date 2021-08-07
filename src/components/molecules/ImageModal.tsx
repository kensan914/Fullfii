import React, { Dispatch } from "react";
import { Block, Text } from "galio-framework";
import { StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import Modal from "react-native-modal";

import { RoundButton } from "src/components/atoms/RoundButton";
import { COLORS } from "src/constants/colors";
import { Icon } from "src/components/atoms/Icon";
import { width } from "src/constants";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  imageSource: any;
  title: string;
  subTitle?: string;
  buttonLabel?: string;
};
export const ImageModal: React.FC<Props> = (props) => {
  const {
    isOpen,
    setIsOpen,
    imageSource,
    title = "",
    subTitle = "",
    buttonLabel = "OK",
  } = props;
  const close = () => {
    setIsOpen(false);
  };

  return (
    <Modal isVisible={isOpen} onBackdropPress={close} deviceWidth={width}>
      <Block center style={styles.modalContent}>
        <ImageBackground
          source={imageSource}
          style={styles.informationImage}
          imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
        />
        <TouchableOpacity style={styles.closeIcon} onPress={close}>
          <Icon
            name="close"
            family="Ionicons"
            size={32}
            color={COLORS.HIGHLIGHT_GRAY}
          />
        </TouchableOpacity>
        <Block center style={styles.titleContainer}>
          <Text size={20} bold color={COLORS.BLACK}>
            {title}
          </Text>
        </Block>
        <Block center style={styles.subTitleContainer}>
          <Text size={14} color={COLORS.BLACK} style={styles.subTitle}>
            {subTitle}
          </Text>
        </Block>
        <RoundButton
          label={buttonLabel}
          style={styles.createButton}
          onPress={close}
        />
      </Block>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: width - 40,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    position: "relative",
  },
  informationImage: {
    height: 160,
    width: width - 40,
    backgroundColor: COLORS.BEIGE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleContainer: {
    marginTop: 32,
  },
  subTitleContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  subTitle: {
    lineHeight: 20,
  },
  createButton: {
    width: width - 72,
    marginBottom: 24,
  },
  closeIcon: {
    position: "absolute",
    top: 16,
    left: 16,
  },
});

import React, { Dispatch, useEffect, useRef } from "react";
import { StyleSheet, Image } from "react-native";
import Modal from "react-native-modal";
import { Block, Text, Button } from "galio-framework";
import AnimatedLottieView from "lottie-react-native";

import { COLORS } from "src/constants/colors";
import { LAURELS_IMG } from "src/constants/imagePath";
import { useProfileState } from "src/contexts/ProfileContext";
import { width } from "src/constants";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
};
export const LevelUpModal: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen } = props;

  const profileState = useProfileState();

  const close = () => {
    setIsOpen(false);
  };

  const geneSubText = () => {
    switch (profileState.profile.levelInfo.currentLevel) {
      case 2: {
        return "参加できるルーム数が2つに増えました！";
      }
    }
  };

  const lottieViewRef = useRef<AnimatedLottieView>(null);
  useEffect(() => {
    setTimeout(() => {
      if (isOpen) {
        lottieViewRef.current && lottieViewRef.current.play();
      }
    }, 200);
  }, [isOpen]);

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
        <Image source={LAURELS_IMG} style={styles.informationImage} />
        <Block center style={styles.mainTextContainer}>
          <Text size={96} color={COLORS.WHITE}>
            {profileState.profile.levelInfo.currentLevel}
          </Text>
          <Text center size={16} color={COLORS.WHITE}>
            レベル
          </Text>
        </Block>
        <Block center>
          <Text size={16} color={COLORS.WHITE}>
            {geneSubText()}
          </Text>
        </Block>
        <AnimatedLottieView
          ref={lottieViewRef}
          source={require("src/assets/animations/confetti.json")}
          style={{
            width: width * 1.2,
            alignSelf: "center",
            position: "absolute",
            bottom: 0,
          }}
          speed={1}
          loop={false}
        />
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
  );
};

const styles = StyleSheet.create({
  modal: {},
  modalInnerContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  informationImage: {
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
    width: 250,
    height: 250,
  },
  mainTextContainer: {
    position: "absolute",
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

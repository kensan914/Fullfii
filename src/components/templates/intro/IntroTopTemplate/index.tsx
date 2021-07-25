import React from "react";
import { Text, Button, Block } from "galio-framework";
import {
  StyleSheet,
} from "react-native";
import { COLORS } from "src/constants/colors";
import { width } from "src/constants";
import { Icon } from "src/components/atoms/Icon";


type Props = {
  navigateIntroCreateRoom: () => void;
  navigateIntroParticipateRoom: () => void;
  navigateIntroSignup: () => void;
};
export const IntroTopTemplate: React.FC<Props> = (props) => {
  const {
    navigateIntroCreateRoom,
    navigateIntroParticipateRoom,
    navigateIntroSignup,
  } = props;

  return (
    // color="transparent"
    <Block flex style={styles.container}>
      <Block flex={0.15}>
        <Text center size={24} bold color={COLORS.BLACK} style={styles.title}>私は...</Text>
      </Block>
      <Block flex={0.65} center style={styles.centerContainer}>
        <Block center space="between" style={styles.buttonContainer}>
          <Block style={styles.buttonAndIcon}>
            <Button shadowless={true}  color="transparent" opacity={0.5} style={styles.innerButton} onPress={navigateIntroCreateRoom}>
              <Text center size={24} color={COLORS.BROWN} bold style={styles.innerButtonText}>自分の悩みを{"\n"}話したい</Text>
            </Button>
            <Icon name="check-circle" family="Feather" size={32} color={COLORS.HIGHLIGHT_GRAY} style={styles.checkIcon}/>
          </Block>
          <Block style={styles.buttonAndIcon}>
            <Button shadowless={true} color="transparent" opacity={0.5} style={styles.innerButton}  onPress={navigateIntroParticipateRoom}>
              <Text center size={24} color={COLORS.BROWN} bold style={styles.innerButtonText}>誰かの悩みを{"\n"}聞いてあげたい</Text>
            </Button>
            <Icon name="check-circle" family="Feather" size={32} color={COLORS.GREEN} style={styles.checkIcon}/>
          </Block>
        </Block>
      </Block>
      <Block flex={0.2} center style={styles.bottomContainer}>
        <Button onPress={navigateIntroSignup} style={styles.bottomButton}>
          <Text size={20} bold color={COLORS.WHITE}>
            プロフィール作成へ進む
          </Text>
        </Button>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,
    position: "relative"
  },
  centerContainer: {
    justifyContent: "center"
  },
  buttonContainer: {
    height: 240,
  },
  buttonAndIcon: {
    position: "relative"
  },
  innerButton: {
    height: 64,
    width: width-64
  },
  innerButtonText: {
    lineHeight: 32
  },
  checkIcon: {
    position: "absolute",
    right: 40
  },
  title: {
    marginTop: 72,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 72
  },
  bottomButton: {
    backgroundColor: COLORS.BROWN,
    width: width-32,
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

})
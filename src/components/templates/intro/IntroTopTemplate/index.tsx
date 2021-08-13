import React from "react";
import { Text, Block } from "galio-framework";
import { StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "src/constants/colors";
import { width } from "src/constants";
import { IntroTopAnimationProps } from "src/screens/intro/IntroTopScreen/useIntroTopAnimation";
import { AnimatedView } from "src/components/templates/intro/organisms/AnimatedView";
import { IntroComment } from "src/components/templates/intro/molecules/IntroComment";

type Props = {
  // signupBuffer: SignupBuffer;
  // navigateIntroCreateRoom: () => void;
  // navigateIntroParticipateRoom: () => void;
  // navigateIntroSignup: () => void;
  animationProps: IntroTopAnimationProps;
};
export const IntroTopTemplate: React.FC<Props> = (props) => {
  const {
    // signupBuffer,
    // navigateIntroCreateRoom,
    // navigateIntroParticipateRoom,
    // navigateIntroSignup,
    animationProps,
  } = props;

  // const canNavigateIntroSignup =
  //   signupBuffer.introCreateRoom.isComplete ||
  //   signupBuffer.introParticipateRoom.isComplete;

  return (
    <Block flex style={styles.container}>
      {animationProps.currentScene === "01" && (
        <TouchableOpacity
          onPress={animationProps.onPressScreen}
          style={{ flex: 1 }}
          activeOpacity={1}
        >
          <AnimatedView
            style={styles.scene1Container}
            ref={animationProps.animatedViewRefScene1_whole}
          >
            <Block flex={0.4} style={styles.centerContainer}>
              <AnimatedView ref={animationProps.animatedViewRefScene1_title}>
                <Text
                  size={26}
                  bold
                  color={COLORS.BLACK}
                  style={styles.scene1Title}
                >
                  {"はじめまして\nようこそFullfiiへ"}
                </Text>
              </AnimatedView>
            </Block>
            <Block flex={0.2} style={styles.centerContainer}>
              <AnimatedView ref={animationProps.animatedViewRefScene1_comment}>
                <IntroComment>
                  {"Fullfiiは悩み相談専用のアプリです"}
                </IntroComment>
                <IntroComment style={{ marginTop: 16 }}>
                  {"悩み相談の前に簡単なプロフィールを作成しよう"}
                </IntroComment>
              </AnimatedView>
            </Block>
          </AnimatedView>
        </TouchableOpacity>
      )}
      {/* {animationProps.currentScene === "02" && (
        <AnimatedView
          style={styles.scene2Container}
          ref={animationProps.animatedViewRefScene2_whole}
        >
          <>
            <Block flex={0.15}>
              <Text
                center
                size={24}
                bold
                color={COLORS.BLACK}
                style={styles.title}
              >
                私は...
              </Text>
            </Block>
            <Block flex={0.65} center style={styles.centerContainer}>
              <Block center space="between" style={styles.buttonContainer}>
                <Block style={styles.buttonAndIcon}>
                  <Button
                    shadowless={true}
                    color="transparent"
                    opacity={0.5}
                    style={styles.innerButton}
                    onPress={navigateIntroCreateRoom}
                    disabled={signupBuffer.introCreateRoom.isComplete}
                  >
                    <Text
                      center
                      size={24}
                      color={
                        signupBuffer.introCreateRoom.isComplete
                          ? COLORS.LIGHT_PINK
                          : COLORS.BROWN
                      }
                      bold
                      style={styles.innerButtonText}
                    >
                      自分の悩みを{"\n"}話したい
                    </Text>
                  </Button>
                  <Icon
                    name="check-circle"
                    family="Feather"
                    size={32}
                    color={
                      signupBuffer.introCreateRoom.isComplete
                        ? COLORS.GREEN
                        : COLORS.HIGHLIGHT_GRAY
                    }
                    style={styles.checkIcon}
                  />
                </Block>
                <Block style={styles.buttonAndIcon}>
                  <Button
                    shadowless={true}
                    color="transparent"
                    opacity={0.5}
                    style={styles.innerButton}
                    onPress={navigateIntroParticipateRoom}
                    disabled={signupBuffer.introParticipateRoom.isComplete}
                  >
                    <Text
                      center
                      size={24}
                      color={
                        signupBuffer.introParticipateRoom.isComplete
                          ? COLORS.LIGHT_PINK
                          : COLORS.BROWN
                      }
                      bold
                      style={styles.innerButtonText}
                    >
                      誰かの悩みを{"\n"}聞いてあげたい
                    </Text>
                  </Button>
                  <Icon
                    name="check-circle"
                    family="Feather"
                    size={32}
                    color={
                      signupBuffer.introParticipateRoom.isComplete
                        ? COLORS.GREEN
                        : COLORS.HIGHLIGHT_GRAY
                    }
                    style={styles.checkIcon}
                  />
                </Block>
              </Block>
            </Block>
            <Block flex={0.2} center style={styles.bottomContainer}>
              {canNavigateIntroSignup && (
                <Button
                  onPress={navigateIntroSignup}
                  style={styles.bottomButton}
                >
                  <Text size={20} bold color={COLORS.WHITE}>
                    プロフィール作成へ進む
                  </Text>
                </Button>
              )}
            </Block>
          </>
        </AnimatedView>
      )} */}
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,
    position: "relative",
  },
  scene1Container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scene2Container: {
    flex: 1,
  },
  scene1Title: {
    width: width,
    alignSelf: "center",
    textAlign: "center",
  },
  centerContainer: {
    justifyContent: "center",
  },
  buttonContainer: {
    height: 240,
  },
  buttonAndIcon: {
    position: "relative",
  },
  innerButton: {
    height: 64,
    width: width - 64,
  },
  innerButtonText: {
    lineHeight: 32,
  },
  checkIcon: {
    position: "absolute",
    right: 40,
  },
  title: {
    marginTop: 72,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 72,
  },
  bottomButton: {
    backgroundColor: COLORS.BROWN,
    width: width - 32,
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

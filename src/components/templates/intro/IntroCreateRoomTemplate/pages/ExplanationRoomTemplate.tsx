import React from "react";
import { Block } from "galio-framework";
import { StyleSheet } from "react-native";

import { BodyAnimSettings_explanationRoom } from "src/types/Types";
import { AnimatedView } from "src/components/templates/intro/organisms/AnimatedView";
import { IntroComment } from "src/components/templates/intro/molecules/IntroComment";
import { INTRO_BODY_HEIGHT } from "src/components/templates/intro/organisms/IntroSlide";

type Props = {
  bodyAnimSettings: BodyAnimSettings_explanationRoom;
};
export const ExplanationRoomTemplate: React.FC<Props> = (props) => {
  const { bodyAnimSettings } = props;

  return (
    <Block flex style={styles.container}>
      <AnimatedView {...bodyAnimSettings[0]}>
        <IntroComment isLocateRight>ルームってなに ？？</IntroComment>
      </AnimatedView>

      <AnimatedView {...bodyAnimSettings[1]}>
        <IntroComment style={{ marginTop: 20 }}>
          "ルーム"は悩みを話すためのトークルームのことだよ！
        </IntroComment>
      </AnimatedView>

      <AnimatedView {...bodyAnimSettings[2]}>
        <IntroComment style={{ marginTop: 20 }}>
          悩みを話したい時は、まずはあなた専用のルームを作ろう！
        </IntroComment>
      </AnimatedView>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    justifyContent: "center",
    // heightを指定してしまうため, コンテンツが収まりきらなくてもスクロールはできない
    height: INTRO_BODY_HEIGHT,
  },
});

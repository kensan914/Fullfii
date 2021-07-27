import React from "react";
import { Text, Block } from "galio-framework";
import { StyleSheet } from "react-native";

import { COLORS } from "src/constants/colors";
import { width, height } from "src/constants";
import { Avatar } from "src/components/atoms/Avatar";
import { INTRO_BODY_HEIGHT } from "src/components/templates/intro/organisms/IntroSlide";
import { AnimatedView } from "src/components/templates/intro/organisms/AnimatedView";
import { IntroComment } from "src/components/templates/intro/molecules/IntroComment";
import { BodyAnimSettings_createdRoom } from "src/types/Types";

type Props = {
  bodyAnimSettings: BodyAnimSettings_createdRoom;
};
export const CreatedRoomTemplate: React.FC<Props> = (props) => {
  const { bodyAnimSettings } = props;

  return (
    <Block flex style={styles.container}>
      <Block style={styles.cardContainer}>
        <AnimatedView {...bodyAnimSettings[0]}>
          <Block style={styles.card}>
            <Block style={styles.title}>
              <Text
                size={16}
                color={COLORS.BLACK}
                bold
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                悩み相談名はなんでしょう！？
              </Text>
            </Block>
            <Block row>
              <Block style={styles.image} />
              <Block flex column>
                <Block row>
                  <Avatar size={32} imageUri={null} style={styles.avatar} />
                  <Block column style={styles.userInfo}>
                    <Text
                      size={14}
                      color={COLORS.LIGHT_GRAY}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      あなた
                    </Text>
                  </Block>
                </Block>
              </Block>
            </Block>
          </Block>
        </AnimatedView>
      </Block>

      <AnimatedView {...bodyAnimSettings[1]}>
        <IntroComment style={{ marginTop: height * 0.075 }}>
          おめでとう！🎉ルームの作成が完了したよ
        </IntroComment>
      </AnimatedView>

      <AnimatedView {...bodyAnimSettings[2]}>
        <IntroComment style={{ marginTop: 20 }}>
          あとは話しを聞いてくれる人がルームに入るまで待ちましょう！
        </IntroComment>
      </AnimatedView>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  cardContainer: {},
  card: {
    marginTop: 32,
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: "relative",
    width: width - 40,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.26,
    shadowRadius: 0,
    elevation: 1,
  },
  title: {
    marginBottom: 16,
  },
  avatar: {
    marginLeft: 16,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 20,
    backgroundColor: COLORS.BROWN,
  },
  userInfo: {
    marginLeft: 8,
    alignSelf: "center",
  },
});

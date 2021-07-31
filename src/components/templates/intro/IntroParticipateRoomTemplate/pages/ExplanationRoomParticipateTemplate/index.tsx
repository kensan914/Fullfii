import React from "react";
import { StyleSheet, Image } from "react-native";
import { Text, Block } from "galio-framework";

import { COLORS } from "src/constants/colors";
import { width, height } from "src/constants";
import { BodyAnimSettings_explanationRoomParticipate } from "src/types/Types";
import { AnimatedView } from "src/components/templates/intro/organisms/AnimatedView";
import { IntroComment } from "src/components/templates/intro/molecules/IntroComment";
import {
  INTRO_PARTICIPATE_ROOM_IMG,
  LECTURE_WOMAN_IMG,
} from "src/constants/imagePath";
import { Icon } from "src/components/atoms/Icon";

type Props = {
  bodyAnimSettings: BodyAnimSettings_explanationRoomParticipate;
};
export const ExplanationRoomParticipateTemplate: React.FC<Props> = (props) => {
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
                好きな人がいるのですが、話しかけられません...話聞いて欲しいです！
              </Text>
            </Block>
            <Block row>
              <Image source={INTRO_PARTICIPATE_ROOM_IMG} style={styles.image} />
              <Block flex column>
                <Block row>
                  <Image source={LECTURE_WOMAN_IMG} style={styles.cardAvatar} />
                  <Block column style={styles.userInfo}>
                    <Text
                      size={14}
                      color={COLORS.LIGHT_GRAY}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      匿名子
                    </Text>
                    <Block row>
                      <Block style={styles.userGender}>
                        <Text
                          size={14}
                          color={COLORS.LIGHT_GRAY}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          女性
                        </Text>
                      </Block>
                      <Block>
                        <Text
                          size={14}
                          color={COLORS.LIGHT_GRAY}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          内緒
                        </Text>
                      </Block>
                    </Block>
                  </Block>
                </Block>
                <Block row>
                  <Block flex row style={styles.member}>
                    <Block>
                      <Icon
                        name="person-outline"
                        family="Ionicons"
                        size={32}
                        color={COLORS.GRAY}
                      />
                    </Block>
                    <Block style={styles.memberText}>
                      <Text size={14} color={COLORS.LIGHT_GRAY}>
                        0/1
                      </Text>
                    </Block>
                  </Block>
                </Block>
              </Block>
            </Block>
          </Block>
        </AnimatedView>
      </Block>

      <AnimatedView {...bodyAnimSettings[1]}>
        <IntroComment style={{ marginTop: height * 0.04 }}>
          “ルーム”は悩みを話すためのトークルームのことだよ！
        </IntroComment>
      </AnimatedView>

      <AnimatedView {...bodyAnimSettings[2]}>
        <IntroComment style={{ marginTop: 20 }}>
          自分と共感できる悩みなら、ぜひ聞いてあげよう！
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
  userInfo: {
    marginLeft: 8,
    alignSelf: "center",
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 20,
    backgroundColor: COLORS.BROWN,
  },
  userGender: {
    marginRight: 4,
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 8,
    marginLeft: 16,
  },
  member: {
    marginLeft: 16,
    marginTop: 16,
    alignItems: "center",
  },
  memberText: {
    marginLeft: 8,
  },
});

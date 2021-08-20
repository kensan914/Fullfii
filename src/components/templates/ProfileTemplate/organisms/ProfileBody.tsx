import React, { useState } from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Block, Text, Button } from "galio-framework";

import { COLORS } from "src/constants/colors";
import { Avatar } from "src/components/atoms/Avatar";
import { formatGender } from "src/utils";
import { width } from "src/constants";
import { MeProfile, Profile } from "src/types/Types.context";
import {
  AnimatedScrollY,
  PROFILE_VIEW_HEIGHT_TYPE,
  RenderTabBar,
} from "src/types/Types";
import { Icon } from "src/components/atoms/Icon";
import { CircleProgressBar } from "src/components/templates/ProfileTemplate/molecules/CircleProgressBar";
import { ExplainRankModal } from "src/components/templates/ProfileTemplate/molecules/ExplainRankModal";
import { HiddenAnimatedViewStyle } from "src/hooks/tabInList/useTabInList";

type Props = {
  profile: Profile | MeProfile;
  isMe: boolean;
  animatedScrollY: AnimatedScrollY;
  renderTabBar: RenderTabBar;
  PROFILE_VIEW_HEIGHT: PROFILE_VIEW_HEIGHT_TYPE;
  PROFILE_BODY_HEIGHT: number;
  hiddenAnimatedViewStyle: HiddenAnimatedViewStyle;
};
export const ProfileBody: React.FC<Props> = (props) => {
  const {
    profile,
    isMe,
    animatedScrollY,
    renderTabBar,
    PROFILE_VIEW_HEIGHT,
    PROFILE_BODY_HEIGHT,
    hiddenAnimatedViewStyle,
  } = props;

  const navigation = useNavigation();

  const onTransitionProfileEditor = () => {
    navigation.navigate("ProfileEditor");
  };

  const [isOpenExplainRankModal, setIsOpenExplainRankModal] = useState(false);

  const geneExpStep = () => {
    if ("levelInfo" in profile) {
      const currentLevel =
        typeof profile.levelInfo !== "undefined"
          ? profile.levelInfo.currentLevel
          : 1;
      const expInCurrentLevel =
        typeof profile.levelInfo !== "undefined"
          ? profile.levelInfo.expInCurrentLevel
          : 0;
      // HACK: 上限2のため, Lv.2以上の経験値は表示しない
      if (currentLevel >= 2) {
        return 1;
      }

      return expInCurrentLevel;
    } else {
      return 1;
    }
  };
  const geneExpSteps = () => {
    if ("levelInfo" in profile) {
      const currentLevel =
        typeof profile.levelInfo !== "undefined"
          ? profile.levelInfo.currentLevel
          : 1;
      const requiredExpNextLevel =
        typeof profile.levelInfo !== "undefined"
          ? profile.levelInfo.requiredExpNextLevel
          : 0;

      // HACK: 上限2のため, Lv.2以上の経験値は表示しない
      if (currentLevel >= 2) {
        return 1;
      }

      return requiredExpNextLevel;
    } else {
      return 1;
    }
  };

  return (
    <>
      <Animated.View style={hiddenAnimatedViewStyle}>
        <Animated.View
          style={{
            opacity: animatedScrollY.interpolate({
              // ⇓ 40px遅く透明になり始め, 20px分完全に透明にしない
              inputRange: [40, PROFILE_VIEW_HEIGHT + 20],
              outputRange: [1, 0],
              extrapolate: "clamp",
            }),
          }}
        >
          <View
            style={[
              styles.container,
              {
                height: PROFILE_VIEW_HEIGHT,
              },
            ]}
          >
            <Block flex>
              <Block row style={styles.profileTopContainer}>
                <Animated.View
                  style={{
                    transform: [
                      {
                        scale: animatedScrollY.interpolate({
                          inputRange: [0, 24],
                          outputRange: [1, 0.7],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  }}
                >
                  <Avatar size={84} imageUri={profile.image} />
                </Animated.View>
                <Block row flex style={styles.counterContainer}>
                  <Block row flex style={styles.talkCounterContainer}>
                    <Block column center style={styles.spokeCounter}>
                      {/* 他者のマイページ且つ公開しない状態の場合はアイコン表示 */}
                      {!isMe && profile.isPrivateProfile ? (
                        <Icon
                          name="lock"
                          family="Feather"
                          size={20}
                          color={COLORS.GRAY}
                        />
                      ) : (
                        <Text
                          bold
                          color={COLORS.BLACK}
                          size={16}
                          style={styles.textHeight}
                        >
                          {profile.numOfOwner}
                        </Text>
                      )}

                      <Text
                        size={14}
                        color={COLORS.BLACK}
                        style={styles.textHeight}
                      >
                        話した
                      </Text>
                    </Block>
                    <Block column center style={styles.listenedCounter}>
                      {!isMe && profile.isPrivateProfile ? (
                        <Icon
                          name="lock"
                          family="Feather"
                          size={20}
                          color={COLORS.GRAY}
                        />
                      ) : (
                        <Text
                          bold
                          size={16}
                          color={COLORS.BLACK}
                          style={styles.textHeight}
                        >
                          {profile.numOfParticipated}
                        </Text>
                      )}
                      <Text
                        size={14}
                        color={COLORS.BLACK}
                        style={styles.textHeight}
                      >
                        聞いた
                      </Text>
                    </Block>
                  </Block>
                  {isMe && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.levelBarContainer}
                      onPress={() => {
                        setIsOpenExplainRankModal(true);
                      }}
                    >
                      <CircleProgressBar
                        step={geneExpStep()}
                        steps={geneExpSteps()}
                        label={
                          "levelInfo" in profile
                            ? typeof profile.levelInfo !== "undefined"
                              ? profile.levelInfo.currentLevel
                              : 1
                            : ""
                        }
                        subLabel={"レベル"}
                        diameter={80}
                        strokeWidth={6}
                      />
                    </TouchableOpacity>
                  )}
                </Block>
              </Block>
              <Block style={styles.profileInfoBox}>
                <Text
                  bold
                  size={16}
                  color={COLORS.BLACK}
                  style={styles.textHeight}
                >
                  {profile.name}
                </Text>
                <Text size={14} color={COLORS.BLACK} style={styles.textHeight}>
                  性別：
                  {formatGender(profile.gender, profile.isSecretGender).label}
                  {"   |   "}
                  職業：{profile.job.label}
                </Text>
              </Block>
              {isMe && (
                <Button
                  shadowless={true}
                  color="transparent"
                  opacity={0.6}
                  style={styles.editProfileButton}
                  onPress={() => {
                    onTransitionProfileEditor();
                  }}
                >
                  <Text size={14} bold color={COLORS.BROWN}>
                    プロフィールを編集
                  </Text>
                </Button>
              )}
            </Block>
          </View>
        </Animated.View>
        {isMe && renderTabBar()}
      </Animated.View>
      <ExplainRankModal
        isOpen={isOpenExplainRankModal}
        setIsOpen={setIsOpenExplainRankModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: COLORS.BEIGE,
  },
  container: {
    zIndex: 99,
    backgroundColor: COLORS.BEIGE,
    width: "100%",
    overflow: "hidden",
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  profileTopContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  counterContainer: {
    justifyContent: "space-around",
  },
  talkCounterContainer: {
    justifyContent: "space-evenly",
  },
  spokeCounter: {
    justifyContent: "center",
  },
  listenedCounter: {
    justifyContent: "center",
  },
  levelBarContainer: {
    justifyContent: "center",
  },
  textHeight: {
    lineHeight: 20,
  },
  profileInfoBox: {
    marginTop: 16,
  },
  editProfileButton: {
    width: width - 32,
    marginTop: 16,
    borderWidth: 2,
    borderColor: COLORS.BROWN,
    borderRadius: 4,
  },
});

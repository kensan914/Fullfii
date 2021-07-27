import React, { useEffect, useRef, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

import { BackButton } from "src/components/atoms/BackButton";
import { COLORS } from "src/constants/colors";
import { GoToPage, IntroPageSetting } from "src/types/Types";
import { showToast } from "src/utils/customModules";
import { TOAST_SETTINGS } from "src/constants/alertMessages";

type Props = {
  currentPage: number;
  goToPage: GoToPage;
  currentPageSetting: IntroPageSetting;
  height?: number;
  width?: number;
};
export const IntroHeaderLeft: React.FC<Props> = (props) => {
  const {
    currentPage,
    goToPage,
    currentPageSetting,
    height = 56,
    width = 44,
  } = props;

  const navigation = useNavigation();

  // 下記onPressBackがイベントハンドラ―となった時, 内部で使用しているstateが更新されないため
  const currentPageRef = useRef(currentPage);
  const currentPageSettingRef = useRef(currentPageSetting);
  useEffect(() => {
    currentPageRef.current = currentPage;
    currentPageSettingRef.current = currentPageSetting;
  }, [currentPage, currentPageSetting]);

  // BackHandler.addEventListenerにも使用するため, bool値を返す
  // trueを返すと, Androidのバックボタン押下時デフォルトの処理を実行しない
  const onPressBack = (): boolean => {
    if (
      typeof currentPageSettingRef.current.headerLeftAnimationType !==
      "undefined"
    ) {
      showToast(TOAST_SETTINGS["BACK_IN_INTRO_LAST_PAGE_ONLY_ANDROID"]);
      return true;
    }
    if (currentPageRef.current <= 1) {
      // 1ページ目
      navigation.goBack();
    } else {
      goToPage(currentPageRef.current - 1);
    }
    return true;
  };

  // back禁止代替アニメーション
  const lottieViewRef = useRef<LottieView>(null);
  const playPopAnimation = () => {
    lottieViewRef.current && lottieViewRef.current.reset();
    lottieViewRef.current && lottieViewRef.current.play();
  };
  const [lottieViewSize] = useState(36);
  useEffect(() => {
    if (currentPageSetting.headerLeftAnimationType) {
      playPopAnimation();
    }
  }, [currentPageSetting.headerLeftAnimationType]);

  const handleAndroidBack = () =>
    BackHandler.addEventListener("hardwareBackPress", onPressBack);
  useEffect(() => {
    handleAndroidBack();
    return () => {
      handleAndroidBack().remove();
    };
  }, []);

  return (
    <View style={[styles.container, { width: width, height: height }]}>
      {!currentPageSetting.headerLeftAnimationType ? (
        <BackButton
          onPress={onPressBack}
          color={COLORS.LIGHT_BROWN}
          isOpacity={currentPageSetting.headerLeftAnimationType === null}
          style={[
            styles.backButton,
            // currentPageSetting.isForbiddenBack ? { display: "none" } : {}, // TODO: ガタってなる
          ]}
        />
      ) : (
        <LottieView
          ref={lottieViewRef}
          source={require("src/assets/animations/success.json")}
          style={{
            position: "absolute",
            height: lottieViewSize,
            width: lottieViewSize,
            top: (height - lottieViewSize) / 4,
            left: (width - lottieViewSize) / 4 - 2,
          }}
          speed={1}
          loop={false}
          autoPlay
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  backButton: {},
});

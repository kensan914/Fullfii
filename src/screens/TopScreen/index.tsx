import React, { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import * as WebBrowser from "expo-web-browser";

import { TopTemplate } from "src/components/templates/TopTemplate";
import { LottieSource } from "src/types/Types";
import { logEvent } from "src/utils/firebase/logEvent";
import { useAuthDispatch } from "src/contexts/AuthContext";
import { useAtt } from "src/screens/TopScreen/useAtt";
import { USER_POLICY_URL } from "src/constants/env";

// CONSTANTS
const BALLOON_ANIMATION_DURATION_MS = 4180;
const FADE_IN_ANIMATION_DURATION_MS = 1500;
const BALLOON_ANIMATION_DELAY_MS = 200;

export const TopScreen: React.FC = () => {
  const authDispatch = useAuthDispatch();

  const [isEndAnimation, setIsEndAnimation] = useState(false);

  // ==== appTrackingTransparency ====
  const { showAttModal, renderAttModal } = useAtt();

  // ==== 風船アニメーション ====
  const [lottieBalloonSource, setLottieBalloonSource] =
    useState<LottieSource>();
  const animationProgressRef = useRef(new Animated.Value(0));
  const isAnimated = useRef(false);

  useEffect(() => {
    (async () => {
      import("src/assets/animations/balloon.json").then((source) => {
        setLottieBalloonSource(source.default);
      });
    })();
  }, []);

  const playBalloonAnimation = () => {
    setTimeout(() => {
      Animated.timing(animationProgressRef.current, {
        toValue: 1,
        duration: BALLOON_ANIMATION_DURATION_MS,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          // アニメーション終了
          fadeIn();
        }
      });
      isAnimated.current = true;
    }, BALLOON_ANIMATION_DELAY_MS);
  };

  useEffect(() => {
    // まだアニメーションしていない時
    if (!isAnimated.current && lottieBalloonSource) {
      playBalloonAnimation();
    }
  }, [lottieBalloonSource]);

  // ==== フェードイン ====
  const fadeInOpacityRef = useRef(new Animated.Value(0));
  const fadeIn = () => {
    Animated.timing(fadeInOpacityRef.current, {
      toValue: 1,
      duration: FADE_IN_ANIMATION_DURATION_MS,
      useNativeDriver: false,
    }).start(() => {
      showAttModal();
      setIsEndAnimation(true);
    });
  };

  const openBrowserUserPolicy = () => {
    if (!isEndAnimation) return;

    WebBrowser.openBrowserAsync(USER_POLICY_URL);
  };

  const onPressConsent = () => {
    if (!isEndAnimation) return;

    logEvent("start_intro");
    authDispatch({ type: "START_INTRO" });
  };

  return (
    <>
      <TopTemplate
        onPressConsent={onPressConsent}
        openBrowserUserPolicy={openBrowserUserPolicy}
        animationProgressRef={animationProgressRef}
        lottieBalloonSource={lottieBalloonSource}
        fadeInOpacityRef={fadeInOpacityRef}
        isEndAnimation={isEndAnimation}
      />
      {renderAttModal()}
    </>
  );
};

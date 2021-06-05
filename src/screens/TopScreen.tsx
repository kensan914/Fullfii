import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { Animated } from "react-native";

import { TopTemplate } from "src/components/templates/TopTemplate";
import { LottieSource } from "src/types/Types";

// CONSTANTS
const BALLOON_ANIMATION_DURATION_MS = 4180;
const FADE_IN_ANIMATION_DURATION_MS = 1500;
const BALLOON_ANIMATION_DELAY_MS = 200;

export const TopScreen: React.FC = () => {
  const navigation = useNavigation();

  // ==== 風船アニメーション ====
  const [
    lottieBalloonSource,
    setLottieBalloonSource,
  ] = useState<LottieSource>();
  const animationProgressRef = useRef(new Animated.Value(0));
  const isAnimated = useRef(false);
  const [isEndAnimation, setIsEndAnimation] = useState(false);

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
          setIsEndAnimation(true);
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
    }).start();
  };

  const onPressConsent = () => {
    navigation.navigate("Onboarding");
  };

  return (
    <TopTemplate
      onPressConsent={onPressConsent}
      animationProgressRef={animationProgressRef}
      lottieBalloonSource={lottieBalloonSource}
      fadeInOpacityRef={fadeInOpacityRef}
      isEndAnimation={isEndAnimation}
    />
  );
};

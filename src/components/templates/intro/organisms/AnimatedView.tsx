import React, { ReactNode, useImperativeHandle, useRef, useState } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

import { InAnimatedViewSetting, OutAnimatedViewSetting } from "src/types/Types";
import { getValue } from "src/utils";

export type AnimatedViewMethods = {
  startInAnimation: (
    onCompleteAnimation: () => void,
    inAnimationSetting?: InAnimatedViewSetting
  ) => void;
  startOutAnimation: (
    onCompleteAnimation: () => void,
    outAnimationSetting?: OutAnimatedViewSetting
  ) => void;
};
type Props = {
  style?: StyleProp<ViewStyle>;
  duration?: number;
  delayStartIntervalMs?: number;
  children: ReactNode;
};
export const AnimatedView = React.forwardRef<AnimatedViewMethods, Props>(
  (props, ref) => {
    const { style, duration = 400, delayStartIntervalMs = 0, children } = props;

    const animatedOpacity = useRef(new Animated.Value(0)).current;
    const animatedTransLateY = useRef(new Animated.Value(0)).current;
    const animatedScale = useRef(new Animated.Value(1)).current;
    const [isShow, setIsShow] = useState(false);

    const startAnimationOtherThanFade = (
      animationSetting: InAnimatedViewSetting | OutAnimatedViewSetting
    ) => {
      const _duration = getValue<number>(animationSetting.duration, duration);
      if (typeof animationSetting.settingByType === "undefined") return;
      switch (animationSetting.settingByType.type) {
        case "FADE_IN_UP": {
          animatedTransLateY.setValue(
            animationSetting.settingByType.initTransLateBottom
          );
          Animated.timing(animatedTransLateY, {
            toValue: 0,
            duration: _duration,
            useNativeDriver: true,
          }).start();
          return;
        }
        case "FADE_IN_ZOOM": {
          animatedScale.setValue(0);
          if (
            typeof animationSetting.settingByType.springConfig === "undefined"
          ) {
            Animated.timing(animatedScale, {
              toValue: 1,
              duration: _duration,
              useNativeDriver: true,
            }).start();
          } else {
            Animated.spring(animatedScale, {
              ...animationSetting.settingByType.springConfig,
              toValue: 1,
              useNativeDriver: true,
            }).start();
          }
          return;
        }
      }
    };

    useImperativeHandle(ref, () => ({
      startInAnimation: (
        onCompleteAnimation,
        inAnimationSetting = {
          settingByType: { type: "FADE_IN" },
          duration: duration,
          delayStartIntervalMs: delayStartIntervalMs,
        }
      ) => {
        setTimeout(() => {
          setIsShow(true);

          animatedOpacity.setValue(0);
          Animated.timing(animatedOpacity, {
            toValue: 1,
            duration: getValue<number>(inAnimationSetting.duration, duration),
            useNativeDriver: true,
          }).start(onCompleteAnimation);
          startAnimationOtherThanFade(inAnimationSetting);
        }, getValue<number>(inAnimationSetting.delayStartIntervalMs, delayStartIntervalMs));
      },
      startOutAnimation: (
        onCompleteAnimation,
        outAnimationSetting = {
          settingByType: { type: "FADE_OUT" },
          duration: duration,
          delayStartIntervalMs: delayStartIntervalMs,
        }
      ) => {
        setTimeout(() => {
          animatedOpacity.setValue(1);
          Animated.timing(animatedOpacity, {
            toValue: 0,
            duration: getValue<number>(outAnimationSetting.duration, duration),
            useNativeDriver: true,
          }).start(() => {
            setIsShow(false);
            onCompleteAnimation();
          });
          startAnimationOtherThanFade(outAnimationSetting);
        }, getValue<number>(outAnimationSetting.delayStartIntervalMs, delayStartIntervalMs));
      },
    }));

    return (
      <Animated.View
        style={[
          {
            opacity: animatedOpacity,
            transform: [
              {
                translateY: animatedTransLateY,
              },
              {
                scale: animatedScale,
              },
            ],
          },
          style,
        ]}
        // ⇓ 非表示時はタップeventが伝播しないように
        pointerEvents={isShow ? "auto" : "none"}
      >
        {children}
      </Animated.View>
    );
  }
);

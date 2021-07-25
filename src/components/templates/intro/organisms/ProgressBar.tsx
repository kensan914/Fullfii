import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ViewStyle, Animated } from "react-native";

import { COLORS } from "src/constants/colors";

type Props = {
  step: number;
  steps: number;
  height?: number;
  style?: ViewStyle;
  barColor?: string;
  containerColor?: string;
  isShowPopAnimation?: boolean;
};
export const ProgressBar: React.FC<Props> = (props) => {
  const {
    step,
    steps,
    height = 16,
    style,
    barColor = COLORS.DEEP_PINK,
    containerColor = COLORS.HIGHLIGHT_GRAY,
    isShowPopAnimation = false,
  } = props;

  const [width, setWidth] = useState(0);
  const animatedValue = useRef(new Animated.Value(-1000)).current;
  const reactive = useRef(new Animated.Value(-1000)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (0 <= step && step <= steps) {
      reactive.setValue(-width + (width * step) / steps);
    }
  }, [step, width]);

  // popアニメーション
  const lottieViewRef = useRef<LottieView>(null);
  const animationProgressRef = useRef(new Animated.Value(0));
  const playPopAnimation = () => {
    lottieViewRef.current && lottieViewRef.current.reset();
    lottieViewRef.current && lottieViewRef.current.play();
  };
  const [lottieViewSize] = useState(120);
  useEffect(() => {
    if (isShowPopAnimation && 1 < step && step <= steps) {
      playPopAnimation();
    }
  }, [step]);

  return (
    <View
      onLayout={(e) => {
        const newWidth = e.nativeEvent.layout.width;
        setWidth(newWidth);
      }}
      style={[{ height: height }, style]}
    >
      <View
        style={[
          styles.barContainer,
          {
            height: height,
            width: width,
            borderRadius: height / 2.4,
            backgroundColor: containerColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.bar,
            {
              height: height,
              borderRadius: height / 2.4,
              backgroundColor: barColor,
              transform: [
                {
                  translateX: animatedValue,
                },
              ],
            },
          ]}
        />
      </View>
      {isShowPopAnimation && (
        <View
          style={[
            styles.popContainer,
            {
              height: height,
              width: width,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.bar,
              {
                height: height,
                transform: [
                  {
                    translateX: animatedValue,
                  },
                ],
              },
            ]}
          >
            <LottieView
              ref={lottieViewRef}
              source={require("src/assets/animations/pop2.json")}
              progress={animationProgressRef.current}
              style={{
                height: lottieViewSize,
                width: lottieViewSize,
                justifyContent: "center",
                alignItems: "center",
                right: -lottieViewSize / 4,
              }}
              speed={1}
              loop={false}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    overflow: "hidden",
    position: "absolute",
    left: 0,
    top: 0,
  },
  bar: {
    width: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  popContainer: {
    position: "absolute",
    left: 0,
    top: 0,
  },
});

import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ViewStyle, Animated } from "react-native";
import LottieView from "lottie-react-native";

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
  const [dotSize] = useState(height * 0.56);
  // ex) step=3 => [1, 2, 3]
  const [stepRange] = useState(Array.from(Array(steps), (v, k) => k + 1));

  // popアニメーション
  const lottieViewRef = useRef<LottieView>(null);
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
      style={[styles.container, { height: height }, style]}
    >
      {/* ⇓ バー本体 */}
      <View
        style={[
          styles.barContainer,
          {
            height: height,
            width: width,
            borderRadius: height / 2,
            backgroundColor: containerColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.bar,
            {
              height: height,
              borderRadius: height / 2,
              backgroundColor: barColor,
              transform: [
                {
                  translateX: animatedValue,
                },
              ],
            },
          ]}
        >
          <View
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              position: "absolute",
              top: (height - dotSize) / 2,
              right: (height - dotSize) / 2,
              backgroundColor: COLORS.PINK,
            }}
          />
        </Animated.View>

        {/* チェック */}
        {stepRange.map((page) => {
          const isChecked = page < step;
          const isCurrent = page == step;

          const containerSize = isChecked ? height * 0 : dotSize;
          const contentSize = isChecked ? height * 0 : dotSize;

          return (
            <View
              key={page}
              style={[
                {
                  position: "absolute",
                  top: (height - containerSize) / 2,

                  left: (width * page) / steps - containerSize * 1.3,
                  width: containerSize,
                  height: containerSize,
                  borderRadius: containerSize / 2,
                  backgroundColor: isChecked ? COLORS.BEIGE : COLORS.WHITE,
                },
                isCurrent ? { zIndex: -1 } : {},
              ]}
            >
              {isChecked && (
                <View
                  style={{
                    position: "absolute",

                    top: (containerSize - contentSize) / 2,
                    left: (containerSize - contentSize) / 2,
                    width: contentSize,
                    height: contentSize,
                    borderRadius: contentSize / 2,
                    backgroundColor: COLORS.PINK,
                  }}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* ⇓ popアニメーション */}
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
  container: {
    justifyContent: "center",
  },
  barContainer: {
    overflow: "hidden",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 10,
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

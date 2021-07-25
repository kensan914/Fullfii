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
};
export const ProgressBar: React.FC<Props> = (props) => {
  const {
    step,
    steps,
    height = 16,
    style,
    barColor = COLORS.DEEP_PINK,
    containerColor = COLORS.HIGHLIGHT_GRAY,
  } = props;

  const [finalSteps] = useState(steps);
  const [width, setWidth] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const reactive = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      // toValue: step,
      toValue: reactive,
      duration: 360,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // reactive.setValue(-width + (width * step) / steps);
    reactive.setValue(step / steps);
  }, [step, width]);

  // popアニメーション
  const animation = useRef<LottieView>(null);
  const animationProgressRef = useRef(new Animated.Value(0));
  const playPopAnimation = () => {
    animation.current && animation.current.reset();
    animation.current && animation.current.play();
  };
  useEffect(() => {
    if (step > 0) {
      playPopAnimation();
    }
  }, [step]);

  return (
    <>
      <View
        onLayout={(e) => {
          const newWidth = e.nativeEvent.layout.width;
          setWidth(newWidth);
        }}
        style={[
          styles.container,
          {
            height: height,
            borderRadius: height / 2.4,
            backgroundColor: containerColor,
          },
          style,
        ]}
      >
        <Animated.View
          style={[
            styles.bar,
            {
              height: height,
              borderRadius: height / 2.4,
              backgroundColor: barColor,
              // width: animatedValue.interpolate({
              //   inputRange: [0, finalSteps],
              //   outputRange: ["0%", "100%"],
              // }),
              transform: [
                {
                  scaleX: animatedValue,
                  // translateX: animatedValue,
                },
              ],
            },
          ]}
        >
          <LottieView
            ref={animation}
            source={require("src/assets/animations/pop.json")}
            progress={animationProgressRef.current}
            style={{
              // height: height + 16,
              // width: height + 16,
              height: 200,
              width: 200,
              justifyContent: "center",
              alignItems: "center",
              right: -50,
            }}
            speed={2}
            // onAnimationFinish={onPopAnimationFinish}
            loop={false}
          />
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // overflow: "hidden",
    position: "relative",
  },
  bar: {
    width: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    justifyContent: "center",
    alignItems: "flex-end",
  },
});

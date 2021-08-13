import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { Text } from "galio-framework";

import { width } from "src/constants";
import { COLORS } from "src/constants/colors";

type Props = {
  step: number;
  steps: number;
  diameter?: number; // 直径 (default: width / 3)
  strokeWidth?: number; // プログレスバーの太さ (default: diameter * 0.1)
  barColor?: string;
  containerColor?: string;
  label?: string | number;
  subLabel?: string | number;
  style?: StyleProp<ViewStyle>;
};
export const CircleProgressBar: React.FC<Props> = (props) => {
  const {
    step,
    steps,
    diameter = width / 3,
    strokeWidth = diameter * 0.1,
    barColor = COLORS.DEEP_PINK,
    containerColor = COLORS.HIGHLIGHT_GRAY,
    label,
    subLabel,
    style,
  } = props;
  const radius = diameter / 2;
  const halfCircleSize = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius; // 円周
  const strokeDashoffset = circumference - (circumference * step) / steps;

  return (
    <View style={[style]}>
      <Svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${halfCircleSize * 2} ${halfCircleSize * 2}`}
      >
        <G rotation={"-90"} origin={`${halfCircleSize}, ${halfCircleSize}`}>
          <Circle
            cx="50%"
            cy="50%"
            stroke={containerColor}
            strokeWidth={strokeWidth}
            r={radius}
          />
          <Circle
            cx="50%"
            cy="50%"
            stroke={barColor}
            strokeWidth={strokeWidth}
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
        <View
          style={[styles.labelContainer, { width: diameter, height: diameter }]}
        >
          {typeof label !== "undefined" && (
            <Text bold size={16} color={COLORS.BLACK}>
              {label}
            </Text>
          )}
          {typeof subLabel !== "undefined" && (
            <Text size={14} color={COLORS.BLACK}>
              {subLabel}
            </Text>
          )}
        </View>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});

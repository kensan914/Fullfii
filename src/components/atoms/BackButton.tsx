import React from "react";

import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Icon } from "src/components/atoms/Icon";
import { COLORS } from "src/constants/colors";

type Props = {
  onPress: () => void;
  style?: ViewStyle;
  color?: string;
};
export const BackButton: React.FC<Props> = (props) => {
  const { onPress, style, color = COLORS.GRAY } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.backIconContainer, style]}
    >
      {Platform.OS === "ios" ? (
        <Icon family="font-awesome" size={30} name="angle-left" color={color} />
      ) : (
        <Icon family="material" size={30} name="arrow-back" color={color} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backIconContainer: {
    height: "100%",
    justifyContent: "center",
  },
});

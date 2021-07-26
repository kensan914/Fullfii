import React from "react";

import {
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Icon } from "src/components/atoms/Icon";
import { COLORS } from "src/constants/colors";

type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  color?: string;
  isOpacity?: boolean;
};
export const BackButton: React.FC<Props> = (props) => {
  const { onPress, style, color = COLORS.GRAY, isOpacity } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.backIconContainer, style]}
    >
      {Platform.OS === "ios" ? (
        <Icon
          family="font-awesome"
          size={30}
          name="angle-left"
          color={color}
          style={isOpacity ? { opacity: 0 } : {}}
        />
      ) : (
        <Icon
          family="material"
          size={30}
          name="arrow-back"
          color={color}
          style={isOpacity ? { opacity: 0 } : {}}
        />
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

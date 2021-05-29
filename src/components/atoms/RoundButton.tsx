import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Button, Text } from "galio-framework";

import { COLORS } from "src/constants/theme";

type Props = {
  label: string;
  onPress?: () => void;
  isLoading?: boolean;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
};
export const RoundButton: React.FC<Props> = (props) => {
  const { label, onPress, isLoading, style, disabled } = props;
  return (
    <Button
      style={[styles.button, disabled ? {} : styles.shadow, style]}
      color={disabled ? "lightgray" : COLORS.BROWN}
      shadowless
      onPress={onPress}
      loading={isLoading}
      disabled={disabled}
    >
      <Text size={20} color={COLORS.WHITE} bold>
        {label}
      </Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    width: 335,
    height: 48,
    borderRadius: 30,
    elevation: 1,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
});

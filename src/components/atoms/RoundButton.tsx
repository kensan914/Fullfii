import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Button, Text, Block } from "galio-framework";

import { COLORS } from "src/constants/colors";
import { Icon } from "src/components/atoms/Icon";

type Props = {
  label: string;
  buttonColor?: string;
  iconName?: string;
  iconFamily?: string;
  onPress?: () => void;
  isLoading?: boolean;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
};
export const RoundButton: React.FC<Props> = (props) => {
  const {
    label,
    iconName,
    iconFamily,
    buttonColor = COLORS.BROWN,
    onPress = () => void 0,
    isLoading = false,
    disabled = false,
    style,
  } = props;
  return (
    <Button
      style={[styles.button, disabled ? {} : styles.shadow, style]}
      color={disabled ? "lightgray" : buttonColor}
      shadowless
      onPress={onPress}
      loading={isLoading}
      disabled={disabled || isLoading}
    >
      <Block row center style={styles.buttonInner}>
        <Icon
          name={iconName}
          family={iconFamily}
          size={32}
          color={COLORS.WHITE}
          style={styles.buttonIcon}
        />
        <Block style={styles.buttonText}>
          <Text size={20} color={COLORS.WHITE} bold>
            {label}
          </Text>
        </Block>
      </Block>
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    height: 48,
    borderRadius: 30,
    elevation: 1,
    paddingHorizontal: 32,
  },
  buttonInner: {
    height: 48,
    borderRadius: 30,
    justifyContent: "center",
  },
  buttonIcon: {
    paddingRight: 4,
  },
  buttonText: {
    paddingLeft: 4,
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

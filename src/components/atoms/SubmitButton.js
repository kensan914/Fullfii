import React from "react";
import { StyleSheet } from "react-native";
import { Text, Button } from "galio-framework";

import { COLORS } from "src/constants/theme";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const SubmitButton = (props) => {
  const { canSubmit, isLoading, submit, style, children } = props;

  let color;
  let textColor;
  let pressedFunc;
  if (canSubmit) {
    color = COLORS.PINK;
    textColor = COLORS.WHITE;
    pressedFunc = submit;
  } else {
    color = "lightgray";
    textColor = COLORS.WHITE;
  }

  return (
    <Button
      round
      size="large"
      disabled={!canSubmit || isLoading}
      color={color}
      style={[styles.submitButton, { shadowColor: color }, style]}
      loading={isLoading}
      onPress={pressedFunc}
    >
      <Text color={textColor} size={16} bold>
        {children ? children : "決定"}
      </Text>
    </Button>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  submitButton: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
  },
});

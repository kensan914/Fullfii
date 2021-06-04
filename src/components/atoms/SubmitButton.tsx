import React from "react";
import { StyleSheet, ViewStyle } from "react-native";

import { RoundButton } from "src/components/atoms/RoundButton";

type Props = {
  canSubmit: boolean;
  isLoading: boolean;
  submit: () => void;
  style: ViewStyle;
  label?: string;
};
export const SubmitButton: React.FC<Props> = (props) => {
  const { canSubmit, isLoading, submit, style, label } = props;

  let pressedFunc;
  if (canSubmit) {
    pressedFunc = submit;
  } else {
    //
  }

  return (
    <RoundButton
      label={label ? label : "決定"}
      iconName="check"
      iconFamily="AntDesign"
      isLoading={isLoading}
      onPress={pressedFunc}
      disabled={!canSubmit}
      style={[styles.submitButton, style]}
    />
  );
};

const styles = StyleSheet.create({
  submitButton: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
  },
});

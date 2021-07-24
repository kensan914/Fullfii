import React from "react";
import { InputToolbar, InputToolbarProps } from "react-native-gifted-chat";

import { COLORS } from "src/constants/theme";

export const GiftedInputToolbar: React.FC<InputToolbarProps> = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{ backgroundColor: COLORS.BEIGE, borderTopWidth: 0 }}
    />
  );
};

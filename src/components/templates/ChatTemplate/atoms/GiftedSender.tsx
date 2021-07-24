import React from "react";
import { Send } from "react-native-gifted-chat";

import { Icon } from "src/components/atoms/Icon";
import { COLORS } from "src/constants/colors";

export const GiftedSender: React.FC<Send["props"]> = (props) => (
  <Send
    {...props}
    containerStyle={{
      justifyContent: "center",
      paddingHorizontal: 14,
      paddingRight: 27,
    }}
  >
    <Icon size={23} name="send" family="font-awesome" color={COLORS.BROWN} />
  </Send>
);

import React from "react";
import {
  IMessage,
  SystemMessage,
  SystemMessageProps,
} from "react-native-gifted-chat";

import { width } from "src/constants";
import { COLORS } from "src/constants/theme";

export const GiftedSystemMessage: React.FC<SystemMessageProps<IMessage>> = (
  props
) => {
  return (
    <SystemMessage
      {...props}
      containerStyle={{
        marginBottom: 15,
        backgroundColor: COLORS.BROWN_RGBA_1,
        padding: 8,
        width: width * 0.8,
        alignSelf: "center",
        borderRadius: 14,
      }}
      textStyle={{
        fontSize: 14,
        color: COLORS.GRAY,
      }}
    />
  );
};

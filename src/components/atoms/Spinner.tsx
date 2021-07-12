import React from "react";
import { Block } from "galio-framework";
import { ActivityIndicator } from "react-native";

import { height, width } from "src/constants";

/**
 * custom spinner
 */
export const Spinner: React.FC = () => {
  return (
    <Block
      style={{
        width: width,
        height: height,
        position: "absolute",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
        // zIndex: 1, // for Android
      }}
    >
      <ActivityIndicator color="white" size="large" />
    </Block>
  );
};

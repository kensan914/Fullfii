import React from "react";

import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "src/components/atoms/Icon";
import { COLORS } from "src/constants/colors";

type Props = {
  onPress: () => void;
};
export const BackButton: React.FC<Props> = (props) => {
  const { onPress } = props;

  return (
    <TouchableOpacity onPress={onPress} style={styles.backIconContainer}>
      {Platform.OS === "ios" ? (
        <Icon
          family="font-awesome"
          size={30}
          name="angle-left"
          color={COLORS.GRAY}
        />
      ) : (
        <Icon
          family="material"
          size={30}
          name="arrow-back"
          color={COLORS.GRAY}
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

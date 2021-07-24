import React from "react";
import { Block, Text } from "galio-framework";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Icon } from "src/components/atoms/Icon";
import { COLORS } from "src/constants/theme";
import { width } from "src/constants";
import { cvtBadgeCount } from "src/utils";

type Props = {
  onPressClose: () => void;
};
export const ProfileEditReminder: React.FC<Props> = (props) => {
  const { onPressClose } = props;

  return (
    <Block style={styles.alert}>
      <TouchableOpacity style={styles.closeIcon} onPress={onPressClose}>
        <Icon
          name="close"
          family="Ionicons"
          size={32}
          color={COLORS.HIGHLIGHT_GRAY}
        />
      </TouchableOpacity>
      <Block style={styles.messageContainer}>
        <Text size={16} color={COLORS.BLACK}>
          プロフィールを入力すると他のユーザーがあなたのルームに入りやすくなります
        </Text>
      </Block>
      <Block center style={styles.notification}>
        <Text bold size={15} color={COLORS.WHITE}>
          {cvtBadgeCount(1)}
        </Text>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  alert: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: "relative",
    width: width - 40,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.26,
    shadowRadius: 0,
    elevation: 1,
  },
  closeIcon: {
    marginBottom: 8,
    width: 32,
  },
  messageContainer: {
    marginRight: 32,
  },
  notification: {
    position: "absolute",
    justifyContent: "center",
    right: 16,
    top: 16,
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: COLORS.RED,
  },
});

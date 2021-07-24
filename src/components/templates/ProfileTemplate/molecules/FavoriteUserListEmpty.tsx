import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Block, Text, Button } from "galio-framework";

import { COLORS } from "src/constants/theme";
import { Icon } from "src/components/atoms/Icon";
import { FavoriteUserDemoModal } from "src/components/templates/ProfileTemplate/molecules/FavoriteUserDemoModal";

export const FavoriteUserListEmpty: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Block style={styles.container} center>
        <Block>
          <Text size={14} bold color={COLORS.LIGHT_GRAY}>
            また話したい人リストは0人です
          </Text>
        </Block>
        <Button
          shadowless={true}
          color="transparent"
          opacity={0.6}
          style={styles.infoWhatTalkAgainList}
          onPress={() => {
            setIsOpen(true);
          }}
        >
          <Icon name="info" family="Feather" size={26} color={COLORS.BROWN} />
          <Text size={14} bold color={COLORS.BROWN} style={styles.textHeight}>
            また話したい人リストとは？
          </Text>
        </Button>
      </Block>
      <FavoriteUserDemoModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: 48 },
  textHeight: {
    lineHeight: 20,
  },
  infoWhatTalkAgainList: {
    width: 240,
    marginTop: 80,
  },
});

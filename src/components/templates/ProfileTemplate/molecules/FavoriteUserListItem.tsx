import React from "react";
import { StyleSheet } from "react-native";
import { Block, Text, Button } from "galio-framework";

import { COLORS } from "src/constants/theme";
import { Icon } from "src/components/atoms/Icon";
import { Avatar } from "src/components/atoms/Avatar";

type Props = {
  name: string;
  ProfileImageUri: string | null;
};

export const FavoriteUserListItem: React.FC<Props> = (props) => {
  const { name, ProfileImageUri } = props;
  return (
    <Block row space="between" style={styles.listItemContainer}>
      <Block row center>
        <Avatar
          size={40}
          imageUri={ProfileImageUri}
          style={styles.otherProfileImage}
        />
        <Block style={styles.otherProfileName}>
          <Text size={14} bold color={COLORS.BLACK} style={styles.textHeight}>
            {name}
          </Text>
        </Block>
      </Block>
      <Button
        shadowless={true}
        color="transparent"
        opacity={0.6}
        style={styles.toSeeTalkHistoryBox}
      >
        <Block row center>
          <Text size={14} bold color={COLORS.BROWN} style={styles.textHeight}>
            トーク履歴を見る
          </Text>
          <Block center style={styles.iconAngleRight}>
            <Icon
              name="angle-right"
              family="font-awesome"
              size={32}
              color={COLORS.BROWN}
            />
          </Block>
        </Block>
      </Button>
    </Block>
  );
};

const styles = StyleSheet.create({
  textHeight: {
    lineHeight: 20,
  },
  otherProfileImage: {
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: COLORS.BLACK,
  },
  listItemContainer: {
    alignItems: "center",
    height: 64,
  },
  otherProfileName: {
    marginLeft: 16,
  },
  toSeeTalkHistoryBox: {
    width: "auto",
    height: 48,
  },
  iconAngleRight: {
    height: 32,
    width: 32,
  },
});

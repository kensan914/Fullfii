import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Block, Text, Button } from "galio-framework";

import { COLORS } from "src/constants/colors";
import { Icon } from "src/components/atoms/Icon";
import { Avatar } from "src/components/atoms/Avatar";
import { Profile } from "src/types/Types.context";

type Props = {
  user: Profile;
  navigateMessageHistory: (user: Profile) => void;
  onLongPressItem: (user: Profile) => void;
};

export const FavoriteUserListItem: React.FC<Props> = (props) => {
  const { user, navigateMessageHistory, onLongPressItem } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        navigateMessageHistory(user);
      }}
      onLongPress={() => {
        onLongPressItem(user);
      }}
    >
      <Block row space="between" style={styles.listItemContainer}>
        <Block row center>
          <Avatar
            size={40}
            imageUri={user.image}
            style={styles.otherProfileImage}
          />
          <Block style={styles.otherProfileName}>
            <Text size={14} bold color={COLORS.BLACK} style={styles.textHeight}>
              {user.name}
            </Text>
          </Block>
        </Block>
        <Button
          shadowless={true}
          color="transparent"
          opacity={0.6}
          style={styles.toSeeTalkHistoryBox}
          onPress={() => {
            navigateMessageHistory(user);
          }}
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
    </TouchableOpacity>
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
    paddingLeft: 16,
    paddingRight: 16,
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

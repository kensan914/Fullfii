import React from "react";

import { Profile } from "src/types/Types.context";
import { SceneProps } from "src/types/Types";
import { FavoriteUserListEmpty } from "src/components/templates/ProfileTemplate/molecules/FavoriteUserListEmpty";
import { FavoriteUserListItem } from "src/components/templates/ProfileTemplate/molecules/FavoriteUserListItem";
import { SceneRendererProps } from "react-native-tab-view";
import { Animated, StyleSheet } from "react-native";
import { COLORS } from "src/constants/theme";
import { useAnimatedFlatListProps } from "src/screens/ProfileScreen/useAnimatedFlatListProps";

type Props = {
  users: Profile[];
};
export const FavoriteUserList = React.forwardRef<
  any,
  Props & SceneProps & SceneRendererProps
>((props, ref) => {
  const {
    users,
    animatedScrollY,
    onUpdateOffsetY,
    PROFILE_VIEW_HEIGHT,
    PROFILE_BODY_HEIGHT,
  } = props;

  const { animatedFlatListProps } = useAnimatedFlatListProps(
    animatedScrollY,
    onUpdateOffsetY,
    PROFILE_VIEW_HEIGHT,
    PROFILE_BODY_HEIGHT
  );

  return (
    <Animated.FlatList
      ref={ref}
      {...animatedFlatListProps}
      style={styles.container}
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <FavoriteUserListItem
          key={item.id}
          name={item.name}
          ProfileImageUri={item.image}
        />
      )}
      ListEmptyComponent={FavoriteUserListEmpty}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: COLORS.BEIGE,
  },
});

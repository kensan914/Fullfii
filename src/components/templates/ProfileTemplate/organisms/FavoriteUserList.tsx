import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SceneRendererProps } from "react-native-tab-view";

import { Profile } from "src/types/Types.context";
import {
  GetFavoriteUsersResData,
  GetFavoriteUsersResDataIoTs,
  SceneProps,
} from "src/types/Types";
import { FavoriteUserListEmpty } from "src/components/templates/ProfileTemplate/molecules/FavoriteUserListEmpty";
import { FavoriteUserListItem } from "src/components/templates/ProfileTemplate/molecules/FavoriteUserListItem";
import { COLORS } from "src/constants/theme";
import { useAnimatedFlatListProps } from "src/screens/ProfileScreen/useAnimatedFlatListProps";
import { useFetchItems } from "src/hooks/useFetchItems";
import { URLJoin } from "src/utils";
import { BASE_URL } from "src/constants/env";

// type Props = {
// };
export const FavoriteUserList = React.forwardRef<
  any,
  SceneProps & SceneRendererProps
>((props, ref) => {
  const {
    animatedScrollY,
    onUpdateOffsetY,
    PROFILE_VIEW_HEIGHT,
    PROFILE_BODY_HEIGHT,
  } = props;

  const [favoriteUsers, setFavoriteUsers] = useState<Profile[]>([]);

  const { animatedFlatListProps } = useAnimatedFlatListProps(
    animatedScrollY,
    onUpdateOffsetY,
    PROFILE_VIEW_HEIGHT,
    PROFILE_BODY_HEIGHT
  );

  const cvtJsonToObject = (resData: GetFavoriteUsersResData): Profile[] => {
    const favoriteUsers = resData.favoriteUsers;
    return favoriteUsers;
  };
  const getHasMore = (resData: GetFavoriteUsersResData) => resData.hasMore;
  const {
    onEndReached,
    handleRefresh,
    isRefreshing,
    hasMore,
    isLoadingGetItems,
  } = useFetchItems<Profile, GetFavoriteUsersResData>(
    favoriteUsers,
    setFavoriteUsers,
    URLJoin(BASE_URL, "me/favorites/users/"),
    GetFavoriteUsersResDataIoTs,
    cvtJsonToObject,
    getHasMore
  );

  // HACK: コンテンツが0だとonEndReachedが発火しないため
  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <Animated.FlatList
      ref={ref}
      {...animatedFlatListProps}
      data={favoriteUsers}
      renderItem={({ item }) => (
        <FavoriteUserListItem
          key={item.id}
          name={item.name}
          ProfileImageUri={item.image}
        />
      )}
      style={styles.container}
      keyExtractor={(user) => user.id.toString()}
      onEndReached={() => {
        onEndReached();
      }}
      onEndReachedThreshold={0.3}
      ListFooterComponent={() =>
        hasMore && !isRefreshing ? (
          <ActivityIndicator
            size="large"
            color={COLORS.LIGHT_GRAY}
            style={{
              marginVertical: 16,
            }}
          />
        ) : (
          <></>
        )
      }
      ListEmptyComponent={hasMore ? <></> : FavoriteUserListEmpty}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          // android only (インジケータの位置は, iOSでは既にuseAnimatedFlatListProps.ts内にて対応済み)
          progressViewOffset={PROFILE_BODY_HEIGHT}
        />
      }
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

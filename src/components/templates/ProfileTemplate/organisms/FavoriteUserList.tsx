import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
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
import { alertModal, URLJoin } from "src/utils";
import { BASE_URL } from "src/constants/env";
import { width } from "src/constants";
import { useNavigation } from "@react-navigation/native";
import { showActionSheet, showToast } from "src/utils/customModules";
import { requestDeleteMeFavoritesUsers } from "src/hooks/requests/useRequestMeFavorites";
import { useAuthState } from "src/contexts/AuthContext";
import { useChatDispatch } from "src/contexts/ChatContext";
import { TOAST_SETTINGS } from "src/constants/alertMessages";

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

  const navigation = useNavigation();
  const authState = useAuthState();
  const chatDispatch = useChatDispatch();

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

  // item methods
  const navigateMessageHistory = (user: Profile): void => {
    navigation.navigate("MessageHistory", { user: user });
  };
  const onLongPressItem = (user: Profile): void => {
    showActionSheet([
      {
        label: "キャンセル",
        cancel: true,
      },
      {
        label: "削除する",
        destructive: true,
        onPress: () => {
          const _mainText = "また話したい人リストから削除";
          const _subText = `本当に${user.name}さんをまた話したい人リストから削除してよろしいですか？`;
          alertModal({
            mainText: _mainText,
            subText: _subText,
            cancelButton: "キャンセル",
            okButton: "削除する",
            okButtonStyle: "destructive",
            onPress: () => {
              requestDeleteMeFavoritesUsers(user.id, authState.token, () => {
                showToast(TOAST_SETTINGS["DELETE_FAVORITE_USER"]);
                setFavoriteUsers(
                  favoriteUsers.filter((favoriteUser) => {
                    return favoriteUser.id !== user.id;
                  })
                );
                chatDispatch({
                  type: "DELETE_FAVORITE_USER",
                  userId: user.id,
                });
              });
            },
          });
        },
      },
    ]);
  };

  return (
    <>
      <Animated.FlatList
        ref={ref}
        {...animatedFlatListProps}
        data={favoriteUsers}
        renderItem={({ item }) => (
          <FavoriteUserListItem
            key={item.id}
            user={item}
            navigateMessageHistory={navigateMessageHistory}
            onLongPressItem={onLongPressItem}
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
        ListHeaderComponent={
          // iOSはprogressViewOffsetがきかないため, 擬似インジケータで対処
          Platform.OS === "ios"
            ? () => {
                return (
                  <ActivityIndicator
                    size="large"
                    color={COLORS.LIGHT_GRAY}
                    style={styles.indicatorOnlyIOS}
                  />
                );
              }
            : void 0
        }
        ListEmptyComponent={hasMore ? <></> : FavoriteUserListEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            // android only (インジケータの位置は, iOSでは上記ListHeaderComponentにて対応済み)
            progressViewOffset={PROFILE_BODY_HEIGHT}
          />
        }
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,
  },
  indicatorOnlyIOS: {
    position: "absolute",
    top: -60,
    width: width,
    height: 60,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

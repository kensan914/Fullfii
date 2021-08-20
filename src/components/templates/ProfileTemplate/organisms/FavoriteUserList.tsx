import React, { useEffect, useState } from "react";
import { ActivityIndicator, Animated, StyleSheet } from "react-native";
import { SceneRendererProps } from "react-native-tab-view";
import { useNavigation } from "@react-navigation/native";

import { Profile } from "src/types/Types.context";
import {
  GetFavoriteUsersResData,
  GetFavoriteUsersResDataIoTs,
} from "src/types/Types";
import { FavoriteUserListEmpty } from "src/components/templates/ProfileTemplate/molecules/FavoriteUserListEmpty";
import { FavoriteUserListItem } from "src/components/templates/ProfileTemplate/molecules/FavoriteUserListItem";
import { COLORS } from "src/constants/colors";
import { useFetchItems } from "src/hooks/useFetchItems";
import { URLJoin } from "src/utils";
import { BASE_URL } from "src/constants/env";
import {
  alertModal,
  showActionSheet,
  showToast,
} from "src/utils/customModules";
import { requestDeleteMeFavoritesUsers } from "src/hooks/requests/useRequestMeFavorites";
import { useAuthState } from "src/contexts/AuthContext";
import { useChatDispatch } from "src/contexts/ChatContext";
import { TOAST_SETTINGS } from "src/constants/alertMessages";
import { TabInListSettingsProps } from "src/hooks/tabInList/useTabInList";
import { useAnimatedListProps } from "src/hooks/tabInList/useAnimatedListProps";

export const FavoriteUserList: React.FC<
  TabInListSettingsProps & SceneRendererProps
> = (props) => {
  const { tabInListSettings } = props;

  const navigation = useNavigation();
  const authState = useAuthState();
  const chatDispatch = useChatDispatch();

  const [favoriteUsers, setFavoriteUsers] = useState<Profile[]>([]);

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
    isLoading: isLoadingGetItems,
  } = useFetchItems<Profile, GetFavoriteUsersResData>(
    favoriteUsers,
    setFavoriteUsers,
    URLJoin(BASE_URL, "me/favorites/users/"),
    GetFavoriteUsersResDataIoTs,
    cvtJsonToObject,
    getHasMore
  );

  const { animatedFlatListProps } = useAnimatedListProps(tabInListSettings, {
    isRefreshing: isRefreshing,
    handleRefresh: handleRefresh,
  });

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
              requestDeleteMeFavoritesUsers(
                user.id,
                authState.token,
                chatDispatch,
                () => {
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
                }
              );
            },
          });
        },
      },
    ]);
  };

  const navigateProfile = (_profile: Profile) => {
    navigation.navigate("Profile", { profile: _profile });
  };

  return (
    <>
      <Animated.FlatList
        {...animatedFlatListProps}
        data={favoriteUsers}
        renderItem={({ item }) => (
          <FavoriteUserListItem
            key={item.id}
            user={item}
            navigateProfile={navigateProfile}
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
        ListEmptyComponent={hasMore ? <></> : FavoriteUserListEmpty}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,
  },
});

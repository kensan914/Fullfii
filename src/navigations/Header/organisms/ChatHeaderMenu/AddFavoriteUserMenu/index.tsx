import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";

import { Icon } from "src/components/atoms/Icon";
import { TOAST_SETTINGS } from "src/constants/alertMessages";
import { COLORS } from "src/constants/colors";
import { useChatDispatch } from "src/contexts/ChatContext";
import {
  useRequestDeleteMeFavoritesUsers,
  useRequestPatchMeFavoritesUsers,
} from "src/hooks/requests/useRequestMeFavorites";
import { showToast } from "src/utils/customModules";

type Props = {
  isReadyTalk: boolean;
  targetFavoriteUserId: string | undefined;
  isAddedFavoriteUserRef: React.MutableRefObject<boolean>;
  isAddedFavoriteUser: boolean;
  style?: ViewStyle;
};
export const AddFavoriteUserMenu: React.FC<Props> = (props) => {
  const {
    isReadyTalk,
    targetFavoriteUserId,
    isAddedFavoriteUserRef,
    isAddedFavoriteUser,
    style,
  } = props;

  const chatDispatch = useChatDispatch();

  // 追加リクエスト
  const { requestPatchMeFavoritesUsers, isLoadingPatchMeFavoritesUsers } =
    useRequestPatchMeFavoritesUsers(
      targetFavoriteUserId,
      () => {
        isAddedFavoriteUserRef.current = true;
        showToast(TOAST_SETTINGS["ADD_FAVORITE_USER"]);
      },
      () => {
        // 追加キャンセル
        if (targetFavoriteUserId) {
          chatDispatch({
            type: "DELETE_FAVORITE_USER",
            userId: targetFavoriteUserId,
          });
        }
      }
    );
  // 削除リクエスト
  const { requestDeleteMeFavoritesUsers, isLoadingDeleteMeFavoritesUsers } =
    useRequestDeleteMeFavoritesUsers(
      targetFavoriteUserId,
      () => {
        isAddedFavoriteUserRef.current = false;
        showToast(TOAST_SETTINGS["DELETE_FAVORITE_USER"]);
      },
      () => {
        // 削除キャンセル
        if (targetFavoriteUserId) {
          chatDispatch({
            type: "ADD_FAVORITE_USER",
            userId: targetFavoriteUserId,
          });
        }
      }
    );

  const onPressFavoriteUserMenu = () => {
    if (
      isReadyTalk &&
      !isLoadingPatchMeFavoritesUsers &&
      !isLoadingDeleteMeFavoritesUsers
    ) {
      if (isAddedFavoriteUserRef.current) {
        if (targetFavoriteUserId) {
          requestDeleteMeFavoritesUsers();
          chatDispatch({
            type: "DELETE_FAVORITE_USER",
            userId: targetFavoriteUserId,
          });
        }
      } else {
        if (targetFavoriteUserId) {
          requestPatchMeFavoritesUsers();
          chatDispatch({
            type: "ADD_FAVORITE_USER",
            userId: targetFavoriteUserId,
          });
        }
      }
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[style]}
        onPress={() => {
          if (isReadyTalk) {
            onPressFavoriteUserMenu();
          }
        }}
      >
        <Icon
          family="material-community"
          size={32}
          name="playlist-plus"
          color={
            isReadyTalk
              ? isAddedFavoriteUser
                ? COLORS.PINK
                : COLORS.BROWN
              : COLORS.TRANSPARENT
          }
        />
      </TouchableOpacity>
    </>
  );
};

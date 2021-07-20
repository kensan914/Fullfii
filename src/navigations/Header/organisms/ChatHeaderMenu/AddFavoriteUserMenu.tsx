import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";

import { Icon } from "src/components/atoms/Icon";
import { TOAST_SETTINGS } from "src/constants/alertMessages";
import { COLORS } from "src/constants/theme";
import { useChatDispatch, useChatState } from "src/contexts/ChatContext";
import {
  useRequestDeleteMeFavoritesUsers,
  useRequestPatchMeFavoritesUsers,
} from "src/hooks/requests/useRequestMeFavorites";
import { showToast } from "src/utils/customModules";

type Props = {
  roomId: string;
  isReadyTalk: boolean;
  isReadyTalkForOwner: boolean;
  style?: ViewStyle;
};
export const AddFavoriteUserMenu: React.FC<Props> = (props) => {
  const { roomId, isReadyTalk, isReadyTalkForOwner, style } = props;

  const chatState = useChatState();
  const chatDispatch = useChatDispatch();

  const targetFavoriteUserId: string | undefined = isReadyTalk
    ? isReadyTalkForOwner
      ? chatState.talkingRoomCollection[roomId]?.participants[0]?.id // HACK:
      : chatState.talkingRoomCollection[roomId]?.owner?.id
    : void 0;

  // 即時反映お気に入りフラグ
  const isAddedFavoriteUserRef = useRef(false);
  useEffect(() => {
    // ⇓初期化
    if (isReadyTalk && targetFavoriteUserId) {
      isAddedFavoriteUserRef.current =
        chatState.talkingRoomCollection[roomId].addedFavoriteUserIds.includes(
          targetFavoriteUserId
        );
    }
  }, [isReadyTalk]);

  // お気に入りフラグ
  const [isAddedFavoriteUser, setIsAddedFavoriteUser] = useState(false);
  useEffect(() => {
    // ⇓初期化
    if (isReadyTalk && targetFavoriteUserId) {
      setIsAddedFavoriteUser(
        chatState.talkingRoomCollection[roomId].addedFavoriteUserIds.includes(
          targetFavoriteUserId
        )
      );
    }
  }, [
    isReadyTalk,
    chatState.talkingRoomCollection[roomId]?.addedFavoriteUserIds?.length,
  ]);

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
            roomId: roomId,
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
            roomId: roomId,
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
            roomId: roomId,
            userId: targetFavoriteUserId,
          });
        }
      } else {
        if (targetFavoriteUserId) {
          requestPatchMeFavoritesUsers();
          chatDispatch({
            type: "ADD_FAVORITE_USER",
            roomId: roomId,
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

import { useEffect, useRef, useState } from "react";

import { useChatState } from "src/contexts/ChatContext";

export const useAddFavoriteUser = (
  roomId: string,
  isReadyTalk: boolean,
  isReadyTalkForOwner: boolean
): {
  targetFavoriteUserId: string | undefined;
  isAddedFavoriteUserRef: React.MutableRefObject<boolean>;
  isAddedFavoriteUser: boolean;
} => {
  const chatState = useChatState();

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

  return {
    targetFavoriteUserId,
    isAddedFavoriteUserRef,
    isAddedFavoriteUser,
  };
};

import { Alert } from "react-native";
import { ALERT_MESSAGES } from "src/constants/alertMessages";
import { useChatState } from "src/contexts/ChatContext";
import { useProfileState } from "src/contexts/ProfileContext";

type UseCanCreateRoom = () => {
  checkCanCreateRoom: () => boolean;
};
/**
 * ルーム作成可能かの判定関数checkCanCreateRoom()を提供
 * @returns { checkCanCreateRoom }
 */
export const useCanCreateRoom: UseCanCreateRoom = () => {
  const chatState = useChatState();
  const profileState = useProfileState();

  const checkCanCreateRoom = () => {
    // 全てのトーキングルームが自分の作成したものでなければ、作成可能
    const canCreate = Object.values(chatState.talkingRoomCollection).every(
      (talkingRoom) => {
        return talkingRoom.owner.id !== profileState.profile.id;
      }
    );

    if (canCreate) {
      return true;
    } else {
      Alert.alert(...ALERT_MESSAGES["CANNOT_CREATE_NEW_ROOM"]);
      return false;
    }
  };

  return { checkCanCreateRoom };
};

type UseCanParticipateRoom = () => {
  checkCanParticipateRoom: () => boolean;
};
/**
 * ルーム参加可能かの判定関数checkCanParticipateRoom()を提供
 * @returns { checkCanCreateRoom }
 */
export const useCanParticipateRoom: UseCanParticipateRoom = () => {
  const chatState = useChatState();
  const profileState = useProfileState();

  const checkCanParticipateRoom = () => {
    const participatingRooms = Object.values(
      chatState.talkingRoomCollection
    ).filter((talkingRoom) => {
      return talkingRoom.owner.id !== profileState.profile.id;
    });
    const canParticipate =
      participatingRooms.length < profileState.profile.limitParticipate;

    if (canParticipate) {
      return true;
    } else {
      Alert.alert(...ALERT_MESSAGES["CANNOT_PARTICIPATE_ROOM"]);
      return false;
    }
  };

  return { checkCanParticipateRoom };
};

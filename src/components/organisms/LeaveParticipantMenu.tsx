import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertButton,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useChatState } from "src/contexts/ChatContext";
import { useRequestPostRoomLeftMembers } from "src/hooks/requests/useRequestRoomMembers";
import { useProfileState } from "src/contexts/ProfileContext";
import { ALERT_MESSAGES, TOAST_SETTINGS } from "src/constants/alertMessages";
import { showToast } from "src/utils/customModules";
import { COLORS } from "src/constants/theme";
import { useLeaveAndRecreateRoom } from "./ByeByeMenu/useLeaveAndRecreateRoom";
import Icon from "src/components/atoms/Icon";
import { useRequestPatchBlockedAccount } from "src/hooks/requests/useRequestMe";

type Props = {
  roomId: string;
  style?: ViewStyle;
};
export const LeaveParticipantMenu: React.FC<Props> = (props) => {
  const { roomId, style } = props;

  const chatState = useChatState();
  const profileState = useProfileState();
  const navigation = useNavigation();

  const { requestPostRoomLeftMembers } = useRequestPostRoomLeftMembers(
    roomId,
    () => void 0,
    () => {
      // クローズ成功時
      additionalThenClose && additionalThenClose.fn();
      navigation.navigate("Home");
    }
  );
  const { leaveAndRecreateRoom, additionalThenClose } = useLeaveAndRecreateRoom(
    requestPostRoomLeftMembers,
    () => {
      showToast(TOAST_SETTINGS["LEAVE_PARTICIPANT"]);
    }
  );

  const { dynamicRequestPatchBlockedAccount } = useRequestPatchBlockedAccount();

  const onPressLeaveParticipant = () => {
    if (roomId in chatState.talkingRoomCollection) {
      const talkingRoom = chatState.talkingRoomCollection[roomId];
      const participant = // HACK: 参加者が一人のみである場合のみ
        talkingRoom.participants.length > 0
          ? talkingRoom.participants[0]
          : null;

      const OWNER_LEAVE_PARTICIPANT_BUTTON_TITLE = "退室させる";

      let mainTextSuffix = "";
      let subText = "";
      let buttons: AlertButton[];

      if (!disable) {
        mainTextSuffix = ALERT_MESSAGES["OWNER_LEAVE_PARTICIPANT"][0];
        subText = ALERT_MESSAGES["OWNER_LEAVE_PARTICIPANT"][1];
        buttons = [
          {
            text: OWNER_LEAVE_PARTICIPANT_BUTTON_TITLE,
            onPress: () => {
              leaveAndRecreateRoom(talkingRoom);
              participant && dynamicRequestPatchBlockedAccount(participant);
            },
          },
        ];

        Alert.alert(`${participant?.name}${mainTextSuffix}`, subText, [
          {
            text: "キャンセル",
            style: "cancel",
          },
          ...buttons,
        ]);
      }
    }
  };

  const [disable, setDisable] = useState(true);
  useEffect(() => {
    // トーク開始済み, かつ作成者のみ表示
    if (
      roomId in chatState.talkingRoomCollection &&
      chatState.talkingRoomCollection[roomId].isStart &&
      chatState.talkingRoomCollection[roomId].owner.id ===
        profileState.profile.id
    ) {
      setDisable(false);
    }
  }, [chatState.talkingRoomCollection]);

  return (
    <>
      <TouchableOpacity
        style={[styles.leaveButton, style]}
        onPress={() => {
          if (!disable) {
            onPressLeaveParticipant();
          }
        }}
      >
        <Icon
          family="Entypo"
          size={32}
          name="block"
          color={!disable ? COLORS.BROWN : COLORS.TRANSPARENT}
        />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  leaveButton: {},
  byeByeButtonLabel: {
    textAlign: "center",
  },
});

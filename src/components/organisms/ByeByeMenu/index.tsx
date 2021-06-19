import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertButton,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text } from "galio-framework";

import { useChatState } from "src/contexts/ChatContext";
import { useRequestPostRoomLeftMembers } from "src/hooks/requests/useRequestRoomMembers";
import { useProfileState } from "src/contexts/ProfileContext";
import { ALERT_MESSAGES, TOAST_SETTINGS } from "src/constants/alertMessages";
import { showToast } from "src/utils/customModules";
import { COLORS } from "src/constants/theme";
import { useLeaveAndRecreateRoom } from "src/components/organisms/ByeByeMenu/useLeaveAndRecreateRoom";

type Props = {
  roomId: string;
  style?: ViewStyle;
};
export const ByeByeMenu: React.FC<Props> = (props) => {
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
      showToast(TOAST_SETTINGS["LEAVE_ROOM_WITH_RECREATE_OWNER"]);
    }
  );

  const onPressByeBye = () => {
    if (roomId in chatState.talkingRoomCollection) {
      const talkingRoom = chatState.talkingRoomCollection[roomId];
      const isOwner = talkingRoom.owner.id === profileState.profile.id;
      const LEAVE_ROOM_OWNER_BUTTON_TITLE = "退室してルームを削除";
      const LEAVE_ROOM_OWNER_WITH_RECREATE_BUTTON_TITLE = "退室して再募集";
      const LEAVE_ROOM_PARTICIPANT_BUTTON_TITLE = "退室する";

      // 先行退室のみ退室メッセージ送信
      if (!talkingRoom.isEnd) {
        let mainText = "";
        let subText = "";
        let buttons: AlertButton[];

        const genePostDataIncludeLeaveMessage = (text: string | undefined) => {
          const postDataIncludeLeaveMessage = {
            account_id: profileState.profile.id,
          };
          const wrapLeaveMessage = (_text: string) => {
            return `【退室メッセージを贈ります👋】\n${_text}`;
          };
          if (text) {
            return {
              data: {
                ...postDataIncludeLeaveMessage,
                leave_message: wrapLeaveMessage(text),
              },
            };
          } else {
            return { data: postDataIncludeLeaveMessage };
          }
        };

        const checkCanLeaveRoom = (
          text: string | undefined,
          shouldAlert?: boolean
        ): boolean => {
          // メッセージがかわされず, かつ退室メッセを入力しなかった
          if (
            !text &&
            !talkingRoom.messages.some((_message) => !("isCommon" in _message))
          ) {
            if (shouldAlert) Alert.alert("一言を入力する必要があります");
            return false;
          }

          // 文字数超過
          if (text && text.length > 1000) {
            if (shouldAlert)
              Alert.alert(
                "文字数が超過しています",
                "最大文字数は1000文字です。"
              );
            return false;
          }

          return true;
        };

        // 作成者
        if (isOwner) {
          mainText = ALERT_MESSAGES["LEAVE_ROOM_OWNER"][0];
          subText = ALERT_MESSAGES["LEAVE_ROOM_OWNER"][1];
          buttons = [
            {
              text: LEAVE_ROOM_OWNER_BUTTON_TITLE,
              onPress: (text) => {
                if (checkCanLeaveRoom(text, true)) {
                  requestPostRoomLeftMembers({
                    ...genePostDataIncludeLeaveMessage(text),
                    thenCallback: () => {
                      showToast(TOAST_SETTINGS["LEAVE_ROOM_OWNER"]);
                    },
                  });
                }
              },
            },
            {
              text: LEAVE_ROOM_OWNER_WITH_RECREATE_BUTTON_TITLE,
              onPress: (text) => {
                if (checkCanLeaveRoom(text, true)) {
                  leaveAndRecreateRoom(
                    talkingRoom,
                    genePostDataIncludeLeaveMessage(text)
                  );
                }
              },
            },
          ];
        }
        // 参加者
        else {
          mainText = ALERT_MESSAGES["LEAVE_ROOM_PARTICIPANT"][0];
          subText = ALERT_MESSAGES["LEAVE_ROOM_PARTICIPANT"][1];
          buttons = [
            {
              text: LEAVE_ROOM_PARTICIPANT_BUTTON_TITLE,
              onPress: (text) => {
                if (checkCanLeaveRoom(text, true)) {
                  requestPostRoomLeftMembers({
                    ...genePostDataIncludeLeaveMessage(text),
                    thenCallback: () => {
                      showToast(TOAST_SETTINGS["LEAVE_ROOM_PARTICIPANT"]);
                    },
                  });
                }
              },
            },
          ];
        }
        Alert.prompt(
          mainText,
          subText,
          [
            {
              text: "キャンセル",
              style: "cancel",
            },
            ...buttons,
          ],
          "plain-text"
        );
      }

      // 後攻
      else {
        const mainText = ALERT_MESSAGES["LEAVE_ROOM_WITHOUT_MESSAGE"][0];
        const subText = ALERT_MESSAGES["LEAVE_ROOM_WITHOUT_MESSAGE"][1];
        let buttons: AlertButton[];

        // 作成者
        if (isOwner) {
          buttons = [
            {
              text: LEAVE_ROOM_OWNER_BUTTON_TITLE,
              onPress: () => {
                requestPostRoomLeftMembers({
                  thenCallback: () => {
                    showToast(TOAST_SETTINGS["LEAVE_ROOM_OWNER"]);
                  },
                });
              },
            },
            {
              text: LEAVE_ROOM_OWNER_WITH_RECREATE_BUTTON_TITLE,
              onPress: () => {
                leaveAndRecreateRoom(talkingRoom);
              },
            },
          ];
        }

        // 参加者
        else {
          buttons = [
            {
              text: LEAVE_ROOM_PARTICIPANT_BUTTON_TITLE,
              onPress: () => {
                requestPostRoomLeftMembers({
                  thenCallback: () => {
                    showToast(TOAST_SETTINGS["LEAVE_ROOM_PARTICIPANT"]);
                  },
                });
              },
            },
          ];
        }

        Alert.alert(mainText, subText, [
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
    // トーク開始済みのみ表示
    if (
      roomId in chatState.talkingRoomCollection &&
      chatState.talkingRoomCollection[roomId].isStart
    ) {
      setDisable(false);
    }
  }, [chatState.talkingRoomCollection]);

  return (
    <>
      {!disable && (
        <TouchableOpacity
          style={[styles.byeByeButton, style]}
          onPress={() => {
            if (!disable) {
              onPressByeBye();
            }
          }}
        >
          <Text size={16} color={"white"} bold style={styles.byeByeButtonLabel}>
            {"終了👋"}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  byeByeButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: 72,
    height: 32,
    backgroundColor: COLORS.BROWN,
    borderRadius: 8,
  },
  byeByeButtonLabel: {
    textAlign: "center",
  },
});

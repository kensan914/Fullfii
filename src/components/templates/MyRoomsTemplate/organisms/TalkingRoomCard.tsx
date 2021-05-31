import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  TouchableHighlight,
} from "react-native";

import IconExtra from "src/components/atoms/Icon";
import { COLORS } from "src/constants/theme";
import Avatar from "src/components/atoms/Avatar";
import RoomEditorModal from "src/components/organisms/RoomEditorModal";
import { width } from "src/constants";
import { TalkingRoom } from "src/types/Types.context";
import { useRoomParticipantsNum } from "src/screens/RoomsScreen/useRoomParticipantsNum";
import { useProfileState } from "src/contexts/ProfileContext";
import { showActionSheet, showToast } from "src/utils/customModules";
import { ALERT_MESSAGES, TOAST_SETTINGS } from "src/constants/alertMessages";
import { useNavigation } from "@react-navigation/core";
import { alertModal, cvtBadgeCount, formatGender } from "src/utils";
import { useRequestDeleteRoom } from "src/hooks/requests/useRequestRooms";

type Props = {
  talkingRoom: TalkingRoom;
};
export const TalkingRoomCard: React.FC<Props> = (props) => {
  const { talkingRoom } = props;

  const profileState = useProfileState();
  const navigation = useNavigation();

  const [isToggleUp, setIsToggleUp] = useState(true);
  const [isOpenRoomEditorModal, setIsOpenRoomEditorModal] = useState(false);

  const isCreatedRoom = profileState.profile.id === talkingRoom.owner.id;
  // 三点リーダは作成ルームのみ表示
  const isShow3PointReader = isCreatedRoom;
  // 一人でも参加者がいた場合、修正できない
  const canFix = talkingRoom.participants.length <= 0;

  const { requestDeleteRoom } = useRequestDeleteRoom(talkingRoom.id);

  const openTalkingRoomCardActionSheet = () => {
    const actionSheetSettings = [
      {
        label: "キャンセル",
        cancel: true,
      },
      {
        label: "修正する",
        onPress: () => {
          if (canFix) {
            setIsOpenRoomEditorModal(true);
          } else {
            Alert.alert(...ALERT_MESSAGES["CANNOT_FIX_TALKING_ROOM"]);
          }
        },
      },
      {
        label: "削除する",
        destructive: true,
        onPress: () => {
          if (talkingRoom.isStart) {
            Alert.alert(...ALERT_MESSAGES["CANNOT_DELETE_TALKING_ROOM"]);
          } else {
            const _mainText = "作成ルームを削除";
            const _subText = "本当にこのルームを削除してよろしいですか？";
            alertModal({
              mainText: _mainText,
              subText: _subText,
              cancelButton: "キャンセル",
              okButton: "削除する",
              okButtonStyle: "destructive",
              onPress: () => {
                requestDeleteRoom({
                  thenCallback: () => {
                    showToast(TOAST_SETTINGS["DELETE_ROOM"]);
                  },
                });
              },
            });
          }
        },
      },
    ];
    showActionSheet(actionSheetSettings);
  };

  const {
    // isMaxed,
    participantIconName,
    participantIconColor,
  } = useRoomParticipantsNum(talkingRoom);
  const formattedGender = formatGender(
    talkingRoom.owner.gender,
    talkingRoom.owner.isSecretGender
  );
  const TalkingRoomCardContent: React.FC = () => {
    return (
      <>
        <Block row space="between">
          <Block style={styles.title}>
            <Text size={16} color={COLORS.BLACK} bold ellipsizeMode="tail">
              {talkingRoom.name}
            </Text>
          </Block>
          {isShow3PointReader && (
            <TouchableOpacity
              style={styles.threeDotsIcon}
              onPress={() => {
                openTalkingRoomCardActionSheet();
              }}
            >
              <IconExtra
                name="dots-three-horizontal"
                family="Entypo"
                size={32}
                color={COLORS.BROWN}
              />
            </TouchableOpacity>
          )}
        </Block>
        <Block row>
          <Block>
            {talkingRoom.image ? (
              <Image source={{ uri: talkingRoom.image }} style={styles.image} />
            ) : (
              <Block style={styles.image}></Block>
            )}
          </Block>
          <Block flex column>
            <Block row>
              <Avatar
                size={32}
                image={talkingRoom.owner.image}
                style={styles.avatar}
              />
              <Block column style={styles.userInfo}>
                <Block style={styles.userName}>
                  <Text
                    size={14}
                    color={COLORS.LIGHT_GRAY}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {talkingRoom.owner.name}
                  </Text>
                </Block>
                <Block row>
                  <Block style={styles.userGender}>
                    <Text
                      size={14}
                      color={COLORS.LIGHT_GRAY}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {formattedGender.label}
                    </Text>
                  </Block>
                  <Block>
                    <Text
                      size={14}
                      color={COLORS.LIGHT_GRAY}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {talkingRoom.owner.job.label}
                    </Text>
                  </Block>
                </Block>
              </Block>
            </Block>
            <Block row>
              <Block flex row style={styles.member}>
                <Block>
                  <IconExtra
                    name={participantIconName}
                    family="Ionicons"
                    size={32}
                    color={participantIconColor}
                  />
                </Block>
                <Block style={styles.memberText}>
                  <Text size={14} color={COLORS.LIGHT_GRAY}>
                    {talkingRoom.participants.length}/
                    {talkingRoom.maxNumParticipants}
                  </Text>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
        <RoomEditorModal
          isOpenRoomEditorModal={isOpenRoomEditorModal}
          setIsOpenRoomEditorModal={setIsOpenRoomEditorModal}
          propsDependsOnMode={{
            mode: "FIX",
            talkingRoom: talkingRoom,
          }}
        />
      </>
    );
  };

  return (
    <Block style={styles.container}>
      <TouchableHighlight
        onPress={() => {
          navigation.navigate("Chat", {
            roomId: talkingRoom.id,
          });
        }}
        activeOpacity={0.7}
        underlayColor="#DDDDDD"
        style={styles.touchableHighlight}
      >
        <Block style={styles.card}>
          <Block style={styles.messageContainer}>
            <Text
              size={16}
              color={COLORS.BLACK}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {talkingRoom.messages.length > 0 &&
                talkingRoom.messages[talkingRoom.messages.length - 1].text}
            </Text>
          </Block>
          <Block>
            <TouchableOpacity
              style={styles.toggleIcon}
              onPress={() => {
                setIsToggleUp(!isToggleUp);
              }}
            >
              <IconExtra
                name={isToggleUp ? "upcircleo" : "circledowno"}
                family="AntDesign"
                size={32}
                color={COLORS.BROWN}
              />
            </TouchableOpacity>
          </Block>
          {talkingRoom.unreadNum > 0 && (
            <Block center style={styles.notification}>
              <Text bold size={15} color={COLORS.WHITE}>
                {cvtBadgeCount(talkingRoom.unreadNum)}
              </Text>
            </Block>
          )}
          {isToggleUp ? <TalkingRoomCardContent /> : null}
        </Block>
      </TouchableHighlight>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    borderRadius: 20,
  },
  touchableHighlight: {
    borderRadius: 20,
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: "relative",
    width: width - 40,
    height: "auto",
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.26,
    shadowRadius: 0,
    elevation: 1,
  },
  messageContainer: {
    marginRight: 32,
  },
  toggleIcon: {
    marginTop: 16,
    alignItems: "center",
  },
  notification: {
    position: "absolute",
    justifyContent: "center",
    right: 16,
    top: 16,
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: COLORS.RED,
  },
  title: {
    marginVertical: 16,
    width: width - 116,
  },
  threeDotsIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    marginLeft: 16,
  },
  userInfo: {
    marginLeft: 8,
  },
  userName: {
    marginBottom: 4,
  },
  userGender: {
    marginRight: 4,
  },
  position: {
    marginLeft: 16,
    marginTop: 16,
    alignItems: "center",
  },
  positionText: {
    marginLeft: 8,
  },
  member: {
    marginLeft: 16,
    marginTop: 16,
    alignItems: "center",
  },
  memberText: {
    marginLeft: 8,
  },
  eyeIcon: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 20,
  },
});

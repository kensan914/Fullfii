import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  TouchableHighlight,
  ViewStyle,
} from "react-native";
import { useNavigation } from "@react-navigation/core";

import { Icon } from "src/components/atoms/Icon";
import { COLORS } from "src/constants/colors";
import { Avatar } from "src/components/atoms/Avatar";
import { RoomEditorModal } from "src/components/organisms/RoomEditorModal";
import { width } from "src/constants";
import { TalkingRoom } from "src/types/Types.context";
import { useRoomParticipantsNum } from "src/screens/RoomsScreen/useRoomParticipantsNum";
import { useProfileState } from "src/contexts/ProfileContext";
import {
  alertModal,
  showActionSheet,
  showToast,
} from "src/utils/customModules";
import { ALERT_MESSAGES, TOAST_SETTINGS } from "src/constants/alertMessages";
import { cvtBadgeCount, formatGender } from "src/utils";
import { useRequestDeleteRoom } from "src/hooks/requests/useRequestRooms";
import { logEvent } from "src/utils/firebase/logEvent";

type Props = {
  talkingRoom: TalkingRoom;
  style?: ViewStyle;
};
export const TalkingRoomCard: React.FC<Props> = (props) => {
  const { talkingRoom, style } = props;

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
          logEvent("delete_created_room");
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

  const { participantIconName, participantIconColor } =
    useRoomParticipantsNum(talkingRoom);
  const formattedGender = formatGender(
    talkingRoom.owner.gender,
    talkingRoom.owner.isSecretGender
  );
  const TalkingRoomCardContent: React.FC = () => {
    return (
      <>
        <Block row space="between" style={styles.titleContainer}>
          <Block flex row style={styles.title}>
            <Text
              size={16}
              color={COLORS.BLACK}
              bold
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {talkingRoom.name}
            </Text>
          </Block>

          {talkingRoom.isPrivate && (
            <Block row style={styles.privateLabelContainer}>
              <Text
                size={13}
                bold
                color={COLORS.WHITE}
                style={styles.privateLabel}
              >
                プライベート
              </Text>
            </Block>
          )}

          {isShow3PointReader && (
            <TouchableOpacity
              style={styles.threeDotsIcon}
              onPress={() => {
                openTalkingRoomCardActionSheet();
              }}
            >
              <Icon
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
              <Block style={styles.image} />
            )}
          </Block>
          <Block flex style={styles.roomInfoContainer}>
            <Block row style={styles.ownerContainer}>
              <Avatar
                size={32}
                imageUri={talkingRoom.owner.image}
                style={styles.avatar}
              />
              <Block flex column style={styles.ownerInfo}>
                <Block flex style={styles.ownerName}>
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
                  <Block style={styles.ownerGender}>
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
            <Block flex row style={styles.statusContainer}>
              <Block row center style={styles.statusItem}>
                <Icon
                  name="message1"
                  family="AntDesign"
                  size={26}
                  color={
                    talkingRoom.isSpeaker ? COLORS.LIGHT_BLUE : COLORS.ORANGE
                  }
                />
                <Block style={styles.statusText}>
                  <Text
                    size={14}
                    color={
                      talkingRoom.isSpeaker ? COLORS.LIGHT_BLUE : COLORS.ORANGE
                    }
                  >
                    {talkingRoom.isSpeaker ? "話したい" : "聞きたい"}
                  </Text>
                </Block>
              </Block>
              <Block row center style={styles.statusItem}>
                <Block>
                  <Icon
                    name={participantIconName}
                    family="Ionicons"
                    size={32}
                    color={participantIconColor}
                  />
                </Block>
                <Block style={styles.statusText}>
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
    <Block style={[styles.container, style]}>
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
          <Block center>
            <TouchableOpacity
              style={styles.toggleIcon}
              onPress={() => {
                setIsToggleUp(!isToggleUp);
              }}
            >
              <Icon
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
    width: 40,
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
  titleContainer: {
    marginVertical: 16,
  },
  title: {
    alignItems: "center",
  },
  privateLabelContainer: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.GREEN,
    padding: 8,
    height: "80%",
    alignSelf: "center",
  },
  privateLabel: {
    textAlign: "center",
    alignSelf: "center",
  },
  threeDotsIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  roomInfoContainer: {
    paddingLeft: 16,
  },
  ownerContainer: {},
  avatar: {},
  ownerInfo: {
    marginLeft: 8,
  },
  ownerName: {
    marginBottom: 4,
  },
  ownerGender: {
    marginRight: 4,
  },
  statusContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  statusText: {
    marginLeft: 8,
  },
  statusItem: {
    marginRight: 8,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 20,
  },
});

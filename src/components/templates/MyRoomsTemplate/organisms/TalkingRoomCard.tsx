import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ActionSheetIOS,
} from "react-native";

import IconExtra from "src/components/atoms/Icon";
import { COLORS } from "src/constants/theme";
import Avatar from "src/components/atoms/Avatar";
import RoomEditorModal from "src/components/organisms/RoomEditorModal";
import { width } from "src/constants";
import { TalkingRoom } from "src/types/Types.context";
import { useRoomParticipantsNum } from "src/screens/RoomsScreen/useRoomParticipantsNum";

type Props = {
  talkingRoom: TalkingRoom;
};
export const TalkingRoomCard: React.FC<Props> = (props) => {
  const { talkingRoom } = props;

  const [isToggleUp, setIsToggleUp] = useState(true);
  const [isOpenRoomEditorModal, setIsOpenRoomEditorModal] = useState(false);

  const openTalkingRoomCardActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["キャンセル", "修正する", "削除する"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: "light",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          //card修正する
          setIsOpenRoomEditorModal(true);
        } else if (buttonIndex === 2) {
          //削除する処理
        }
      }
    );
  };

  const {
    // isMaxed,
    participantIconName,
    participantIconColor,
  } = useRoomParticipantsNum(talkingRoom);
  const TalkingRoomCardContent: React.FC = () => {
    return (
      <>
        <Block row space="between">
          <Block style={styles.title}>
            <Text size={16} color={COLORS.BLACK} bold ellipsizeMode="tail">
              {talkingRoom.name}
            </Text>
          </Block>
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
                      {talkingRoom.owner.gender.label}
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
        />
      </>
    );
  };

  return (
    <Block style={styles.container}>
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
              {talkingRoom.unreadNum >= 100 ? 99 : talkingRoom.unreadNum}
            </Text>
          </Block>
        )}
        {isToggleUp ? <TalkingRoomCardContent /> : null}
      </Block>
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

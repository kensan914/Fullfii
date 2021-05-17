import React, { Dispatch } from "react";
import { Block, NavBar, theme, Text, Button } from "galio-framework";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ActionSheetIOS,
  Alert,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import Modal from "react-native-modal";
import IconExtra from "src/components/atoms/Icon";

import { COLORS } from "src/constants/theme";
import Avatar from "src/components/atoms/Avatar";
import { width } from "src/constants";
import { Room } from "src/types/Types.context";

type Props = {
  room: Room;
  isMaxed: boolean;
  participantIconName: string;
  participantIconColor: string;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  hiddenRoomIds: string[];
  setHiddenRoomIds: Dispatch<string[]>;
};
export const RoomDetailModal: React.FC<Props> = (props) => {
  const {
    room,
    isMaxed,
    participantIconName,
    participantIconColor,
    isOpen,
    setIsOpen,
    hiddenRoomIds,
    setHiddenRoomIds,
  } = props;

  const openRoomDetailActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["キャンセル", "非表示", "ブロック"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: "light",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          setIsOpen(false);
          setHiddenRoomIds([...hiddenRoomIds, room.id]);
          //card非表示
        } else if (buttonIndex === 2) {
          //ブロック処理
        }
      }
    );
  };

  const goNext = () => {
    Alert.alert("チャット画面に遷移");
  };

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={() => {
        setIsOpen(false);
      }}
      backdropColor={COLORS.BLACK}
      backdropOpacity={0.7}
    >
      <Block column style={styles.modal}>
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => {
            setIsOpen(false);
          }}
        >
          <IconExtra
            name="close"
            family="Ionicons"
            size={32}
            color={COLORS.HIGHLIGHT_GRAY}
          />
        </TouchableOpacity>
        <Block style={styles.modalTitle}>
          <Text
            size={16}
            color={COLORS.BLACK}
            bold
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {room.name}
          </Text>
        </Block>
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={() => {
            openRoomDetailActionSheet();
          }}
        >
          <IconExtra
            name="dots-three-horizontal"
            family="Entypo"
            size={32}
            color={COLORS.BROWN}
          />
        </TouchableOpacity>
        <Block row>
          {room.image ? (
            <Image source={{ uri: room.image }} style={styles.modalImage} />
          ) : (
            <Block style={styles.modalImage}></Block>
          )}
          <Block flex column>
            <Block row>
              <Avatar
                size={32}
                image={room.owner.image}
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
                    {room.owner.name}
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
                      {room.owner.gender.label}
                    </Text>
                  </Block>
                  <Block>
                    <Text
                      size={14}
                      color={COLORS.LIGHT_GRAY}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {room.owner.job.label}
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
                    {room.participants.length}/{room.maxNumParticipants}
                  </Text>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
        <Block center>
          <Button
            style={styles.modalButton}
            color={COLORS.BROWN}
            shadowless
            onPress={() => goNext()}
          >
            <Text size={20} color={COLORS.WHITE} bold>
              聞いてみる！
            </Text>
          </Button>
        </Block>
      </Block>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: width - 40,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: "relative",
  },
  closeIcon: {
    marginBottom: 32,
    width: 32,
  },
  modalTitle: {
    marginBottom: 16,
  },
  touchableOpacity: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: COLORS.WHITE,
  },
  modalImage: {
    width: 88,
    height: 88,
    borderRadius: 15,
    marginBottom: 32,
  },
  modalButton: {
    marginBottom: 16,
    width: 303,
    height: 48,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
  },
  touchableHighlight: {
    borderRadius: 20,
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
});

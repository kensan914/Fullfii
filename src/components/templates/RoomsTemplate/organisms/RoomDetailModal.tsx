import React, { Dispatch } from "react";
import { Block, Text, Button } from "galio-framework";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import Modal from "react-native-modal";
import ActionSheet from "react-native-action-sheet";
import { useNavigation } from "@react-navigation/core";

import { SvgUri } from "src/components/atoms/SvgUri";
import { Icon } from "src/components/atoms/Icon";
import { COLORS } from "src/constants/colors";
import { Avatar } from "src/components/atoms/Avatar";
import { width } from "src/constants";
import { Room } from "src/types/Types.context";
import { BlockRoom, HideRoom } from "src/types/Types";
import { useRequestPostRoomParticipant } from "src/hooks/requests/useRequestRoomMembers";
import { useCanParticipateRoom } from "src/screens/RoomsScreen/useCanAction";
import { enterRoomSvg } from "src/constants/svgSources";

type Props = {
  room: Room;
  isMaxed: boolean;
  participantIconName: string;
  participantIconColor: string;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  hiddenRoomIds: string[];
  hideRoom: HideRoom;
  blockRoom: BlockRoom;
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
    hideRoom,
    blockRoom,
  } = props;

  const navigation = useNavigation();

  const openRoomDetailActionSheet = () => {
    ActionSheet.showActionSheetWithOptions(
      {
        options: ["キャンセル", "非表示", "ブロック"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          //card非表示
          setIsOpen(false);
          hideRoom(room.id);
        } else if (buttonIndex === 2) {
          //ブロック処理
          setIsOpen(false);
          blockRoom(room.id);
        }
      }
    );
  };

  const { requestPostRoomParticipants, isLoadingPostRoomParticipants } =
    useRequestPostRoomParticipant(room.id, (_roomJson) => {
      setIsOpen(false);
      navigation.navigate("Chat", {
        roomId: _roomJson.id,
      });
    });

  const { checkCanParticipateRoom } = useCanParticipateRoom();

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
          <Icon
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
          <Icon
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
                imageUri={room.owner.image}
                style={styles.avatar}
              />
              <Block flex column style={styles.userInfo}>
                <Block flex style={styles.userName}>
                  <Text
                    size={14}
                    color={COLORS.LIGHT_GRAY}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {room.owner.name}
                  </Text>
                </Block>
                <Block flex row>
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
              <Block flex row style={styles.statusAndMember}>
                <Block row center style={styles.statusContainer}>
                  <Icon
                    name="message1"
                    family="AntDesign"
                    size={26}
                    color={room.isSpeaker ? COLORS.LIGHT_BLUE : COLORS.ORANGE}
                  />
                  <Block style={styles.memberText}>
                    <Text
                      size={14}
                      color={room.isSpeaker ? COLORS.LIGHT_BLUE : COLORS.ORANGE}
                    >
                      {room.isSpeaker ? "話したい" : "聞きたい"}
                    </Text>
                  </Block>
                </Block>
                <Block row center>
                  <Block>
                    <Icon
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
        </Block>
        <Block center>
          <Button
            style={styles.modalButton}
            color={COLORS.BROWN}
            shadowless
            loading={isLoadingPostRoomParticipants}
            onPress={() => {
              if (checkCanParticipateRoom()) {
                requestPostRoomParticipants();
              }
            }}
          >
            <Block center row>
              <Block style={[styles.svgContainer]}>
                <SvgUri
                  width={40}
                  height={40}
                  source={enterRoomSvg}
                  fill={"#fff"}
                />
              </Block>
              <Block style={styles.buttonText}>
                <Text size={20} color={COLORS.WHITE} bold>
                  {room.isSpeaker ? "悩みを聞く" : "悩みを話す"}
                </Text>
              </Block>
            </Block>
          </Button>
          <Text size={12} color={COLORS.GRAY}>相手に通知は届きません</Text>
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
    marginBottom: 24,
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
  buttonIcon: {
    paddingRight: 4,
  },
  buttonText: {
    paddingLeft: 4,
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
  statusAndMember: {
    marginLeft: 16,
    marginTop: 16,
    alignItems: "center",
  },
  statusContainer: {
    marginRight: 8,
  },
  memberText: {
    marginLeft: 4,
  },
  svgContainer: {
    zIndex: 100,
  },
});

import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Image,
} from "react-native";

import IconExtra from "src/components/atoms/Icon";
import { COLORS } from "src/constants/theme";
import Avatar from "src/components/atoms/Avatar";
import { RoomDetailModal } from "src/components/templates/RoomsTemplate/organisms/RoomDetailModal";
import { width } from "src/constants";
import { Room } from "src/types/Types.context";
import { BlockRoom, HideRoom } from "src/types/Types";
import { useRoomParticipantsNum } from "src/screens/RoomsScreen/useRoomParticipantsNum";

type Props = {
  room: Room;
  hiddenRoomIds: string[];
  hideRoom: HideRoom;
  blockRoom: BlockRoom;
};
export const RoomCard: React.FC<Props> = (props) => {
  const { room, hiddenRoomIds, hideRoom, blockRoom } = props;

  const [isOpen, setIsOpen] = useState(false);

  const {
    isMaxed,
    participantIconName,
    participantIconColor,
  } = useRoomParticipantsNum(room);
  return (
    <>
      <Block style={styles.container}>
        <TouchableHighlight
          activeOpacity={0.7}
          underlayColor="#DDDDDD"
          onPress={() => {
            setIsOpen(true);
          }}
          style={styles.touchableHighlight}
        >
          <Block style={styles.card}>
            <Block style={styles.title}>
              <Text
                size={16}
                color={COLORS.BLACK}
                bold
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {room.name}
              </Text>
            </Block>
            <Block flex row>
              <Block />
              {room.image ? (
                <Image source={{ uri: room.image }} style={styles.image} />
              ) : (
                <Block style={styles.image}></Block>
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
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => {
                hideRoom(room.id);
              }}
            >
              <IconExtra
                name="eye-off"
                family="Feather"
                size={32}
                color={COLORS.BROWN}
              />
            </TouchableOpacity>
          </Block>
        </TouchableHighlight>
      </Block>
      <RoomDetailModal
        room={room}
        isMaxed={isMaxed}
        participantIconName={participantIconName}
        participantIconColor={participantIconColor}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        hiddenRoomIds={hiddenRoomIds}
        hideRoom={hideRoom}
        blockRoom={blockRoom}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    height: "auto",
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: "relative",
    width: width - 40,
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
  touchableHighlight: {
    borderRadius: 20,
  },
  title: {
    marginBottom: 16,
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

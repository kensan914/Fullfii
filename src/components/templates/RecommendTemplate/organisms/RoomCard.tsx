import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import {
  StyleSheet,
  TouchableHighlight,
  Image,
  ViewStyle,
  Platform,
  StyleProp,
} from "react-native";

import { Icon } from "src/components/atoms/Icon";
import { COLORS } from "src/constants/colors";
import { Avatar } from "src/components/atoms/Avatar";
import { RoomDetailModal } from "src/components/templates/RecommendTemplate/organisms/RoomDetailModal";
import { width } from "src/constants";
import { Room } from "src/types/Types.context";
import { BlockRoom, HideRoom } from "src/types/Types";
import { useRoomParticipantsNum } from "src/screens/RecommendScreen/useRoomParticipantsNum";
import { formatGender } from "src/utils";

type Props = {
  room: Room;
  hiddenRoomIds: string[];
  hideRoom: HideRoom;
  blockRoom: BlockRoom;
  style?: StyleProp<ViewStyle>;
};
export const RoomCard: React.FC<Props> = (props) => {
  const { room, hiddenRoomIds, hideRoom, blockRoom, style } = props;

  const [isOpen, setIsOpen] = useState(false);

  const { isMaxed, participantIconName, participantIconColor } =
    useRoomParticipantsNum(room);
  const formattedGender = formatGender(
    room.owner.gender,
    room.owner.isSecretGender
  );

  return (
    <>
      <Block style={[styles.container, style]}>
        <TouchableHighlight
          activeOpacity={0.7}
          underlayColor={Platform.OS === "ios" ? "#DDDDDD" : COLORS.WHITE}
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
            <Block row>
              <Block>
                {room.image ? (
                  <Image source={{ uri: room.image }} style={styles.image} />
                ) : (
                  <Block style={styles.image} />
                )}
              </Block>
              <Block flex style={styles.roomInfoContainer}>
                <Block row style={styles.ownerContainer}>
                  <Avatar
                    size={32}
                    imageUri={room.owner.image}
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
                        {room.owner.name}
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
                          {room.owner.job.label}
                        </Text>
                      </Block>
                    </Block>
                  </Block>
                </Block>
                <Block row center style={styles.statusContainer}>
                  <Block flex row>
                    <Block row center style={styles.statusItem}>
                      <Icon
                        name="message1"
                        family="AntDesign"
                        size={24}
                        color={
                          room.isSpeaker ? COLORS.LIGHT_BLUE : COLORS.ORANGE
                        }
                      />
                      <Block style={styles.statusText}>
                        <Text
                          size={14}
                          color={
                            room.isSpeaker ? COLORS.LIGHT_BLUE : COLORS.ORANGE
                          }
                        >
                          {room.isSpeaker ? "話したい" : "聞きたい"}
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
                          {room.participants.length}/{room.maxNumParticipants}
                        </Text>
                      </Block>
                    </Block>
                  </Block>
                </Block>
              </Block>
            </Block>
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

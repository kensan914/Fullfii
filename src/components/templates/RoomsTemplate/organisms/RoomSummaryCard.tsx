import React, { useMemo, useState } from "react";
import { Block, Text } from "galio-framework";
import {
  StyleSheet,
  TouchableHighlight,
  Platform,
  ViewStyle,
  StyleProp,
  View,
} from "react-native";

import { COLORS } from "src/constants/colors";
import { Avatar } from "src/components/atoms/Avatar";
import { Icon } from "src/components/atoms/Icon";
import { Room } from "src/types/Types.context";
import { formatGender } from "src/utils";
import { RoomDetailModal } from "src/components/templates/RecommendTemplate/organisms/RoomDetailModal";
import { useRoomParticipantsNum } from "src/screens/RecommendScreen/useRoomParticipantsNum";

type Props = {
  room: Room;
  style?: StyleProp<ViewStyle>;
};
export const RoomSummaryCard: React.FC<Props> = (props) => {
  const { room, style } = props;

  const [ownerInfoWidth, setOwnerInfoWidth] = useState<number | undefined>();
  const [isOpenDetailModal, setIsOpenDetailModal] = useState(false);
  const { isMaxed, participantIconName, participantIconColor } =
    useRoomParticipantsNum(room);

  const formattedGender = useMemo(
    () => formatGender(room.owner.gender, room.owner.isSecretGender),
    [room]
  );

  return (
    <>
      <TouchableHighlight
        activeOpacity={0.7}
        underlayColor={Platform.OS === "ios" ? "#DDDDDD" : COLORS.WHITE}
        onPress={() => {
          setIsOpenDetailModal(true);
        }}
        style={[styles.touchableHighlight, style]}
      >
        <Block style={styles.card}>
          <Block style={styles.title}>
            <Text
              size={16}
              color={COLORS.BLACK}
              bold
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {room.name}
            </Text>
          </Block>
          <Block row>
            <Block flex style={styles.roomInfoContainer}>
              <Block row style={styles.ownerContainer}>
                <Avatar
                  size={32}
                  imageUri={room.owner.image}
                  style={styles.avatar}
                />
                <Block
                  style={[
                    styles.ownerInfo,
                    typeof ownerInfoWidth !== "undefined"
                      ? { width: ownerInfoWidth }
                      : {},
                  ]}
                >
                  <Block style={styles.ownerName}>
                    <Text
                      size={14}
                      color={COLORS.LIGHT_GRAY}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {room.owner.name}
                    </Text>
                  </Block>
                  <Block
                    style={{
                      // 子要素の{ width: "auto" }を効かせるため
                      // https://stackoverflow.com/questions/38233789/react-native-view-auto-width-by-text-inside
                      alignSelf: "flex-start",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        width: "auto",
                      }}
                      onLayout={(e) => {
                        setOwnerInfoWidth(e.nativeEvent.layout.width);
                      }}
                    >
                      <Block style={[styles.ownerGender]}>
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
                    </View>
                  </Block>
                </Block>
                <Block>
                  <Block row style={[styles.statusItem]}>
                    <Icon
                      name="message1"
                      family="AntDesign"
                      size={20}
                      style={{
                        // isSpeaker iconと合わせる
                        marginLeft: 3,
                        marginBottom: 3,
                      }}
                      color={room.isSpeaker ? COLORS.LIGHT_BLUE : COLORS.ORANGE}
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
                  <Block row style={[styles.statusItem]}>
                    <Icon
                      name={participantIconName}
                      family="Ionicons"
                      size={24}
                      color={participantIconColor}
                    />
                    <Block
                      style={[
                        styles.statusText,
                        {
                          justifyContent: "center",
                        },
                      ]}
                    >
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
      <RoomDetailModal
        room={room}
        isMaxed={isMaxed}
        participantIconName={participantIconName}
        participantIconColor={participantIconColor}
        isOpen={isOpenDetailModal}
        setIsOpen={setIsOpenDetailModal}
      />
    </>
  );
};

export const ROOM_SUMMARY_CARD_WIDTH = 272;
export const ROOM_SUMMARY_CARD_HEIGHT = 112;
const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: "relative",
    minWidth: ROOM_SUMMARY_CARD_WIDTH,
    height: ROOM_SUMMARY_CARD_HEIGHT,
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
    maxWidth: ROOM_SUMMARY_CARD_WIDTH,
    marginBottom: 16,
  },
  roomInfoContainer: {},
  ownerContainer: {},
  avatar: {},
  ownerInfo: {
    marginLeft: 8,
    marginRight: 16,
  },
  ownerName: {
    width: "100%",
    marginBottom: 6,
  },
  ownerGender: {
    marginRight: 4,
  },
  statusText: {
    marginLeft: 8,
  },
  statusItem: {
    // marginRight: 8,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 20,
  },
});

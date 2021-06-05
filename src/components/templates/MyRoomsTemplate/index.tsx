import React, { Dispatch } from "react";
import { Block, Button, Text } from "galio-framework";
import { StyleSheet, ScrollView } from "react-native";

import { COLORS } from "src/constants/theme";
import RoomEditorModal from "src/components/organisms/RoomEditorModal";
import { TalkingRoomCard } from "src/components/templates/MyRoomsTemplate/organisms/TalkingRoomCard";
import { width } from "src/constants";
import { TalkingRoom } from "src/types/Types.context";
import { RoomCreatedModal } from "src/components/templates/RoomsTemplate/organisms/RoomCreatedModal";
import { NotificationReminderModal } from "src/components/organisms/NotificationReminderModal";
import IconExtra from "src/components/atoms/Icon";

type Props = {
  participatingRooms: TalkingRoom[];
  createdRooms: TalkingRoom[];
  isOpenRoomEditorModal: boolean;
  setIsOpenRoomEditorModal: Dispatch<boolean>;
  isOpenRoomCreatedModal: boolean;
  setIsOpenRoomCreatedModal: Dispatch<boolean>;
  isOpenNotificationReminderModal: boolean;
  setIsOpenNotificationReminderModal: Dispatch<boolean>;
  checkCanCreateRoom: () => boolean;
};
export const MyRoomsTemplate: React.FC<Props> = (props) => {
  const {
    participatingRooms,
    createdRooms,
    isOpenRoomEditorModal,
    setIsOpenRoomEditorModal,
    isOpenRoomCreatedModal,
    setIsOpenRoomCreatedModal,
    isOpenNotificationReminderModal,
    setIsOpenNotificationReminderModal,
    checkCanCreateRoom,
  } = props;

  const maxParticipatingRoomsLength = 1; // 参加ルームの最大数 (ver3.0.0現在)
  const maxCreatedRoomsLength = 1; // 作成ルームの最大数 (ver3.0.0現在)
  // const isExistTalkingRooms = !(
  //   createdRooms.length <= 0 && participatingRooms.length <= 0
  // );
  return (
    <>
      <Block flex center style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          <>
            <Block top style={styles.joinRoomContainer}>
              <Block style={styles.cardSubTitle}>
                <Text size={12} color={COLORS.LIGHT_GRAY}>
                  参加ルーム{" "}
                  <Text
                    bold
                    color={
                      participatingRooms.length >= maxParticipatingRoomsLength
                        ? COLORS.GREEN
                        : COLORS.LIGHT_GRAY
                    }
                  >
                    {participatingRooms.length}/{maxParticipatingRoomsLength}
                  </Text>
                </Text>
              </Block>
              {participatingRooms.length > 0 ? (
                participatingRooms.map((participatingRoom) => {
                  return (
                    <TalkingRoomCard
                      key={participatingRoom.id}
                      talkingRoom={participatingRoom}
                    />
                  );
                })
              ) : (
                <Block style={{ width: width }}>
                  {/* ルームに一つも属していない場合に表示 */}
                  <Block center style={styles.emptyStateTitle}>
                    <Text size={16} bold color={COLORS.BLACK}>
                      まだ参加しているルームがありません
                    </Text>
                  </Block>
                  <Block center style={styles.emptyStateSubTitle}>
                    <Text size={14} color={COLORS.BLACK}>
                      新しいルームを探しにいきませんか？
                    </Text>
                  </Block>
                </Block>
              )}
            </Block>
            <Block top style={styles.makeRoomContainer}>
              <Block style={styles.cardSubTitle}>
                <Text size={12} color={COLORS.LIGHT_GRAY}>
                  作成ルーム{" "}
                  <Text
                    bold
                    color={
                      createdRooms.length >= maxCreatedRoomsLength
                        ? COLORS.GREEN
                        : COLORS.LIGHT_GRAY
                    }
                  >
                    {createdRooms.length}/{maxCreatedRoomsLength}
                  </Text>
                </Text>
              </Block>
              {createdRooms.map((createdRoom) => {
                return (
                  <TalkingRoomCard
                    key={createdRoom.id}
                    talkingRoom={createdRoom}
                  />
                );
              })}
            </Block>
          </>
          {createdRooms.length <= 0 && (
            <Block style={styles.buttonContainer}>
              <Button
                style={styles.button}
                color="#F69896"
                shadowless
                onPress={() => {
                  if (checkCanCreateRoom()) {
                    setIsOpenRoomEditorModal(true);
                  }
                }}
              >
                <Block row center>
                  <IconExtra
                    name="pluscircleo"
                    family="AntDesign"
                    size={32}
                    color={COLORS.WHITE}
                    style={styles.buttonIcon}
                  />
                  <Block style={styles.buttonText}>
                    <Text size={20} color={COLORS.WHITE} bold>
                      悩みを話す
                    </Text>
                  </Block>
                </Block>
              </Button>
            </Block>
          )}
        </ScrollView>
      </Block>
      <RoomEditorModal
        isOpenRoomEditorModal={isOpenRoomEditorModal}
        setIsOpenRoomEditorModal={setIsOpenRoomEditorModal}
        propsDependsOnMode={{
          mode: "CREATE_FROM_MY_ROOMS",
          setIsOpenRoomCreatedModal: setIsOpenRoomCreatedModal,
        }}
      />
      <RoomCreatedModal
        isOpenRoomCreatedModal={isOpenRoomCreatedModal}
        setIsOpenRoomCreatedModal={setIsOpenRoomCreatedModal}
        setIsOpenNotificationReminderModal={setIsOpenNotificationReminderModal}
      />
      <NotificationReminderModal
        isOpenNotificationReminderModal={isOpenNotificationReminderModal}
        setIsOpenNotificationReminderModal={setIsOpenNotificationReminderModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,
    width: width,
    position: "relative",
  },
  emptyStateTitle: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyStateSubTitle: {
    marginTop: 16,
  },
  joinRoomContainer: {
    marginTop: 16,
  },
  makeRoomContainer: {
    marginTop: 32,
  },
  cardSubTitle: {
    paddingLeft: 20,
  },
  list: {
    width: width,
    zIndex: 1,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    width: 335,
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
});

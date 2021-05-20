import React, { Dispatch } from "react";
import { Block, Button, Text } from "galio-framework";
import { StyleSheet, ScrollView } from "react-native";

import { COLORS } from "src/constants/theme";
import RoomEditorModal from "src/components/organisms/RoomEditorModal";
import { TalkingRoomCard } from "src/components/templates/MyRoomsTemplate/organisms/TalkingRoomCard";
import { width } from "src/constants";
import { TalkingRoom } from "src/types/Types.context";
import { RoomCreatedModal } from "../RoomsTemplate/organisms/RoomCreatedModal";

type Props = {
  participatingRooms: TalkingRoom[];
  createdRooms: TalkingRoom[];
  isOpenRoomEditorModal: boolean;
  setIsOpenRoomEditorModal: Dispatch<boolean>;
  isOpenRoomCreatedModal: boolean;
  setIsOpenRoomCreatedModal: Dispatch<boolean>;
};
export const MyRoomsTemplate: React.FC<Props> = (props) => {
  const {
    participatingRooms,
    createdRooms,
    isOpenRoomEditorModal,
    setIsOpenRoomEditorModal,
    isOpenRoomCreatedModal,
    setIsOpenRoomCreatedModal,
  } = props;

  const maxParticipatingRoomsLength = 1; // 参加ルームの最大数 (ver3.0.0現在)
  const maxCreatedRoomsLength = 1; // 作成ルームの最大数 (ver3.0.0現在)
  const isExistTalkingRooms = !(
    createdRooms.length <= 0 && participatingRooms.length <= 0
  );
  return (
    <>
      <Block flex center style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          {isExistTalkingRooms ? (
            <>
              <Block top style={styles.joinRoomContainer}>
                <Block style={styles.cardSubTitle}>
                  <Text size={12} color={COLORS.LIGHT_GRAY}>
                    参加ルーム{participatingRooms.length}/
                    {maxParticipatingRoomsLength}
                  </Text>
                </Block>
                {participatingRooms.map((participatingRoom) => {
                  return (
                    <TalkingRoomCard
                      key={participatingRoom.id}
                      talkingRoom={participatingRoom}
                    />
                  );
                })}
              </Block>
              <Block top style={styles.makeRoomContainer}>
                <Block style={styles.cardSubTitle}>
                  <Text size={12} color={COLORS.LIGHT_GRAY}>
                    作成ルーム{createdRooms.length}/{maxCreatedRoomsLength}
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
          ) : (
            <>
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
            </>
          )}
          <Block style={styles.buttonContainer}>
            <Button
              style={styles.button}
              color={COLORS.BROWN}
              shadowless
              onPress={() => {
                setIsOpenRoomEditorModal(true);
              }}
            >
              <Text size={20} color={COLORS.WHITE} bold>
                悩みを話す
              </Text>
            </Button>
          </Block>
        </ScrollView>
      </Block>
      <RoomEditorModal
        isOpenRoomEditorModal={isOpenRoomEditorModal}
        setIsOpenRoomEditorModal={setIsOpenRoomEditorModal}
        isCreateNew
        setIsOpenRoomCreatedModal={setIsOpenRoomCreatedModal}
      />
      <RoomCreatedModal
        isOpenRoomCreatedModal={isOpenRoomCreatedModal}
        setIsOpenRoomCreatedModal={setIsOpenRoomCreatedModal}
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
});

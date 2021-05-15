import React from "react";
import { Block, Button, Text } from "galio-framework";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView
} from "react-native";

import { COLORS } from "src/constants/theme";
import RoomEditorModal from "src/components/organisms/RoomEditorModal"
import JoinedRoomCard from "src/components/organisms/JoinedRoomCard"
const { width } = Dimensions.get("screen");

export const MyRoomsTemplate: React.FC = (props) => {
  const numColumns = 1;
  const {
    item,
    isOpenRoomEditorModal,
    setIsOpenRoomEditorModal,
  } = props;

  const isHavingRoom = false

  return (
    <>
      <Block flex center style={styles.container}>
        <ScrollView>
          {isHavingRoom ?
            <>
            {/* ルームに一つも属していない場合に表示 */}
              <Block center style={styles.emptyStateTitle}>
                <Text size={16} bold color={COLORS.BLACK}>まだ参加しているルームがありません</Text>
              </Block>
              <Block center style={styles.emptyStateSubTitle}>
                <Text size={14} color={COLORS.BLACK}>新しいルームを探しにいきませんか？</Text>
              </Block>
            </>
          : null}
          <Block top style={styles.joinRoomContainer}>
            <Block style={styles.cardSubTitle}>
              <Text size={12} color={COLORS.LIGHT_GRAY}>参加ルーム0/1</Text>
            </Block>
            <JoinedRoomCard
              item={item}
            />
          </Block>
          <Block top style={styles.makeRoomContainer}>
            <Block style={styles.cardSubTitle}>
              <Text size={12} color={COLORS.LIGHT_GRAY}>作成ルーム0/1</Text>
            </Block>
            <JoinedRoomCard
              item={item}
            />
          </Block>
          <Block style={styles.buttonContainer} >
            <Button
              style={styles.button}
              color={COLORS.BROWN}
              shadowless
              onPress={()=>{setIsOpenRoomEditorModal(true)}}
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
    marginTop: 40
  },
  emptyStateSubTitle: {
    marginTop: 16
  },
  joinRoomContainer: {
    marginTop: 16
  },
  makeRoomContainer: {
    marginTop: 32
  },
  cardSubTitle: {
    paddingLeft: 20
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
})

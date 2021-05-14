import React from "react";
import { Block, Button, Text } from "galio-framework";
import {
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";

import { COLORS } from "src/constants/theme";
import RoomCard from "src/components/molecules/RoomCard"
import RoomEditorModal from "src/components/organisms/RoomEditorModal"

const { width } = Dimensions.get("screen");
export const RoomsTemplate: React.FC = (props) => {
  const numColumns = 1;
  const { items, hiddenRooms, setHiddenRooms, isOpenRoomEditorModal, setIsOpenRoomEditorModal } = props;

  return (
    <>
    <Block flex style={styles.container}>
      {
      items.length === hiddenRooms.length ?
      <Block center style={styles.restoreContainer}>
        <Block style={styles.restoreTitle}>
          <Text size={15} color={COLORS.BLACK} >全てのルームが非表示になっています</Text>
        </Block>
        <Button
          style={styles.button}
          color={COLORS.BROWN}
          shadowless
        >
          <Text size={20} color={COLORS.WHITE} bold>元に戻す</Text>
        </Button>
      </Block>
      :
        <FlatList
          data={items}
          renderItem={({ item, index }) => {
            if (hiddenRooms.includes(item.key)) {
              return <></>
            } else {
              return (
              <RoomCard
                item={item}
                hiddenRooms={hiddenRooms}
                setHiddenRooms={setHiddenRooms}
              />
            )
            }
          }}
          style={styles.list}
          numColumns={numColumns}
          keyExtractor={(item, index) => index.toString()}
        />
      }
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
    <Block style={styles.footer}>{/* 仮置き */}
      </Block>
    </Block>
    <RoomEditorModal
      isOpenRoomEditorModal={isOpenRoomEditorModal}
      setIsOpenRoomEditorModal={setIsOpenRoomEditorModal}
      isCreateNew
      />
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,
    width: width,
    alignItems: "center",
    position: "relative"
  },
  restoreContainer: {
    marginTop: 40,
    marginHorizontal: 16
  },
  restoreTitle: {
    marginBottom: 16
  },
  list: {
    width: width,
    zIndex: 1,
  },
  bottomContent: {
    alignItems: "center",
  },
  counter: {
    backgroundColor: COLORS.ALERT,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  buttonContainer: {
    width: width,
    height: 64,
    backgroundColor: COLORS.BEIGE_RGBA,
    alignItems: "center",
    marginBottom: 64,
    position: "absolute",
    bottom: 0,
    zIndex: 2
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
  footer: {
    width: width,
    height: 64,
  }
});

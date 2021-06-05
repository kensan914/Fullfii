import React, { Dispatch } from "react";
import { Block, Text } from "galio-framework";
import { StyleSheet, FlatList, ActivityIndicator } from "react-native";

import { COLORS } from "src/constants/theme";
import { RoomCard } from "src/components/templates/RoomsTemplate/organisms/RoomCard";
import RoomEditorModal from "src/components/organisms/RoomEditorModal";
import { width } from "src/constants";
import { Room } from "src/types/Types.context";
import { LinearGradient } from "expo-linear-gradient";
import { BlockRoom, HideRoom } from "src/types/Types";
import { AdView } from "src/components/molecules/AdView";
import { ADMOB_UNIT_ID_NATIVE } from "src/constants/env";
import { RoundButton } from "src/components/atoms/RoundButton";

type Props = {
  rooms: Room[];
  hiddenRoomIds: string[];
  hideRoom: HideRoom;
  isOpenRoomEditorModal: boolean;
  setIsOpenRoomEditorModal: Dispatch<boolean>;
  onEndReached: () => void;
  handleRefresh: () => void;
  isRefreshing: boolean;
  hasMore: boolean;
  isLoadingGetRooms: boolean;
  resetHiddenRooms: () => void;
  blockRoom: BlockRoom;
  checkCanCreateRoom: () => boolean;
};
export const RoomsTemplate: React.FC<Props> = (props) => {
  const numColumns = 1;
  const {
    rooms,
    hiddenRoomIds,
    hideRoom,
    isOpenRoomEditorModal,
    setIsOpenRoomEditorModal,
    onEndReached,
    handleRefresh,
    isRefreshing,
    hasMore,
    isLoadingGetRooms,
    resetHiddenRooms,
    blockRoom,
    checkCanCreateRoom,
  } = props;

  const isHiddenAll =
    rooms.length === hiddenRoomIds.length && !hasMore && rooms.length > 0;
  return (
    <>
      <Block flex style={styles.container}>
        {isHiddenAll ? (
          <Block center style={styles.restoreContainer}>
            <Block style={styles.restoreTitle}>
              <Text size={15} color={COLORS.BLACK}>
                全てのルームが非表示になっています
              </Text>
            </Block>
            <RoundButton label="元に戻す" onPress={resetHiddenRooms} />
          </Block>
        ) : (
          <FlatList
            data={rooms}
            renderItem={({ item, index }) => {
              if (hiddenRoomIds.includes(item.id)) {
                return <></>;
              } else {
                return (
                  <>
                    <RoomCard
                      room={item}
                      hiddenRoomIds={hiddenRoomIds}
                      hideRoom={hideRoom}
                      blockRoom={blockRoom}
                    />
                    {index > 0 && (index + 1) % 3 === 0 && (
                      <AdView
                        media={false}
                        type="video"
                        index={2}
                        adUnitId={ADMOB_UNIT_ID_NATIVE.image}
                      />
                    )}
                  </>
                );
              }
            }}
            style={styles.list}
            numColumns={numColumns}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={onEndReached}
            onEndReachedThreshold={0}
            ListFooterComponent={() =>
              hasMore && !isRefreshing ? (
                <ActivityIndicator
                  size="large"
                  style={{ marginVertical: 16 }}
                />
              ) : (
                <></>
              )
            }
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={{ paddingBottom: bottomButtonHeight }}
          />
        )}
        {/* <Block style={styles.buttonContainer}> */}
        <LinearGradient
          colors={[COLORS.TRANSPARENT, COLORS.BEIGE]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.buttonContainer}
        >
          <RoundButton
            buttonColor="#F69896"
            iconName="pluscircleo"
            iconFamily="AntDesign"
            label="悩みを話す"
            onPress={() => {
              if (checkCanCreateRoom()) {
                setIsOpenRoomEditorModal(true);
              }
            }}
          />
        </LinearGradient>
        {/* </Block> */}
      </Block>
      <RoomEditorModal
        isOpenRoomEditorModal={isOpenRoomEditorModal}
        setIsOpenRoomEditorModal={setIsOpenRoomEditorModal}
        propsDependsOnMode={{
          mode: "CREATE_FROM_ROOMS",
        }}
      />
    </>
  );
};

const bottomButtonHeight = 80;
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,
    width: width,
    alignItems: "center",
    position: "relative",
  },
  restoreContainer: {
    marginTop: 40,
    marginHorizontal: 16,
  },
  restoreTitle: {
    marginBottom: 16,
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
    height: bottomButtonHeight,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    zIndex: 2,
  },
  button: {
    marginTop: 16,
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
    height: bottomButtonHeight,
  },
});

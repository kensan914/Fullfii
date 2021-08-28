import React, { Dispatch, RefObject } from "react";
import { Block, Text } from "galio-framework";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "src/constants/colors";
import { RoomCard } from "src/components/templates/RecommendTemplate/organisms/RoomCard";
import { RoomEditorModal } from "src/components/organisms/RoomEditorModal";
import { width } from "src/constants";
import { Room } from "src/types/Types.context";
import { BlockRoom, HideRoom } from "src/types/Types";
import { AdView } from "src/components/molecules/AdView";
import { ADMOB_UNIT_ID_NATIVE } from "src/constants/env";
import { RoundButton } from "src/components/atoms/RoundButton";
import { AnimatedFlatListProps } from "src/hooks/tabInList/useAnimatedListProps";
import { mergeRefs } from "src/utils";

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
  roomsFlatListRef: RefObject<FlatList>;
  ListEmptyComponent?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ComponentType<any>
    | null;
  animatedFlatListProps?: AnimatedFlatListProps;
  shouldShowRoomEditorModal?: boolean;
};
export const RecommendTemplate: React.FC<Props> = (props) => {
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
    roomsFlatListRef,
    ListEmptyComponent,
    animatedFlatListProps,
    shouldShowRoomEditorModal = true,
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
          <Animated.FlatList
            {...(typeof animatedFlatListProps !== "undefined"
              ? {
                  ...animatedFlatListProps,
                  ...{
                    ref: mergeRefs(roomsFlatListRef, animatedFlatListProps.ref),
                  },
                }
              : {})}
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
                      style={styles.roomCard}
                    />
                    {index > 0 && (index + 1) % 3 === 0 && (
                      <AdView adUnitId={ADMOB_UNIT_ID_NATIVE.image} />
                    )}
                  </>
                );
              }
            }}
            style={styles.list}
            numColumns={numColumns}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.3}
            ListFooterComponent={() =>
              hasMore && !isRefreshing ? (
                <ActivityIndicator
                  size="large"
                  color={COLORS.LIGHT_GRAY}
                  style={{
                    marginVertical: 16,
                  }}
                />
              ) : (
                <></>
              )
            }
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={[
              typeof animatedFlatListProps !== "undefined"
                ? animatedFlatListProps.contentContainerStyle
                : {},
              {
                paddingBottom: shouldShowRoomEditorModal
                  ? BOTTOM_BUTTON_HEIGHT
                  : 24,
              },
            ]}
            ListEmptyComponent={
              hasMore && ListEmptyComponent ? <></> : ListEmptyComponent
            }
          />
        )}
        {shouldShowRoomEditorModal && (
          <LinearGradient
            colors={[COLORS.BEIGE_TRANSPARENT, COLORS.BEIGE]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.buttonContainer}
          >
            <RoundButton
              buttonColor="#F69896"
              iconName="pluscircleo"
              iconFamily="AntDesign"
              label="悩みを話す／聞く"
              style={{ width: "auto" }}
              onPress={() => {
                if (checkCanCreateRoom()) {
                  setIsOpenRoomEditorModal(true);
                }
              }}
            />
          </LinearGradient>
        )}
      </Block>
      {shouldShowRoomEditorModal && (
        <RoomEditorModal
          isOpenRoomEditorModal={isOpenRoomEditorModal}
          setIsOpenRoomEditorModal={setIsOpenRoomEditorModal}
          propsDependsOnMode={{
            mode: "CREATE_FROM_ROOMS",
          }}
        />
      )}
    </>
  );
};

const BOTTOM_BUTTON_HEIGHT = 80;
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
    height: BOTTOM_BUTTON_HEIGHT,
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
    height: BOTTOM_BUTTON_HEIGHT,
  },
  roomCard: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 12,
  },
});

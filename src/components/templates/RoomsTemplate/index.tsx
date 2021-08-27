import React from "react";
import { Block, Text, Button } from "galio-framework";
import { ScrollView, FlatList, StyleSheet, View } from "react-native";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  ShineOverlay,
  Fade,
  Shine,
} from "rn-placeholder";

import { height, width } from "src/constants";
import { COLORS } from "src/constants/colors";
import {
  RoomSummaryCard,
  ROOM_SUMMARY_CARD_HEIGHT,
  ROOM_SUMMARY_CARD_WIDTH,
} from "src/components/templates/RoomsTemplate/organisms/RoomSummaryCard";
import { AdViewLgBanner } from "src/components/molecules/AdViewLgBanner";
import { ADMOB_UNIT_ID_NATIVE } from "src/constants/env";
import { RoomsSummaries } from "src/types/Types";
import { NavigateRoomsIndividual } from "src/screens/RoomsScreen";

type Props = {
  roomsSummaries: RoomsSummaries | undefined;
  navigateRoomsIndividual: NavigateRoomsIndividual;
};
export const RoomsTemplate: React.FC<Props> = (props) => {
  const { roomsSummaries, navigateRoomsIndividual } = props;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Block center style={styles.adContainer}>
        <AdViewLgBanner adUnitId={ADMOB_UNIT_ID_NATIVE.image} />
      </Block>

      {typeof roomsSummaries !== "undefined" ? (
        roomsSummaries.map((roomsSummary) => (
          <React.Fragment key={roomsSummary.tag.key}>
            <Block row space="between" style={styles.titleContainer}>
              <Text size={16} color={COLORS.BLACK} bold style={styles.title}>
                {roomsSummary.title}
              </Text>
              <Button
                shadowless
                color="transparent"
                style={styles.showAllButtonInTitle}
                onPress={() => {
                  navigateRoomsIndividual(
                    roomsSummary.title,
                    roomsSummary.tag.key
                  );
                }}
              >
                <Text size={14} color={COLORS.BROWN}>
                  全てみる
                </Text>
              </Button>
            </Block>
            <FlatList
              data={roomsSummary.rooms}
              style={{ minHeight: ROOM_SUMMARY_CARD_HEIGHT }}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 8 }}
              renderItem={({ item }) => {
                return (
                  <RoomSummaryCard
                    key={item.id}
                    room={item}
                    style={{
                      marginLeft: 8,
                    }}
                  />
                );
              }}
              keyExtractor={(item) => item.id.toString()}
              ListFooterComponent={() => {
                return (
                  <Block flex style={styles.showAllContainer}>
                    <Button
                      shadowless
                      color="transparent"
                      style={styles.showAllButton}
                      onPress={() => {
                        navigateRoomsIndividual(
                          roomsSummary.title,
                          roomsSummary.tag.key
                        );
                      }}
                    >
                      <Text size={14} color={COLORS.BROWN}>
                        全てみる
                      </Text>
                    </Button>
                  </Block>
                );
              }}
            />
          </React.Fragment>
        ))
      ) : (
        // skelton UI
        <Placeholder
          Animation={(props) => (
            <Shine
              reverse={false}
              {...props}
              style={{ backgroundColor: COLORS.BEIGE_RGBA }}
            />
          )}
        >
          {new Array(4).fill(null).map((_, i) => {
            return (
              <React.Fragment key={i}>
                <Block row space="between" style={[styles.titleContainer]}>
                  <PlaceholderMedia
                    style={[
                      {
                        width: width * 0.65,
                        height: 20,
                        borderRadius: 6,
                        backgroundColor: COLORS.WHITE_RGBA,
                      },
                    ]}
                  />
                  <PlaceholderMedia
                    style={[
                      {
                        width: width * 0.2,
                        height: 20,
                        borderRadius: 6,
                        backgroundColor: COLORS.WHITE_RGBA,
                      },
                    ]}
                  />
                </Block>
                <Block row style={styles.titleContainer}>
                  <PlaceholderLine
                    style={{
                      height: ROOM_SUMMARY_CARD_HEIGHT,
                      width: ROOM_SUMMARY_CARD_WIDTH,
                      borderRadius: 20,
                      backgroundColor: COLORS.WHITE_RGBA,
                    }}
                  />
                  <PlaceholderLine
                    style={{
                      height: ROOM_SUMMARY_CARD_HEIGHT,
                      width: ROOM_SUMMARY_CARD_WIDTH,
                      borderRadius: 20,
                      marginLeft: 8,
                      backgroundColor: COLORS.WHITE_RGBA,
                    }}
                  />
                </Block>
              </React.Fragment>
            );
          })}
        </Placeholder>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  adContainer: {
    width: width * 0.8,
    height: 210,
  },
  titleContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  title: {
    alignSelf: "center",
  },
  showAllButtonInTitle: {
    width: "auto",
  },
  showAllButton: {
    width: "auto",
    height: "100%",
    paddingRight: 24,
    paddingLeft: 24,
  },
  showAllContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

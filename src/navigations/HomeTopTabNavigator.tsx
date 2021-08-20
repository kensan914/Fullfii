import React, { useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { Text } from "galio-framework";
import { useScrollToTop } from "@react-navigation/native";
import { SceneRendererProps, TabBar, TabView } from "react-native-tab-view";

import { COLORS } from "src/constants/colors";
import { RoomsScreen } from "src/screens/RoomsScreen";
import { PrivateRoomsScreen } from "src/screens/PrivateRoomsScreen";
import { useDomState } from "src/contexts/DomContext";
import {
  BOTTOM_TAB_BAR_HEIGHT,
  HEADER_HEIGHT,
  height,
  HOME_TOP_TAB_HEIGHT,
  STATUS_BAR_HEIGHT,
} from "src/constants";
import { useTabInList } from "src/hooks/tabInList/useTabInList";
import { Header } from "src/navigations/Header";

export type RouteKeyHomeTopTab =
  | "PRIVATE"
  | "ALL"
  | "LOVE"
  | "WORK"
  | "RELATIONSHIP"
  | "SCHOOL";
export type RouteHomeTopTab = { key: RouteKeyHomeTopTab; title: string };
export const HomeTopTabNavigator: React.FC = () => {
  const domState = useDomState();

  const privateRoomsFlatListRef = useRef(null);
  const roomsAllFlatListRef = useRef(null);
  const roomsLoveFlatListRef = useRef(null);
  const roomsWorkFlatListRef = useRef(null);
  const roomsRelationshipFlatListRef = useRef(null);
  const roomsSchoolFlatListRef = useRef(null);

  // アクティブなホームタブをプレスした時, topにスクロール
  // https://reactnavigation.org/docs/use-scroll-to-top
  useScrollToTop(privateRoomsFlatListRef);
  useScrollToTop(roomsAllFlatListRef);
  useScrollToTop(roomsLoveFlatListRef);
  useScrollToTop(roomsWorkFlatListRef);
  useScrollToTop(roomsRelationshipFlatListRef);
  useScrollToTop(roomsSchoolFlatListRef);

  const [routes] = useState<RouteHomeTopTab[]>([
    { key: "PRIVATE", title: "プライベート" },
    { key: "ALL", title: "最新" },
    { key: "LOVE", title: "恋愛" },
    { key: "WORK", title: "仕事" },
    { key: "RELATIONSHIP", title: "人間関係" },
    { key: "SCHOOL", title: "学校" },
  ]);

  const {
    tabIndex,
    animatedScrollY,
    onIndexChange,
    geneTabInListSettings,
    hiddenAnimatedViewStyle,
  } = useTabInList<RouteKeyHomeTopTab>(
    routes,
    HEADER_HEIGHT,
    HOME_TOP_TAB_HEIGHT,
    height - (STATUS_BAR_HEIGHT + BOTTOM_TAB_BAR_HEIGHT),
    domState.animatedHeaderScrollY
  );

  const renderScene: React.FC<
    SceneRendererProps & {
      route: RouteHomeTopTab;
    }
  > = (props) => {
    const { route } = props;
    switch (route.key) {
      case "PRIVATE": {
        return (
          <PrivateRoomsScreen
            tabInListSettings={geneTabInListSettings(route.key)}
            flatListRef={privateRoomsFlatListRef}
          />
        );
      }
      case "ALL": {
        return (
          <RoomsScreen
            tabInListSettings={geneTabInListSettings(route.key)}
            flatListRef={roomsAllFlatListRef}
          />
        );
      }
      case "LOVE": {
        return (
          <RoomsScreen
            tabInListSettings={geneTabInListSettings(route.key)}
            flatListRef={roomsLoveFlatListRef}
            tagKey="love"
          />
        );
      }
      case "WORK": {
        return (
          <RoomsScreen
            tabInListSettings={geneTabInListSettings(route.key)}
            flatListRef={roomsWorkFlatListRef}
            tagKey="work"
          />
        );
      }
      case "RELATIONSHIP": {
        return (
          <RoomsScreen
            tabInListSettings={geneTabInListSettings(route.key)}
            flatListRef={roomsRelationshipFlatListRef}
            tagKey="relationship"
          />
        );
      }
      case "SCHOOL": {
        return (
          <RoomsScreen
            tabInListSettings={geneTabInListSettings(route.key)}
            flatListRef={roomsSchoolFlatListRef}
            tagKey="school"
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <>
      <TabView
        style={styles.container}
        navigationState={{
          index: tabIndex,
          routes: routes,
        }}
        renderScene={renderScene}
        renderTabBar={(props) => (
          <Animated.View style={hiddenAnimatedViewStyle}>
            <Header name={"Rooms"} />
            <TabBar
              getLabelText={({ route }) => route.title}
              indicatorStyle={styles.indicator}
              style={[styles.tabBar, {}]}
              tabStyle={{
                width: "auto",
                height: HOME_TOP_TAB_HEIGHT,
              }}
              scrollEnabled
              activeColor={COLORS.DEEP_PINK}
              inactiveColor={COLORS.GRAY}
              renderLabel={({ route, focused, color }) => (
                <Text
                  numberOfLines={1}
                  bold={focused}
                  size={16}
                  style={{
                    color: color,
                    paddingHorizontal: 4,
                  }}
                >
                  {route.title}
                </Text>
              )}
              {...props}
            />
          </Animated.View>
        )}
        onIndexChange={onIndexChange}
        swipeEnabled
        lazy
      />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,
  },
  tabBar: {
    backgroundColor: COLORS.BEIGE,
    elevation: 0,
  },
  indicator: {
    backgroundColor: COLORS.PINK,
    height: 3,
  },
});

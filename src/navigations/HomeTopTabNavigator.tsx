import React, { useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Text } from "galio-framework";
import { useScrollToTop } from "@react-navigation/native";
import { SceneRendererProps, TabBar, TabView } from "react-native-tab-view";

import { COLORS } from "src/constants/colors";
import { RecommendScreen } from "src/screens/RecommendScreen";
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
import { useFilterRoom } from "src/navigations/Header/organisms/FilterHeaderMenu/useFilterRoom";

export type RouteKeyHomeTopTab = "PRIVATE" | "ALL" | "RECOMMEND";
export type RouteHomeTopTab = { key: RouteKeyHomeTopTab; title: string };
export const HomeTopTabNavigator: React.FC = () => {
  const domState = useDomState();

  const privateRoomsFlatListRef = useRef(null);
  const roomsAllFlatListRef = useRef(null);
  const roomsRecommendFlatListRef = useRef(null);

  // アクティブなホームタブをプレスした時, topにスクロール
  // https://reactnavigation.org/docs/use-scroll-to-top
  useScrollToTop(privateRoomsFlatListRef);
  useScrollToTop(roomsAllFlatListRef);
  useScrollToTop(roomsRecommendFlatListRef);

  const [routes] = useState<RouteHomeTopTab[]>([
    { key: "ALL", title: "最新" },
    { key: "RECOMMEND", title: "おすすめ" },
    { key: "PRIVATE", title: "プライベート" },
  ]);

  const { filterKey, filterHeaderMenu } = useFilterRoom();

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
    domState.animatedHeaderScrollY,
    0
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
            filterKey={filterKey}
          />
        );
      }
      case "ALL": {
        return (
          <RecommendScreen
            tabInListSettings={geneTabInListSettings(route.key)}
            flatListRef={roomsAllFlatListRef}
            filterKey={filterKey}
          />
        );
      }
      case "RECOMMEND": {
        return (
          <RecommendScreen
            tabInListSettings={geneTabInListSettings(route.key)}
            flatListRef={roomsRecommendFlatListRef}
            filterKey={filterKey}
            isRecommend
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
            <Header name={"Recommend"} renderRight={filterHeaderMenu} />
            <View style={styles.tabBarContainer}>
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
            </View>
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
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "center",
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

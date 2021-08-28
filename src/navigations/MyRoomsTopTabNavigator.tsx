import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "galio-framework";
import { SceneRendererProps, TabBar, TabView } from "react-native-tab-view";

import { COLORS } from "src/constants/colors";
import { MY_ROOMS_TOP_TAB_HEIGHT, width } from "src/constants";
import { MyRoomsScreen } from "src/screens/MyRoomsScreen";
import { OnIndexChange } from "src/types/Types";
import { DMScreen } from "src/screens/DMScreen";

export type RouteKeyMyRoomsTopTab = "TALKING_ROOMS" | "DM";
export type RouteMyRoomsTopTab = { key: RouteKeyMyRoomsTopTab; title: string };
export const MyRoomsTopTabNavigator: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState<RouteMyRoomsTopTab[]>([
    { key: "TALKING_ROOMS", title: "ルーム" },
    { key: "DM", title: "DM" },
  ]);
  const onIndexChange: OnIndexChange = useCallback(
    (_index) => {
      setTabIndex(_index);
    },
    [setTabIndex]
  );

  const renderScene: React.FC<
    SceneRendererProps & {
      route: RouteMyRoomsTopTab;
    }
  > = (props) => {
    const { route } = props;
    switch (route.key) {
      case "TALKING_ROOMS": {
        return <MyRoomsScreen />;
      }
      case "DM": {
        return <DMScreen />;
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
          <View style={styles.tabBarContainer}>
            <TabBar
              getLabelText={({ route }) => route.title}
              indicatorStyle={styles.indicator}
              style={[styles.tabBar, {}]}
              tabStyle={{
                width: width / routes.length,
                height: MY_ROOMS_TOP_TAB_HEIGHT,
              }}
              scrollEnabled
              activeColor={COLORS.DEEP_PINK}
              inactiveColor={COLORS.GRAY}
              renderLabel={({ route, focused, color }) => (
                <Text
                  bold={focused}
                  size={16}
                  style={{
                    color: color,
                    width: width / routes.length,
                    textAlign: "center",
                  }}
                >
                  {route.title}
                </Text>
              )}
              {...props}
            />
          </View>
        )}
        onIndexChange={onIndexChange}
        swipeEnabled
        // lazy
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

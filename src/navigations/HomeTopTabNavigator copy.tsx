import React, { useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import ReAnimated from "react-native-reanimated";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "galio-framework";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { useScrollToTop } from "@react-navigation/native";
import TabBarTop from "@react-navigation/material-top-tabs/lib/typescript/src/views/MaterialTopTabBar";
import { TabBar, TabView } from "react-native-tab-view";

import { COLORS } from "src/constants/colors";
import { RoomsScreen } from "src/screens/RoomsScreen";
import { PrivateRoomsScreen } from "src/screens/PrivateRoomsScreen";
import { useDomState } from "src/contexts/DomContext";
import { BOTTOM_TAB_BAR_HEIGHT, HEADER_HEIGHT } from "src/constants";

export const HomeTopTabNavigator: React.FC = () => {
  const domState = useDomState();
  const TopTab = createMaterialTopTabNavigator();
  const Tab = createBottomTabNavigator();

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

  const geneTabName = (
    key: "PRIVATE" | "ALL" | "LOVE" | "WORK" | "RELATIONSHIP" | "SCHOOL"
  ) => {
    let name = "";
    switch (key) {
      case "PRIVATE":
        name = "プライベート";
        break;
      case "ALL":
        name = "最新";
        break;
      case "LOVE":
        name = "恋愛";
        break;
      case "WORK":
        name = "仕事";
        break;
      case "RELATIONSHIP":
        name = "人間関係";
        break;
      case "SCHOOL":
        name = "学校";
        break;
    }
    return ` ${name} `;
  };

  return (
    <TopTab.Navigator
      // tabBar={(props) => (
      //   <TabBar
      //     getLabelText={(x) => x.}
      //     indicatorStyle={{
      //       backgroundColor: COLORS.PINK,
      //       height: 3,
      //     }}
      //     style={[styles.tabBar, { height: BOTTOM_TAB_BAR_HEIGHT }]}
      //     activeColor={COLORS.LIGHT_GRAY}
      //     inactiveColor={COLORS.LIGHT_GRAY}
      //     renderLabel={({ route, focused, color }) => (
      //       <Text bold={focused} size={12} style={{ color: color }}>
      //         {route.title}
      //       </Text>
      //     )}
      //     {...props}
      //   />
      // )}
      tabBarOptions={{
        activeTintColor: COLORS.DEEP_PINK,
        inactiveTintColor: COLORS.GRAY,
        labelStyle: { fontSize: 16 },
        // animatedStyle: {
        //   height: HEADER_HEIGHT,
        //   transform: [
        //     {
        //       translateY: domState.animatedHeaderScrollY.interpolate({
        //         inputRange: [0, HEADER_HEIGHT],
        //         outputRange: [0, -1 * HEADER_HEIGHT],
        //         extrapolate: "clamp",
        //       }),
        //     },
        //   ],
        // },
        style: {
          backgroundColor: COLORS.BEIGE,
        },
        indicatorStyle: {
          backgroundColor: COLORS.PINK,
          height: 3,
        },
        scrollEnabled: true,
        tabStyle: {
          width: "auto",
        },
      }}
      initialRouteName={geneTabName("ALL")}
      lazy={true}
    >
      <Tab.Screen name={geneTabName("PRIVATE")}>
        {(props) => (
          <PrivateRoomsScreen
            {...props}
            flatListRef={privateRoomsFlatListRef}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name={geneTabName("ALL")}>
        {(props) => (
          <RoomsScreen {...props} flatListRef={roomsAllFlatListRef} />
        )}
      </Tab.Screen>
      <Tab.Screen name={geneTabName("LOVE")}>
        {(props) => (
          <RoomsScreen
            {...props}
            flatListRef={roomsLoveFlatListRef}
            tagKey="love"
          />
        )}
      </Tab.Screen>
      <Tab.Screen name={geneTabName("WORK")}>
        {(props) => (
          <RoomsScreen
            {...props}
            flatListRef={roomsWorkFlatListRef}
            tagKey="work"
          />
        )}
      </Tab.Screen>
      <Tab.Screen name={geneTabName("RELATIONSHIP")}>
        {(props) => (
          <RoomsScreen
            {...props}
            flatListRef={roomsRelationshipFlatListRef}
            tagKey="relationship"
          />
        )}
      </Tab.Screen>
      <Tab.Screen name={geneTabName("SCHOOL")}>
        {(props) => (
          <RoomsScreen
            {...props}
            flatListRef={roomsSchoolFlatListRef}
            tagKey="school"
          />
        )}
      </Tab.Screen>
    </TopTab.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  label: {
    margin: 0,
    marginTop: 6,
    marginBottom: 6,
    fontWeight: "400",
  },
});

const MyTabBar: React.FC<MaterialTopTabBarProps> = ({
  state,
  descriptors,
  navigation,
  position,
}) => {
  const domState = useDomState();

  return (
    <Animated.View
      style={[
        { flexDirection: "row", backgroundColor: COLORS.BEIGE },
        {
          height: HEADER_HEIGHT,
          transform: [
            {
              translateY: domState.animatedHeaderScrollY.interpolate({
                inputRange: [0, HEADER_HEIGHT],
                outputRange: [0, -1 * HEADER_HEIGHT],
                extrapolate: "clamp",
              }),
            },
          ],
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = ReAnimated.interpolate(position, {
          inputRange,
          outputRange: inputRange.map((i) => (i === index ? 1 : 0)),
        });

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ width: "auto" }}
          >
            <ReAnimated.Text style={[{ opacity }, { fontSize: 16 }]}>
              {label}
            </ReAnimated.Text>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

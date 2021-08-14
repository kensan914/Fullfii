import React, { useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useScrollToTop } from "@react-navigation/native";

import { COLORS } from "src/constants/colors";
import { RoomsScreen } from "src/screens/RoomsScreen";
import { PrivateRoomsScreen } from "src/screens/PrivateRoomsScreen";

export const HomeTopTabNavigator: React.FC = () => {
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
      tabBarOptions={{
        activeTintColor: COLORS.DEEP_PINK,
        inactiveTintColor: COLORS.GRAY,
        labelStyle: { fontSize: 16 },
        style: { backgroundColor: COLORS.BEIGE },
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

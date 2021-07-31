import React, { useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { COLORS } from "src/constants/colors";
import { RoomsScreen } from "src/screens/RoomsScreen";
import { PrivateRoomsScreen } from "src/screens/PrivateRoomsScreen";
import { useScrollToTop } from "@react-navigation/native";

export const HomeTopTabNavigator: React.FC = () => {
  const TopTab = createMaterialTopTabNavigator();
  const Tab = createBottomTabNavigator();

  const roomsFlatListRef = useRef(null);
  const privateRoomsFlatListRef = useRef(null);

  // アクティブなホームタブをプレスした時, topにスクロール
  // https://reactnavigation.org/docs/use-scroll-to-top
  useScrollToTop(roomsFlatListRef);
  useScrollToTop(privateRoomsFlatListRef);

  return (
    <TopTab.Navigator
      tabBarOptions={{
        style: { backgroundColor: COLORS.BEIGE },
        indicatorStyle: {
          backgroundColor: COLORS.PINK,
          height: 3,
        },
      }}
    >
      <Tab.Screen name={"ルーム一覧"}>
        {(props) => <RoomsScreen {...props} flatListRef={roomsFlatListRef} />}
      </Tab.Screen>
      <Tab.Screen name={"プライベート"}>
        {(props) => (
          <PrivateRoomsScreen
            {...props}
            flatListRef={privateRoomsFlatListRef}
          />
        )}
      </Tab.Screen>
    </TopTab.Navigator>
  );
};

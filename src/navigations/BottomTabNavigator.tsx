import React from "react";
import { Text, Block } from "galio-framework";
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SvgUri from "react-native-svg-uri";

import Icon from "src/components/atoms/Icon";
import { RoomsScreenDev } from "src/screens/RoomsScreenDev";
import { MyRoomsScreenDev } from "src/screens/MyRoomsScreenDev";
import { ProfileScreen } from "src/screens/ProfileScreen";
import { COLORS } from "src/constants/theme";

export const BottomTabNavigator: React.FC = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let badgeCount;
          // const routeName = getFocusedRouteNameFromRoute(route);
          const routeName = route.name;

          if (routeName === "ホーム") {
            iconName = focused ? require('../assets/icons/homeIcon.svg') : require('../assets/icons/homeIcon.svg');
          } else if (routeName === "トーク") {
            iconName = focused ? require('../assets/icons/chatIcon.svg') : require('../assets/icons/chatIcon.svg');
          } else if (routeName === "マイページ") {
            iconName = focused ? require('../assets/icons/mypageIcon.svg') : require('../assets/icons/mypageIcon.svg');
            // badgeCount = cvtBadgeCount(chatState.totalUnreadNum);
          } else if (routeName === "Talk") {
            iconName = focused ? "comments" : "comments-o";
            // badgeCount = cvtBadgeCount(chatState.totalUnreadNum);
          }
          return (
            <Block
              style={{
                position: "relative",
                height: 40,
                width: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SvgUri
                width={32}
                height={32}
                source={iconName}
                fill={color}
              />
              {/* <Icon
                family="font-awesome"
                name={iconName}
                size={size}
                color={color}
              /> */}
              {typeof badgeCount !== "undefined" && badgeCount !== null && (
                <Block
                  style={{
                    position: "absolute",
                    backgroundColor: "#F69896",
                    right: 0,
                    top: 0,
                    height: 18,
                    minWidth: 18,
                    borderRadius: 9,
                    borderColor: "white",
                    borderWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    size={13}
                    color="white"
                    style={{ paddingHorizontal: 3 }}
                  >
                    {badgeCount}
                  </Text>
                </Block>
              )}
            </Block>
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: "#F69896",
        inactiveTintColor: "gray",
        showLabel: true,
        style: { backgroundColor: COLORS.BEIGE, },
      }}
    >
      <Tab.Screen name="ホーム" component={RoomsScreenDev} />
      <Tab.Screen name="トーク" component={MyRoomsScreenDev} />
      <Tab.Screen name="マイページ" component={ProfileScreen} />
      {/* <Tab.Screen name="Talk" component={TalkScreen} /> */}
      {/* <Tab.Screen
        name="Notification"
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              activeOpacity={1}
              {...props}
              onPress={() => {
                // additional processing
                props.onPress();
              }}
            />
          ),
        }}
      >
        {() => <NotificationScreen notificationState={notificationState} />}
      </Tab.Screen> */}
    </Tab.Navigator>
  );
};

import React from "react";
import { Block, Text } from "galio-framework";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SvgUri from "react-native-svg-uri";

import { Header } from "src/components/organisms/Header";
import { MyRoomsScreen } from "src/screens/MyRoomsScreen";
import { ProfileScreen } from "src/screens/ProfileScreen";
import { RoomsScreen } from "src/screens/RoomsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS } from "src/constants/theme";
import { cvtBadgeCount } from "src/utils";
import { useChatState } from "src/contexts/ChatContext";
import { MyRoomsRouteProp } from "src/types/Types";

export const BottomTabNavigator: React.FC = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const chatState = useChatState();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let label: string | undefined;
          let badgeCount: number | null | undefined;

          const routeName = route.name;

          if (routeName === "Rooms") {
            iconName = focused
              ? require("../assets/icons/homeIcon.svg")
              : require("../assets/icons/homeIcon.svg");
            label = "ホーム";
          } else if (routeName === "MyRooms") {
            iconName = focused
              ? require("../assets/icons/chatIcon.svg")
              : require("../assets/icons/chatIcon.svg");
            label = "トーク";
            badgeCount = cvtBadgeCount(chatState.totalUnreadNum);
          } else if (routeName === "Profile") {
            iconName = focused
              ? require("../assets/icons/mypageIcon.svg")
              : require("../assets/icons/mypageIcon.svg");
            label = "マイページ";
            // badgeCount = cvtBadgeCount(chatState.totalUnreadNum);
          }
          return (
            <Block
              style={{
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SvgUri width={32} height={32} source={iconName} fill={color} />
              <Text bold size={12} style={{ color: color }}>
                {label}
              </Text>

              {typeof badgeCount !== "undefined" &&
                badgeCount !== null &&
                badgeCount > 0 && (
                  <Block
                    style={{
                      position: "absolute",
                      backgroundColor: "#F69896",
                      right: -10,
                      top: -4,
                      height: 24,
                      minWidth: 24,
                      borderRadius: 12,
                      borderColor: COLORS.BEIGE,
                      borderWidth: 2,
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
        showLabel: false,
        style: {
          backgroundColor: COLORS.BEIGE,
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen name="Rooms">
        {() => (
          <Block flex style={{ backgroundColor: COLORS.BEIGE }}>
            <Stack.Navigator>
              <Stack.Screen
                name="Rooms"
                component={RoomsScreen}
                options={() => ({
                  header: () => <Header name={"Rooms"} />,
                })}
              />
            </Stack.Navigator>
          </Block>
        )}
      </Tab.Screen>
      <Tab.Screen name="MyRooms">
        {({ route }) => {
          const _route = route as MyRoomsRouteProp;
          return (
            <Block flex style={{ backgroundColor: COLORS.BEIGE }}>
              <Stack.Navigator>
                <Stack.Screen
                  name="MyRooms"
                  options={() => ({
                    header: () => <Header name={"MyRooms"} />,
                  })}
                >
                  {/* Tab内でStackを用いたことで, MyRoomsScreen内でuseRouteしてもStackの方のrouteを引っ張ってくる (欲しいのはTabの) */}
                  {() => <MyRoomsScreen route={_route} />}
                </Stack.Screen>
              </Stack.Navigator>
            </Block>
          );
        }}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => (
          <Block flex style={{ backgroundColor: COLORS.BEIGE }}>
            <Stack.Navigator>
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={() => ({
                  header: () => <Header name={"Profile"} />,
                })}
              />
            </Stack.Navigator>
          </Block>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

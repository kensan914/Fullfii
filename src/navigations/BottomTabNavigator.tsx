import React from "react";
import { Block, Text } from "galio-framework";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { SvgUri } from "src/components/atoms/SvgUri";
import { Header } from "src/navigations/Header";
import { MyRoomsScreen } from "src/screens/MyRoomsScreen";
import { ProfileScreen } from "src/screens/ProfileScreen";
import { RoomsScreen } from "src/screens/RoomsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS } from "src/constants/theme";
import { cvtBadgeCount } from "src/utils";
import { useChatState } from "src/contexts/ChatContext";
import { MyRoomsRouteProp } from "src/types/Types";
import { useAuthState } from "src/contexts/AuthContext";
import {
  chatIconFocusSvg,
  chatIconSvg,
  homeIconFocusSvg,
  homeIconSvg,
  mypageIconFocusSvg,
  mypageIconSvg,
} from "src/constants/svgSources";
import { PrivateRoomsScreen } from "src/screens/PrivateRoomsScreen";

export const BottomTabNavigator: React.FC = () => {
  const Tab = createBottomTabNavigator();
  const TopTab = createMaterialTopTabNavigator();
  const Stack = createStackNavigator();

  const chatState = useChatState();
  const authState = useAuthState();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let label: string | undefined;
          let badgeCount: number | null | undefined;

          const routeName = route.name;

          if (routeName === "Rooms") {
            iconName = focused ? homeIconFocusSvg : homeIconSvg;
            label = "ホーム";
          } else if (routeName === "MyRooms") {
            iconName = focused ? chatIconFocusSvg : chatIconSvg;
            label = "トーク";
            badgeCount = cvtBadgeCount(chatState.totalUnreadNum);
          } else if (routeName === "Profile") {
            iconName = focused ? mypageIconFocusSvg : mypageIconSvg;
            label = "マイページ";
          }
          return (
            <Block
              style={{
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SvgUri width={32} height={32} source={iconName} />
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
          elevation: 0, // for Android
        },
      }}
      initialRouteName={
        authState.initBottomTabRouteName
          ? authState.initBottomTabRouteName
          : void 0
      }
    >
      <Tab.Screen name="Rooms">
        {() => (
          <Block flex style={{ backgroundColor: COLORS.BEIGE }}>
            <Stack.Navigator>
              <Stack.Screen
                name="Rooms"
                // component={RoomsScreen}
                options={() => ({
                  header: () => <Header name={"Rooms"} />,
                })}
              >
                {() => (
                  <TopTab.Navigator
                    tabBarOptions={{
                      style: { backgroundColor: COLORS.BEIGE },
                      indicatorStyle: {
                        backgroundColor: COLORS.PINK,
                        height: 3,
                      },
                    }}
                  >
                    <Tab.Screen name="ルーム一覧" component={RoomsScreen} />
                    <Tab.Screen
                      name="プライベート"
                      component={PrivateRoomsScreen}
                    />
                  </TopTab.Navigator>
                )}
              </Stack.Screen>
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

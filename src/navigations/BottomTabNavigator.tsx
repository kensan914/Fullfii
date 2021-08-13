import React from "react";
import { Block, Text } from "galio-framework";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { SvgUri } from "src/components/atoms/SvgUri";
import { Header } from "src/navigations/Header";
import { MyRoomsScreen } from "src/screens/MyRoomsScreen";
import { MeProfileScreen } from "src/screens/MeProfileScreen";
import { COLORS } from "src/constants/colors";
import { cvtBadgeCount } from "src/utils";
import { useChatState } from "src/contexts/ChatContext";
import { MyRoomsRouteProp } from "src/types/Types";
import { useAuthState } from "src/contexts/AuthContext";
import {
  homeIconFocusSvg,
  homeIconSvg,
  mypageIconFocusSvg,
  mypageIconSvg,
} from "src/constants/svgSources";
import { BOTTOM_TAB_BAR_HEIGHT } from "src/constants";
import { HomeTopTabNavigator } from "src/navigations/HomeTopTabNavigator";
import { useReview } from "src/hooks/useReview";
import { ReviewModal } from "src/components/organisms/ReviewModal";
import { Icon } from "src/components/atoms/Icon";
import { LevelUpModal } from "src/components/organisms/LevelUpModal";
import { useLevelUp } from "src/hooks/useLevelUp";

export const BottomTabNavigator: React.FC = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const chatState = useChatState();
  const authState = useAuthState();

  const { isOpenReviewModal, setIsOpenReviewModal } = useReview();
  const { isOpenLevelUpModal, setIsOpenLevelUpModal } = useLevelUp();

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            let iconNode;
            let label: string | undefined;
            let badgeCount: number | null | undefined;

            const routeName = route.name;

            if (routeName === "Rooms") {
              iconName = focused ? homeIconFocusSvg : homeIconSvg;
              iconNode = <SvgUri width={32} height={32} source={iconName} />;
              label = "ホーム";
            } else if (routeName === "MyRooms") {
              // iconName = focused ? chatIconFocusSvg : chatIconSvg;
              iconNode = (
                <Block
                  style={{
                    width: 32,
                    height: 32,
                    padding: 2,
                  }}
                >
                  <Icon
                    name="message1"
                    family="AntDesign"
                    size={28}
                    color={color}
                  />
                </Block>
              );
              label = "トーク";
              badgeCount = cvtBadgeCount(chatState.totalUnreadNum);
            } else if (routeName === "MeProfile") {
              iconName = focused ? mypageIconFocusSvg : mypageIconSvg;
              iconNode = <SvgUri width={32} height={32} source={iconName} />;
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
                {iconNode}
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
            height: BOTTOM_TAB_BAR_HEIGHT,
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
                  options={() => ({
                    header: () => <Header name={"Rooms"} />,
                  })}
                  component={HomeTopTabNavigator}
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
        <Tab.Screen name="MeProfile">
          {() => (
            <Block flex style={{ backgroundColor: COLORS.BEIGE }}>
              <Stack.Navigator>
                <Stack.Screen
                  name="MeProfile"
                  component={MeProfileScreen}
                  options={() => ({
                    header: () => <Header name={"MeProfile"} />,
                  })}
                />
              </Stack.Navigator>
            </Block>
          )}
        </Tab.Screen>
      </Tab.Navigator>
      <ReviewModal
        isOpen={isOpenReviewModal}
        setIsOpen={setIsOpenReviewModal}
      />
      <LevelUpModal
        isOpen={isOpenLevelUpModal}
        setIsOpen={setIsOpenLevelUpModal}
      />
    </>
  );
};

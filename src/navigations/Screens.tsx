import React, { ReactNode } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-navigation";

import { Header } from "src/components/organisms/Header";
import { ChatScreen } from "src/screens/ChatScreen";
import ProfileInputScreen from "src/screens/ProfileInput";
import SettingsScreen from "src/screens/Settings";
import AccountDeleteScreen from "src/screens/AccountDelete";
import {
  useAuthState,
  AUTHENTICATED,
  UNAUTHENTICATED,
  DELETED,
  AUTHENTICATING,
} from "src/contexts/AuthContext";
import Spinner from "src/components/atoms/Spinner";
import { RootStackParamList } from "src/types/Types";
import SuccessAccountDelete from "src/screens/SuccessAccountDelete";
import { COLORS } from "src/constants/theme";
import { BottomTabNavigator } from "./BottomTabNavigator";
import { TopScreen } from "src/screens/TopScreen";
import { OnboardingScreen } from "src/screens/OnboardingScreen";
import { AttManager } from "src/screens/AttManager";
import { _IntroCreateRoomScreen } from "src/screens/IntroCreateRoomScreen";
import { SignupScreen } from "src/screens/signup/SignupScreen";
import { IntroCreateRoomScreen } from "src/screens/signup/IntroCreateRoomScreen";

const Stack = createStackNavigator<RootStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Home"
        component={BottomTabNavigator}
        options={() => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="ProfileInput"
        component={ProfileInputScreen}
        options={({ route }) => ({
          header: () => {
            const name = route.params.screen;
            return <Header back name={name} />;
          },
        })}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          header: () => {
            const roomId = route.params.roomId;
            return <Header back name={"Chat"} roomId={roomId} />;
          },
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          header: () => <Header back name={"Settings"} />,
        }}
      />
      <Stack.Screen
        name="AccountDelete"
        component={AccountDeleteScreen}
        options={{
          header: () => <Header back name={"AccountDelete"} />,
        }}
      />
    </Stack.Navigator>
  );
};

const AppStack: React.FC = () => {
  const authState = useAuthState();

  const withSafeAreaView = (component: ReactNode) => {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: COLORS.BEIGE }}
        forceInset={{ bottom: "never" }}
      >
        {component}
      </SafeAreaView>
    );
  };

  switch (authState.status) {
    case AUTHENTICATED:
      return withSafeAreaView(
        <AttManager>
          <Stack.Navigator mode="card" headerMode="none">
            <Stack.Screen name="Authenticated">
              {() => (
                <>
                  <HomeStack />

                  {/* ユーザ登録スクリーン */}
                  {/* <SignupScreen /> */}

                  {/* 悩み相談ルーム作成スクリーン */}
                  {/* <IntroCreateRoomScreen /> */}

                  {authState.isShowSpinner && <Spinner />}
                </>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </AttManager>
      );

    case AUTHENTICATING:
      return withSafeAreaView(
        <Stack.Navigator
          mode="card"
          headerMode="none"
          screenOptions={{
            gestureEnabled: false, // backを可能に。
          }}
        >
          <Stack.Screen
            name="IntroCreateRoom"
            component={_IntroCreateRoomScreen}
          />
        </Stack.Navigator>
      );

    case UNAUTHENTICATED:
      return (
        <Stack.Navigator
          mode="card"
          headerMode="none"
          screenOptions={{
            gestureEnabled: false, // backを可能に。
          }}
        >
          <Stack.Screen name="Top" component={TopScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        </Stack.Navigator>
      );

    case DELETED:
      return withSafeAreaView(<SuccessAccountDelete />);

    default:
      return <></>;
  }
};

export default AppStack;

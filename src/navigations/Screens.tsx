import React, { ReactNode } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SafeAreaView from "react-native-safe-area-view";

import { Header } from "src/navigations/Header";
import { ChatScreen } from "src/screens/ChatScreen";
import { ProfileInputScreen } from "src/screens/ProfileInputScreen";
import { SettingsScreen } from "src/screens/SettingsScreen";
import { AccountDeleteScreen } from "src/screens/AccountDeleteScreen";
import {
  useAuthState,
  AUTHENTICATED,
  UNAUTHENTICATED,
  DELETED,
  AUTHENTICATING,
} from "src/contexts/AuthContext";
import { Spinner } from "src/components/atoms/Spinner";
import { RootStackParamList } from "src/types/Types";
import { SuccessAccountDeleteScreen } from "src/screens/SuccessAccountDeleteScreen";
import { COLORS } from "src/constants/colors";
import { BottomTabNavigator } from "src/navigations/BottomTabNavigator";
import { TopScreen } from "src/screens/TopScreen";
import { ProfileEditorScreen } from "src/screens/ProfileEditorScreen";
import { MessageHistoryScreen } from "src/screens/MessageHistoryScreen";
import { IntroCreateRoomScreen } from "src/screens/intro/IntroCreateRoomScreen";
import { IntroParticipateRoomScreen } from "src/screens/intro/IntroParticipateRoomScreen";
import { IntroSignupScreen } from "src/screens/intro/IntroSignupScreen";
import { IntroTopScreen } from "src/screens/intro/IntroTopScreen";
import { ProfileScreen } from "src/screens/ProfileScreen";
import { Alert5xxScreen } from "src/screens/Alert5xxScreen";
import { OK, useDomState } from "src/contexts/DomContext";

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
        name="Profile"
        component={ProfileScreen}
        options={() => ({
          header: () => {
            return <Header back name={"Profile"} />;
          },
        })}
      />
      <Stack.Screen
        name="ProfileEditor"
        component={ProfileEditorScreen}
        options={() => ({
          header: () => {
            return <Header back name={"ProfileEditor"} />;
          },
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
            return <Header isLeftTitle back name={"Chat"} roomId={roomId} />;
          },
        })}
      />
      <Stack.Screen
        name="MessageHistory"
        component={MessageHistoryScreen}
        options={() => ({
          header: () => {
            return <Header back name={"MessageHistory"} />;
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
  const domState = useDomState();

  // === 5xxエラー === //
  if (domState.apiStatus !== OK) {
    return <Alert5xxScreen />;
  }
  // ================ //

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
        <Stack.Navigator mode="card" headerMode="none">
          <Stack.Screen name="Authenticated">
            {() => (
              <>
                <HomeStack />
                {authState.isShowSpinner && <Spinner />}
              </>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      );

    case AUTHENTICATING:
      return withSafeAreaView(
        <Stack.Navigator
          mode="card"
          headerMode="none"
          screenOptions={{
            gestureEnabled: false, // backを不可能に
          }}
          initialRouteName="IntroTop"
        >
          <Stack.Screen name="IntroTop" component={IntroTopScreen} />
          <Stack.Screen
            name="IntroCreateRoom"
            component={IntroCreateRoomScreen}
          />
          <Stack.Screen
            name="IntroParticipateRoom"
            component={IntroParticipateRoomScreen}
          />
          <Stack.Screen name="IntroSignup" component={IntroSignupScreen} />
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
        </Stack.Navigator>
      );

    case DELETED:
      return withSafeAreaView(<SuccessAccountDeleteScreen />);

    default:
      return <></>;
  }
};

export default AppStack;

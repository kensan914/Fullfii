import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-navigation";

import Header from "../components/organisms/Header";
import HomeScreen from "../screens/Home";
import ChatScreen from "../screens/Chat";
import ProfileEditorScreen from "../screens/ProfileEditor";
import ProfileInputScreen from "../screens/ProfileInput";
import SettingsScreen from "../screens/Settings";
import AccountDeleteScreen from "../screens/AccountDelete";
import SignUpScreen from "../screens/SignUp";
import WorrySelectScreen from "../screens/WorrySelect";
import {
  useAuthState,
  AUTHENTICATED,
  UNAUTHENTICATED,
  DELETED,
  AUTHENTICATING,
} from "../components/contexts/AuthContext";
import { useProfileState } from "../components/contexts/ProfileContext";
import { useChatState } from "../components/contexts/ChatContext";
import Spinner from "../components/atoms/Spinner";
import { RootStackParamList } from "../components/types/Types";
import SuccessAccountDelete from "../screens/SuccessAccountDelete";
import { alertModal } from "../components/modules/support";
import { Alert } from "react-native";

const Stack = createStackNavigator<RootStackParamList>();

const HomeStack = () => {
  const profileState = useProfileState();
  const chatState = useChatState();

  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={() => {
          return {
            header: ({ navigation, scene }) => {
              return (
                <Header
                  name={"Home"}
                  navigation={navigation}
                  scene={scene}
                  profile={profileState.profile}
                />
              );
            },
          };
        }}
      />
      <Stack.Screen
        name="WorrySelect"
        component={WorrySelectScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              name="WorrySelect"
              navigation={navigation}
              scene={scene}
              profile={profileState.profile}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ProfileEditor"
        component={ProfileEditorScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              name="ProfileEditor"
              navigation={navigation}
              scene={scene}
              profile={profileState.profile}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ProfileInput"
        component={ProfileInputScreen}
        options={({ route }) => ({
          header: ({ navigation, scene }) => {
            const name = route.params.screen;
            return (
              <Header
                back
                name={name}
                navigation={navigation}
                scene={scene}
                profile={profileState.profile}
              />
            );
          },
        })}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => {
          return {
            header: ({ navigation, scene }) => {
              const talkTicketKey = route.params.talkTicketKey;
              const talkTicket = chatState.talkTicketCollection[talkTicketKey];
              const title = talkTicket ? talkTicket.worry.label : "";
              return (
                <Header
                  title={title}
                  name={"Chat"}
                  talkTicketKey={talkTicketKey}
                  back
                  navigation={navigation}
                  scene={scene}
                  profile={profileState.profile}
                />
              );
            },
          };
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => {
            return (
              <Header
                back
                name={"Settings"}
                navigation={navigation}
                scene={scene}
                profile={profileState.profile}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="AccountDelete"
        component={AccountDeleteScreen}
        options={{
          header: ({ navigation, scene }) => {
            return (
              <Header
                back
                name={"AccountDelete"}
                navigation={navigation}
                scene={scene}
                profile={profileState.profile}
              />
            );
          },
        }}
      />
    </Stack.Navigator>
  );
};

const AppStack: React.FC = () => {
  const authState = useAuthState();

  const render = () => {
    switch (authState.status) {
      case AUTHENTICATED:
        return (
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

      case UNAUTHENTICATED:
      case AUTHENTICATING:
        return (
          <Stack.Navigator
            // mode="card"
            mode="modal"
            headerMode="none"
            screenOptions={
              {
                // gestureEnabled: false,  // backを可能に。
              }
            }
          >
            <Stack.Screen name="SignUp">
              {() => {
                return <SignUpScreen />;
              }}
            </Stack.Screen>
          </Stack.Navigator>
        );

      case DELETED:
        return <SuccessAccountDelete />;

      default:
        return <></>;
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white" }}
      forceInset={{ bottom: "never" }}
    >
      {render()}
    </SafeAreaView>
  );
};

export default AppStack;

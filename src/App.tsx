import React, { useState, useEffect } from "react";
import { Platform, StatusBar, LogBox } from "react-native";
import { Asset } from "expo-asset";
import { GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

import Screens from "src/navigations/Screens";
import materialTheme from "src/constants/theme";
import { AuthProvider } from "src/contexts/AuthContext";
import { asyncGetItem, asyncGetJson } from "src/utils";
import { ProfileProvider } from "src/contexts/ProfileContext";
import { ChatProvider } from "src/contexts/ChatContext";
import StartUpManager from "src/screens/StartUpManager";
import {
  SignupBufferIoTs,
  SignupBuffer,
  MeProfile,
  AuthStatus,
  AuthStatusIoTs,
  TalkTicketCollection,
  TalkTicketCollectionAsyncIoTs,
  TalkTicketCollectionAsync,
  MeProfileIoTs,
} from "src/types/Types.context";
import { Assets } from "src/types/Types";
import AttManager from "src/screens/AttManager";
import { setVersion } from "src/constants/env";

LogBox.ignoreAllLogs(true);

const assetImages: { logo: number } = {
  logo: require("src/assets/images/icon/icon.jpg"),
};

function cacheImages(images: (string | number)[]): Promise<Asset>[] {
  return images.map((image) => {
    return Asset.fromModule(image).downloadAsync();
  });
}

const App: React.FC = () => {
  const [isFinishLoadingResources, setIsFinishLoadingResources] = useState(
    false
  );
  const [assets, setAssets] = useState<Assets>({});

  const loadResourcesAsync = async (): Promise<Asset[]> => {
    const images = Object.values(assetImages);
    const assetPromises = cacheImages(images);
    return Promise.all(assetPromises);
  };

  useEffect(() => {
    setVersion(false);

    loadResourcesAsync().then((assetList) => {
      const downloadedAssets: Assets = {};
      assetList.forEach((elm: Asset) => {
        if ("name" in elm) downloadedAssets[elm.name] = elm;
      });
      setAssets(downloadedAssets);
      setIsFinishLoadingResources(true);
    });
  }, []);

  return (
    <RootNavigator
      isFinishLoadingResources={isFinishLoadingResources}
      assets={assets}
    />
  );
};

type Props = {
  isFinishLoadingResources: boolean;
  assets: Assets;
};
const RootNavigator: React.FC<Props> = (props) => {
  type InitState<T> = undefined | null | T;
  const [status, setStatus] = useState<InitState<AuthStatus>>();
  const [token, setToken] = useState<InitState<string>>();
  const [signupBuffer, setSignupBuffer] = useState<InitState<SignupBuffer>>();
  const [profile, setProfile] = useState<InitState<MeProfile>>();
  const [talkTicketCollection, setTalkTicketCollection] = useState<
    InitState<TalkTicketCollection>
  >();

  useEffect(() => {
    (async () => {
      const _status = (await asyncGetItem(
        "status",
        AuthStatusIoTs
      )) as AuthStatus;
      setStatus(_status ? _status : null);
      const _token = await asyncGetItem("token");
      setToken(_token ? _token : null);
      const _signupBuffer = (await asyncGetJson(
        "signupBuffer",
        SignupBufferIoTs
      )) as SignupBuffer;
      setSignupBuffer(_signupBuffer ? _signupBuffer : null);
      const _profile = (await asyncGetJson(
        "profile",
        MeProfileIoTs
      )) as MeProfile;
      setProfile(_profile ? _profile : null);
      const _talkTicketCollectionJson = (await asyncGetJson(
        "talkTicketCollection",
        TalkTicketCollectionAsyncIoTs
      )) as TalkTicketCollectionAsync;
      setTalkTicketCollection(
        _talkTicketCollectionJson ? _talkTicketCollectionJson : null
      );
    })();
  }, []);

  if (
    typeof status === "undefined" ||
    typeof token === "undefined" ||
    typeof signupBuffer === "undefined" ||
    typeof profile === "undefined" ||
    typeof talkTicketCollection === "undefined" ||
    !props.isFinishLoadingResources
  ) {
    return <></>; // AppLording
  } else {
    setTimeout(() => {
      SplashScreen.hide();
    }, 150);

    return (
      <NavigationContainer>
        <AuthProvider status={status} token={token} signupBuffer={signupBuffer}>
          <ProfileProvider profile={profile}>
            <ChatProvider talkTicketCollection={talkTicketCollection}>
              <GalioProvider theme={materialTheme}>
                <StartUpManager>
                  <AttManager>
                    {Platform.OS === "ios" && (
                      <StatusBar barStyle="dark-content" />
                    )}
                    <Screens />
                  </AttManager>
                </StartUpManager>
              </GalioProvider>
            </ChatProvider>
          </ProfileProvider>
        </AuthProvider>
      </NavigationContainer>
    );
  }
};

export default App;

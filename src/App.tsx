import React, { useState, useEffect } from "react";
import { Platform, StatusBar, LogBox } from "react-native";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import * as t from "io-ts";

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Screens from "src/navigations/Screens";
import { AuthProvider } from "src/contexts/AuthContext";
import {
  asyncGetBool,
  asyncGetItem,
  asyncGetObject,
} from "src/utils/asyncStorage";
import { ProfileProvider } from "src/contexts/ProfileContext";
import { ChatProvider } from "src/contexts/ChatContext";
import { StartUpManager } from "src/screens/StartUpManager";
import {
  MeProfile,
  AuthStatus,
  AuthStatusIoTs,
  MeProfileIoTs,
  TalkingRoomCollectionAsync,
  TalkingRoomCollectionAsyncIoTs,
} from "src/types/Types.context";
import { Assets } from "src/types/Types";
import { DomProvider } from "src/contexts/DomContext";

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
  const [isFinishLoadingResources, setIsFinishLoadingResources] =
    useState(false);
  const [assets, setAssets] = useState<Assets>({});

  const loadResourcesAsync = async (): Promise<Asset[]> => {
    const images = Object.values(assetImages);
    const assetPromises = cacheImages(images);
    return Promise.all(assetPromises);
  };

  useEffect(() => {
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
  const [profile, setProfile] = useState<InitState<MeProfile>>();
  const [talkingRoomCollection, setTalkingRoomCollection] =
    useState<InitState<TalkingRoomCollectionAsync>>();
  const [isBanned, setIsBanned] = useState<InitState<boolean>>();

  useEffect(() => {
    (async () => {
      const _status = (await asyncGetItem(
        "status",
        AuthStatusIoTs
      )) as AuthStatus;
      setStatus(_status ? _status : null);

      const _token = await asyncGetItem("token", t.string);
      setToken(typeof _token === "string" ? _token : null);

      const _profile = (await asyncGetObject(
        "profile",
        MeProfileIoTs
      )) as MeProfile;
      setProfile(_profile ? _profile : null);

      const _talkingRoomCollection = (await asyncGetObject(
        "talkingRoomCollection",
        TalkingRoomCollectionAsyncIoTs
      )) as TalkingRoomCollectionAsync;
      setTalkingRoomCollection(
        _talkingRoomCollection ? _talkingRoomCollection : null
      );

      const _isBannedNullable = await asyncGetBool("isBanned", t.boolean);
      const _isBanned =
        typeof _isBannedNullable === "boolean" ? _isBannedNullable : null;
      setIsBanned(_isBanned !== null ? _isBanned : null);
    })();
  }, []);

  if (
    typeof status === "undefined" ||
    typeof token === "undefined" ||
    typeof profile === "undefined" ||
    typeof talkingRoomCollection === "undefined" ||
    typeof isBanned === "undefined" ||
    !props.isFinishLoadingResources
  ) {
    return <></>; // AppLording
  } else {
    setTimeout(() => {
      SplashScreen.hide();
    }, 150);

    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider status={status} token={token}>
            <ProfileProvider profile={profile} isBanned={isBanned}>
              <ChatProvider talkingRoomCollection={talkingRoomCollection}>
                <DomProvider>
                  <StartUpManager>
                    {Platform.OS === "ios" ? (
                      <StatusBar barStyle="dark-content" />
                    ) : (
                      // HACK: react-native-modal内でkeyboardを開くと意図せずavoidがかかる(Android). Androidのステータスバーを全面非表示
                      // https://github.com/react-native-modal/react-native-modal/issues/344#issuecomment-629400548
                      <StatusBar hidden />
                    )}
                    <Screens />
                    <Toast ref={(ref) => Toast.setRef(ref)} />
                  </StartUpManager>
                </DomProvider>
              </ChatProvider>
            </ProfileProvider>
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
};

export default App;

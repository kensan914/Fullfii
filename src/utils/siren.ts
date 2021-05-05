import { Alert, Linking } from "react-native";

import {
  APP_STORE_URI_ITMS_APPS,
  APP_STORE_URL,
  AS_KEY_SKIP_UPDATE_VERSION,
  isExpo,
  ITUNES_LOOKUP_URL,
} from "src/constants/env";
import requestAxios from "src/hooks/useAxios";
import { alertModal, asyncGetItem, asyncStoreItem } from "src/utils";
import { checkUpdateVersion } from "src/utils/versionUpdate";

const fetchLatestVersion = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    requestAxios(ITUNES_LOOKUP_URL, "get", null, {
      thenCallback: (_resData) => {
        const resData = _resData as any;
        if (resData.resultCount === 1) {
          const latestVersion: string = resData.results[0].version;
          resolve(latestVersion);
        } else {
          reject();
        }
      },
      catchCallback: () => {
        reject();
      },
    });
  });
};

// const fetchCurrentVersion = () => {};

type CompareVersionResult =
  | "LATEST" // ex) "3.2.28", "3.2.28"
  | "OLD_MAJOR" // ex) "3.2.28", "1.6.5"
  | "OLD_MINOR" // ex) "3.2.28", "3.1.35"
  | "OLD_MAINTENANCE" // ex) "3.2.28", "3.2.12"
  | null; // ex) "3.2.28", "3.7.8" \ "3.2.aaa", "3.2.bbb" | "3.2.28.34.1.3.4", "1.4"
const compareLatestVerWithCurrentVer = (
  _latestVersion: string,
  _currentVersion: string
): CompareVersionResult => {
  const splitVersionStringToNumber = (versionStr: string): number[] | null => {
    const versionCollection = versionStr
      .split(".")
      .map((_versionStr) => Number(_versionStr));
    if (versionCollection.includes(NaN)) return null;

    return versionCollection;
  };

  const versionCollectionLength = 3;
  const latestVersionCollection = splitVersionStringToNumber(_latestVersion);
  const currentVersionCollection = splitVersionStringToNumber(_currentVersion);
  if (
    latestVersionCollection === null ||
    currentVersionCollection === null ||
    latestVersionCollection.length !== versionCollectionLength ||
    currentVersionCollection.length !== versionCollectionLength
  )
    return null;

  const divMajorVersion =
    latestVersionCollection[0] - currentVersionCollection[0];
  if (divMajorVersion > 0) return "OLD_MAJOR";
  else if (divMajorVersion < 0) return null; // バージョン超えちゃってる

  const divMinorVersion =
    latestVersionCollection[1] - currentVersionCollection[1];
  if (divMinorVersion > 0) return "OLD_MINOR";
  else if (divMinorVersion < 0) return null; // バージョン超えちゃってる

  const divMaintenanceVersion =
    latestVersionCollection[2] - currentVersionCollection[2];
  if (divMaintenanceVersion > 0) return "OLD_MAINTENANCE";
  else if (divMaintenanceVersion < 0) return null; // バージョン超えちゃってる

  return "LATEST";
};

const attemptUpgrade = () => {
  Linking.canOpenURL(APP_STORE_URL).then((supported) => {
    Linking.openURL(APP_STORE_URL);

    if (supported) {
      Linking.openURL(APP_STORE_URI_ITMS_APPS);
    } else {
      Linking.openURL(APP_STORE_URL);
    }
  });
};

const showUpdatePrompt = (
  skipUpdateVersion: string | null,
  currentVersion: string,
  isForce: boolean
): void => {
  if (typeof isForce === "undefined" || !isForce) {
    if (skipUpdateVersion !== currentVersion) {
      Alert.alert(
        "アップデートのお知らせ",
        "各種パフォーマンスの改善を行った最新バージョンがご利用可能です。安定的にFullfiiをご利用いただくためアップデートをお願いします！",
        [
          {
            text: "アップデートする",
            onPress: () => {
              attemptUpgrade();
            },
            style: "default",
          },
          {
            text: "やめとく",
            onPress: () => {
              asyncStoreItem(AS_KEY_SKIP_UPDATE_VERSION, currentVersion);
            },
            style: "cancel",
          },
          {
            text: "後で",
            onPress: () => void 0,
            style: "cancel",
          },
        ]
      );
    }
  } else {
    alertModal({
      mainText: "アップデートのお願い",
      subText:
        "Fullfiiは、大幅な機能追加を行いました。現在のバージョンでは、正常にFullfiiをお楽しみいただけない場合がございます。お手数ですが、App Storeからアップデートをお願いします！",
      okButton: "アップデート",
      onPress: () => {
        attemptUpgrade();
      },
      cancelable: false,
    });
  }
};

const exeSiren = async (): Promise<void> => {
  if (!isExpo) {
    const latestVersion = await fetchLatestVersion();
    const DeviceInfoModule = await import("react-native-device-info");
    const DeviceInfo = DeviceInfoModule.default;
    const currentVersion = DeviceInfo.getVersion();
    const skipUpdateVersion = await asyncGetItem(AS_KEY_SKIP_UPDATE_VERSION);

    const compareVersionResult = compareLatestVerWithCurrentVer(
      latestVersion,
      currentVersion
    );
    if (compareVersionResult === null) return;
    switch (compareVersionResult) {
      case "OLD_MAJOR":
      case "OLD_MINOR":
        showUpdatePrompt(skipUpdateVersion, currentVersion, true);
        break;
      case "OLD_MAINTENANCE":
        showUpdatePrompt(skipUpdateVersion, currentVersion, false);
        break;
      case "LATEST":
        // アップデート直後だった場合、任意の処理を実行
        checkUpdateVersion();
        break;
      default:
        console.error(
          `compareVersionResult(${compareVersionResult}) is not supported.`
        );
        break;
    }
  }
};

export default exeSiren;

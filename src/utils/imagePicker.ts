import * as ImagePicker from "expo-image-picker";
import { Linking, Platform } from "react-native";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import deviceInfoModule from "react-native-device-info";
import IntentLauncher from "react-native-intent-launcher";

import { alertModal } from "src/utils";

const pkg = deviceInfoModule.getBundleId();
const openAppSettings = () => {
  if (Platform.OS === "ios") {
    Linking.openURL("app-settings:");
  } else {
    IntentLauncher.startActivity({
      action: "android.settings.APPLICATION_DETAILS_SETTINGS",
      data: "package:" + pkg,
    });
  }
};

export const getPermissionAsync = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
  if (status !== "granted") {
    alertModal({
      mainText: "写真への許可が無効になっています",
      subText: "設定画面へ移動しますか？",
      cancelButton: "キャンセル",
      okButton: "設定する",
      onPress: () => {
        openAppSettings();
      },
    });
    return false;
  } else return true;
};

export const pickImage = async (): Promise<ImageInfo | undefined> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });
  if (!result.cancelled) {
    return result;
  }
};

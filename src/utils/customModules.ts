import { Alert, AlertButton, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import ActionSheet from "react-native-action-sheet";
import { Animation, CustomAnimation } from "react-native-animatable";

type alertModalProps = {
  mainText: string;
  subText?: string;
  cancelButton?: string;
  okButton?: string;
  okButtonStyle?: "destructive" | "default" | "cancel" | undefined;
  onPress?: () => void;
  onCancel?: () => void;
  cancelable?: boolean;
};
/**
 *  @example
    alertModal({
      mainText: alertTitle,
      subText: alertText,
      cancelButton: "キャンセル",
      okButton: "送信する",
      onPress: () => {
        navigation.navigate("Home");
      },
      cancelOnPress: () => {}, // 任意. キャンセルを押した際の付加処理
    });
 */
export const alertModal = ({
  mainText,
  subText,
  okButton,
  okButtonStyle = "default",
  onPress = () => void 0,
  cancelButton,
  onCancel = () => void 0,
  cancelable,
}: alertModalProps): void => {
  const buttonSettings: AlertButton[] = [];
  (typeof cancelable === "undefined" || cancelable) &&
    buttonSettings.push({
      text: cancelButton ? cancelButton : "キャンセル",
      onPress: onCancel,
      style: "cancel",
    });

  buttonSettings.push({
    text: okButton ? okButton : "OK",
    onPress: onPress,
    style: okButtonStyle,
  });

  Alert.alert(mainText ? mainText : "", subText ? subText : "", buttonSettings);
};

export type ActionSheetSettings = {
  label: string;
  onPress?: () => void;
  cancel?: boolean; // 最低でも一つまで (必ずtrue指定)
  destructive?: boolean; // 最低でも一つまで (必ずtrue指定)
}[];
/**
 * cancel, destructiveは一つまで (必ずtrue指定)
 * @param settings
 * @example 
    showActionSheet([
      {
        label: "キャンセル",
        cancel: true,
      },
      {
        label: "修正する",
        onPress: () => {},
      },
      {
        label: "削除する",
        destructive: true,
        onPress: () => {},
      },
    ]);
 */
export const showActionSheet = (settings: ActionSheetSettings): void => {
  ActionSheet.showActionSheetWithOptions(
    {
      options: settings.map((setting) => setting.label),
      destructiveButtonIndex: settings.findIndex(
        (setting) => setting.destructive
      ),
      cancelButtonIndex: settings.findIndex((setting) => setting.cancel),
    },
    (buttonIndex) => {
      const setting = settings ? settings[buttonIndex] : void 0;
      typeof setting?.onPress !== "undefined" && setting.onPress();
    }
  );
};

export type ShowToastSettings = {
  type?: "success" | "error" | "info";
  position?: "top" | "bottom";
  text1: string;
  text2?: string;
  visibilityTime?: number;
  autoHide?: boolean;
  topOffset?: number;
  bottomOffset?: number;
  onShow?: () => void;
  onHide?: () => void;
  onPress?: () => void;
};
/**
 * custom Toast.show()
 */
export const showToast = (settings: ShowToastSettings): void => {
  Toast.show({
    ...settings,
    type: typeof settings.type !== "undefined" ? settings.type : "success",
    topOffset: getStatusBarHeight() + 10,
  });
};

export const geneFadeModalProps = (
  isForceFadeAnimation?: boolean
): {
  animationIn?: Animation | CustomAnimation;
  animationInTiming?: number;
  animationOut?: Animation | CustomAnimation;
  animationOutTiming?: number;
} => {
  return Platform.OS === "ios" || isForceFadeAnimation
    ? {
        animationIn: "fadeIn",
        animationInTiming: 300,
        animationOut: "fadeOut",
        animationOutTiming: 300,
      }
    : {};
};

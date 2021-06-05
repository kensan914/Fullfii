import { ActionSheetIOS } from "react-native";
import Toast from "react-native-toast-message";
import { getStatusBarHeight } from "react-native-iphone-x-helper";

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
 * showActionSheet([
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
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: settings.map((setting) => setting.label),
      destructiveButtonIndex: settings.findIndex(
        (setting) => setting.destructive
      ),
      cancelButtonIndex: settings.findIndex((setting) => setting.cancel),
    },
    (buttonIndex) => {
      const setting = settings[buttonIndex];
      typeof setting.onPress !== "undefined" && setting.onPress();
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
    topOffset: getStatusBarHeight() + 10,
  });
};

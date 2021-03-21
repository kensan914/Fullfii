import { request, PERMISSIONS } from "react-native-permissions";

export const requestPermissionAppTrackingTransparency = (): void => {
  // reference: https://github.com/zoontek/react-native-permissions
  request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then((result) => {
    // …
  });
};

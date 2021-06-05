import { request, PERMISSIONS, check, RESULTS } from "react-native-permissions";

export const requestPermissionATT = (): void => {
  // reference: https://github.com/zoontek/react-native-permissions
  request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then((result) => {
    // …
  });
};

export const checkPermissionATT = (
  onNeedToRequest: () => void,
  onNoNeedToRequest: () => void
): void => {
  check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then((result) => {
    switch (result) {
      case RESULTS.DENIED:
        onNeedToRequest();
        break;
      case RESULTS.UNAVAILABLE:
      case RESULTS.LIMITED:
      case RESULTS.GRANTED:
      case RESULTS.BLOCKED:
        onNoNeedToRequest();
        break;
    }
  });
};

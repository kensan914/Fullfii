import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

/**
 * リクエストは行わず, 「既に設定され, かつ許可されている」かを判定.
 * @returns
 */
export const hasPermissionOfPN = async (): Promise<boolean> => {
  const authStatus = await messaging().hasPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
};
/**
 * リクエストは行わず, 「未だ通知設定がされていない」かを判定.
 * @returns
 */
export const hasChosenPermissionOfPN = async (): Promise<boolean> => {
  const authStatus = await messaging().hasPermission();
  return authStatus !== messaging.AuthorizationStatus.NOT_DETERMINED;
};

const requestPermissionOfIosPN = async (): Promise<boolean> => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

const configurePushNotification = (
  onlyConfig?: boolean /* requestPermission */
): Promise<null | string> => {
  const initPushNotification = async (): Promise<null | string> => {
    if (onlyConfig) {
      return initFcm();
    } else {
      const enabled = await requestPermissionOfIosPN();

      if (enabled) {
        return initFcm();
      } else {
        return initFcm();
      }
    }
  };

  const initFcm = async (): Promise<null | string> => {
    const _deviceToken = await messaging().getToken();

    PushNotification.configure({
      requestPermissions: false,
      onNotification: (notification) => {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
    });

    messaging().onTokenRefresh(() => {
      //
    });
    messaging().onMessage((message) => {
      _localNotification(message);
      // // badge=1が送信されるが, Foregroundであるためリセット
      // PushNotification.setApplicationIconBadgeNumber(0);
    });

    return _deviceToken;
  };

  const _localNotification = (
    message: FirebaseMessagingTypes.RemoteMessage
  ): void => {
    PushNotification.localNotification({
      title: message?.notification?.title ? message.notification.title : "",
      message: message?.notification?.body ? message.notification.body : "",
    });
  };

  const deviceToken = initPushNotification();
  return deviceToken;
};

export default configurePushNotification;

export const updateBudgeCount = (count: number): void => {
  PushNotification.getApplicationIconBadgeNumber(
    (currentBadgeCount: number): void => {
      if (currentBadgeCount > 0) {
        PushNotification.setApplicationIconBadgeNumber(count);
      }
    }
  );
};

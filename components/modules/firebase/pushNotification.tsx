import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

const requestPermissionOfIOSPushNotification = async (): Promise<boolean> => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

const configurePushNotification = (): Promise<null | string> => {
  const initPushNotification = async (): Promise<null | string> => {
    const enabled = await requestPermissionOfIOSPushNotification();

    if (enabled) {
      return initFcm();
    } else {
      return initFcm();
    }
  };

  const initFcm = async (): Promise<null | string> => {
    const _deviceToken = await messaging().getToken();

    PushNotification.configure({
      requestPermissions: false,
      onNotification: (notification) => {
        console.log("プッシュ通知をタップした");
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
    });

    messaging().onTokenRefresh(() => {
      console.log("トークンリフレッシュ");
    });
    messaging().onMessage((message) => {
      console.log("Foreground時にリモートプッシュ通知を受信した");
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
      userInfo: message.data,
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

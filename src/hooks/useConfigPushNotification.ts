import { useEffect, useRef, useState } from "react";

import { isExpo } from "src/constants/env";
import { useAuthState } from "src/contexts/AuthContext";
import { useProfileState } from "src/contexts/ProfileContext";
import { useRequestPatchMe } from "src/hooks/requests/useRequestMe";
import configurePushNotification, {
  hasPermissionOfIOSPushNotification,
} from "src/utils/firebase/pushNotification";

type UseConfigPushNotification = () => {
  configPushNotification: () => void;
  isPermission: boolean;
};
export const useConfigPushNotification: UseConfigPushNotification = () => {
  const profileState = useProfileState();
  const authState = useAuthState();

  const isConfiguredPushNotification = useRef(false);
  const { requestPatchMe } = useRequestPatchMe(() => {
    isConfiguredPushNotification.current = true;
  });

  const [isPermission, setIsPermission] = useState(false);
  useEffect(() => {
    (async () => {
      const _isPermission = await hasPermissionOfIOSPushNotification();
      // alert(_isPermission);
      setIsPermission(_isPermission);
    })();
  }, []);

  const [isRequiredConfigPN, seIsRequiredConfigPN] = useState(false);
  useEffect(() => {
    seIsRequiredConfigPN(
      !!profileState.profile &&
        !isExpo &&
        !isConfiguredPushNotification.current &&
        !!authState.token &&
        authState.status === "Authenticated"
    );
  }, [
    profileState.profile,
    isExpo,
    isConfiguredPushNotification.current,
    authState.token,
    authState.status,
  ]);

  /**プッシュ通知設定ダイアログを表示
   *
   * 前提条件: profile準備完了 && expoじゃない && pushNotification未設定 && アカウント作成済み && サインアップ終了
   * 最終条件: 取得したdeviceTokenがprofile.deviceTokenと不一致 (未だ登録されていない)
   */
  const configPushNotification = () => {
    if (isRequiredConfigPN) {
      (async () => {
        const deviceToken = await configurePushNotification();

        if (deviceToken) {
          if (profileState.profile.deviceToken !== deviceToken) {
            // post deviceToken
            authState.token &&
              requestPatchMe({ data: { device_token: deviceToken } });
          }
          setIsPermission(true);
        }
      })();
    }
  };

  // アプリ起動時, 通知許可していた場合に通知設定のみを行う.
  useEffect(() => {
    if (isRequiredConfigPN && isPermission) {
      configurePushNotification(true);
    }
  }, [isRequiredConfigPN, isPermission]);

  return {
    configPushNotification,
    isPermission,
  };
};

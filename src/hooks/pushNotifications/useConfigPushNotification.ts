import { useEffect, useRef, useState } from "react";

import { isExpo } from "src/constants/env";
import { useAuthState } from "src/contexts/AuthContext";
import { useDomDispatch } from "src/contexts/DomContext";
import { useProfileState } from "src/contexts/ProfileContext";
import { useRequestPatchMe } from "src/hooks/requests/useRequestMe";
import configurePushNotification from "src/utils/firebase/pushNotification";

type UseConfigPushNotification = () => {
  configPushNotification: (isOnlyGetDeviceToken?: boolean) => void;
  isRequiredConfigPN: boolean;
};
export const useConfigPushNotification: UseConfigPushNotification = () => {
  const profileState = useProfileState();
  const authState = useAuthState();
  const domDispatch = useDomDispatch();

  const isConfiguredPushNotification = useRef(false);
  const { requestPatchMe } = useRequestPatchMe(() => {
    isConfiguredPushNotification.current = true;
  });

  const [isRequiredConfigPN, _setIsRequiredConfigPN] = useState(false);
  const isRequiredConfigPNRef = useRef(false);
  const setIsRequiredConfigPN = (val: boolean): void => {
    isRequiredConfigPNRef.current = val;
    _setIsRequiredConfigPN(val);
  };
  useEffect(() => {
    setIsRequiredConfigPN(
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
  const configPushNotification = (isOnlyGetDeviceToken?: boolean) => {
    if (isRequiredConfigPNRef.current) {
      (async () => {
        const deviceToken = await configurePushNotification(
          isOnlyGetDeviceToken
        );

        if (deviceToken) {
          if (profileState.profile.deviceToken !== deviceToken) {
            // post deviceToken
            authState.token &&
              requestPatchMe({ data: { device_token: deviceToken } });
          }
          domDispatch({ type: "CONFIGURED_PUSH_NOTIFICATION" });
        }
      })();
    }
  };

  return {
    configPushNotification,
    isRequiredConfigPN,
  };
};

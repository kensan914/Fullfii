import { useEffect } from "react";

import { useDomDispatch, useDomState } from "src/contexts/DomContext";
import {
  hasChosenPermissionOfPN,
  hasPermissionOfPN,
} from "src/utils/firebase/pushNotification";
import { useConfigPushNotification } from "src/hooks/pushNotifications/useConfigPushNotification";

export const usePushNotificationParams = (): void => {
  const domState = useDomState();
  const domDispatch = useDomDispatch();

  const { isRequiredConfigPN, configPushNotification } =
    useConfigPushNotification();

  const setPushNotificationParams = async () => {
    const _isPermission = await hasPermissionOfPN();
    const _isChosenPermission = await hasChosenPermissionOfPN();

    domDispatch({
      type: "SET_PUSH_NOTIFICATION_PARAMS",
      isPermission: _isPermission,
      isChosenPermission: _isChosenPermission,
    });
  };
  // mount時, 初期設定
  useEffect(() => {
    setPushNotificationParams();
  }, []);

  // push通知設定時. pushNotificationParamsを更新.
  useEffect(() => {
    if (domState.pushNotificationParams.isChanged) {
      setPushNotificationParams();
      domDispatch({ type: "FINISH_SET_PUSH_NOTIFICATION_PARAMS" });
    }
  }, [domState.pushNotificationParams.isChanged]);

  // アプリ起動時, 既に通知許可していた場合に通知設定のみを行う（deviceTokenの照合）.
  useEffect(() => {
    if (isRequiredConfigPN && domState.pushNotificationParams.isPermission) {
      configPushNotification(true);
    }
  }, [isRequiredConfigPN, domState.pushNotificationParams.isPermission]);
};

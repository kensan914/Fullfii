import { useEffect } from "react";

import { useDomDispatch, useDomState } from "src/contexts/DomContext";
import configurePushNotification, {
  hasPermissionOfIOSPushNotification,
} from "src/utils/firebase/pushNotification";
import { useConfigPushNotification } from "src/hooks/useConfigPushNotification";

export const useInitPushNotification = (): void => {
  const domState = useDomState();
  const domDispatch = useDomDispatch();

  const { isRequiredConfigPN } = useConfigPushNotification();

  useEffect(() => {
    (async () => {
      const _isPermission = await hasPermissionOfIOSPushNotification();
      // alert(_isPermission);
      domDispatch({ type: "SET_IS_PERMISSION", isPermission: _isPermission });
    })();
  }, []);

  // アプリ起動時, 通知許可していた場合に通知設定のみを行う.
  useEffect(() => {
    if (isRequiredConfigPN && domState.pushNotificationParams.isPermission) {
      configurePushNotification(true);
    }
  }, [isRequiredConfigPN, domState.pushNotificationParams.isPermission]);
};

import React, { useEffect } from "react";
import { Block } from "galio-framework";

import { exeSiren } from "src/utils/siren";
import { useRequestGetMe } from "src/hooks/requests/useRequestMe";
import { useAuthState } from "src/contexts/AuthContext";
import { useWsNotification } from "src/screens/StartUpManager/useWsNotification";
import { useRequestGetTalkInfo } from "src/hooks/requests/useRequestTalkInfo";
import { useUpdateTalk } from "src/screens/StartUpManager/useUpdateTalk";
import { usePushNotificationParams } from "src/hooks/pushNotifications/usePushNotificationParams";
import { useConfigPushNotification } from "src/hooks/pushNotifications/useConfigPushNotification";
import { useDomState } from "src/contexts/DomContext";

export const StartUpManager: React.FC = (props) => {
  const { children } = props;

  const authState = useAuthState();
  const domState = useDomState();

  const { requestGetMe } = useRequestGetMe();
  const { updateTalk } = useUpdateTalk();
  const { requestGetTalkInfo } = useRequestGetTalkInfo((talkInfoJson) => {
    // 受け取った最新のトーク情報を各stateに適用
    updateTalk(talkInfoJson);
  });
  const { connectWsNotification } = useWsNotification();

  // 通知許可
  usePushNotificationParams();
  const { configPushNotification } = useConfigPushNotification();

  useEffect(() => {
    // ログイン済みでアプリを起動した時、またはsignup成功時に実行
    if (authState.token && authState.status === "Authenticated") {
      exeSiren();
      requestGetMe();
      requestGetTalkInfo();
      connectWsNotification();

      if (!domState.pushNotificationParams.isChosenPermission) {
        configPushNotification();
      }
    }
  }, [authState.token, authState.status]);

  return <Block flex>{children}</Block>;
};

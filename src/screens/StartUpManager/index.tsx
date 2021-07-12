import React, { useEffect } from "react";
import { Block } from "galio-framework";

// import exeSiren from "src/utils/siren";
import { useRequestGetMe } from "src/hooks/requests/useRequestMe";
import { useAuthState } from "src/contexts/AuthContext";
import { useWsNotification } from "./useWsNotification";
import { useRequestGetTalkInfo } from "src/hooks/requests/useRequestTalkInfo";
import { useUpdateTalk } from "./useUpdateTalk";
import { usePushNotificationParams } from "src/hooks/pushNotifications/usePushNotificationParams";

export const StartUpManager: React.FC = (props) => {
  const { children } = props;

  const authState = useAuthState();

  const { requestGetMe } = useRequestGetMe();
  const { updateTalk } = useUpdateTalk();
  const { requestGetTalkInfo } = useRequestGetTalkInfo((talkInfoJson) => {
    // 受け取った最新のトーク情報を各stateに適用
    updateTalk(talkInfoJson);
  });
  const { connectWsNotification } = useWsNotification();
  usePushNotificationParams();
  useEffect(() => {
    // ログイン済みでアプリを起動した時、またはsignup成功時に実行
    if (authState.token) {
      // exeSiren(); // TODO: Android
      requestGetMe();
      requestGetTalkInfo();
      connectWsNotification();
    }
  }, [authState.token]);

  return <Block flex>{children}</Block>;
};

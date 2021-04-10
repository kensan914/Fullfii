import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";

import { AuthDispatch } from "../../types/Types.context";
import { asyncRemoveItem } from "../support";
import { CONTACT_US_URL } from "../../../constants/env";

/**
 * async storageからtokenを含む全ての認証情報を削除するため復帰ができません。
 */
export const dangerouslyDeleteAuth = (): void => {
  asyncRemoveItem("status");
  asyncRemoveItem("token");
  asyncRemoveItem("signupBuffer");
  asyncRemoveItem("talkTicketCollection");
  asyncRemoveItem("versionNum");
};

export const alertDeleteAuth = (
  authDispatch: AuthDispatch,
  title?: string,
  subTitle?: string
): void => {
  const finalVerification = () => {
    Alert.alert(
      "本当に削除してもよろしいですか？",
      "一度端末から削除したアカウントはもとに戻すことができません。もしお心当たりがない方は削除せずにFullfiiへお問い合わせください。",
      [
        {
          text: "端末上のデータを完全に削除する",
          onPress: () => {
            // AsyncStorage削除・auth state初期化
            authDispatch({ type: "DANGEROUSLY_DELETE_AUTH" });
          },
          style: "destructive",
        },
        {
          text: "キャンセル",
          onPress: () => {
            alertDeleteAuth(authDispatch);
          },
          style: "cancel",
        },
      ]
    );
  };

  Alert.alert(
    title ? title : "あなたのユーザアカウントが見つかりません",
    subTitle
      ? subTitle
      : "アカウント削除依頼を受け、管理者がアカウントを削除した可能性があります。もしお心当たりがない方は端末上のデータを削除せずにFullfiiへお問い合わせください。",
    [
      {
        text: "端末上のデータを完全に削除する",
        onPress: () => {
          finalVerification();
        },
        style: "destructive",
      },
      {
        text: "心当たりがないため問い合わせる",
        onPress: () => {
          (async () => {
            await WebBrowser.openBrowserAsync(CONTACT_US_URL);
            alertDeleteAuth(authDispatch);
          })();
        },
        style: "cancel",
      },
    ]
  );
};

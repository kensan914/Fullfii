import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";

import { Dispatches } from "../../types/Types.context";
import { asyncRemoveItem } from "../support";
import { CONTACT_US_URL } from "../../../constants/env";

/**
 * async storageからtokenを含む全ての認証情報を削除するため復帰ができません。
 * 加えて、各stateもリセットされる
 */
export const dangerouslyDelete = (dispatches: Dispatches): void => {
  asyncRemoveItem("status");
  asyncRemoveItem("token");
  asyncRemoveItem("signupBuffer");
  asyncRemoveItem("talkTicketCollection");
  asyncRemoveItem("versionNum");

  dispatches.authDispatch({ type: "DANGEROUSLY_RESET" });
  dispatches.chatDispatch({ type: "DANGEROUSLY_RESET" });
  dispatches.profileDispatch({
    type: "DANGEROUSLY_RESET_OTHER_THAN_PROFILE_PARAMS",
  });
};

export const alertDeleteAuth = (
  dispatches: Dispatches,
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
            dangerouslyDelete(dispatches);
          },
          style: "destructive",
        },
        {
          text: "キャンセル",
          onPress: () => {
            alertDeleteAuth(dispatches);
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
            alertDeleteAuth(dispatches);
          })();
        },
        style: "cancel",
      },
    ]
  );
};

import * as WebBrowser from "expo-web-browser";

import { Dispatches } from "src/types/Types.context";
import { alertModal } from "src/utils";
import { CONTACT_US_URL } from "src/constants/env";
import { AsyncStorageKey, asyncRemoveItem } from "src/utils/asyncStorage";

/**
 * async storageからtokenを含む全ての認証情報を削除するため復帰ができません。
 * 加えて、各stateもリセットされる
 */
export const dangerouslyDelete = (
  dispatches: Dispatches,
  excludeKeys?: string[]
): void => {
  const willRemoveItemKeys: AsyncStorageKey[] = [
    "status",
    "token",
    "talkingRoomCollection",
    "profile",
    "versionNum",
    "skipUpdateVersion",
  ];
  willRemoveItemKeys.forEach((willRemoveItemKey) => {
    if (!excludeKeys?.includes(willRemoveItemKey)) {
      asyncRemoveItem(willRemoveItemKey);
    }
  });

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
    alertModal({
      mainText: "本当に削除してもよろしいですか？",
      subText:
        "一度端末から削除したアカウントはもとに戻すことができません。もしお心当たりがない方は削除せずにFullfiiへお問い合わせください。",
      cancelButton: "キャンセル",
      okButton: "端末上のデータを完全に削除する",
      okButtonStyle: "destructive",
      onPress: () => {
        // AsyncStorage削除・auth state初期化
        dangerouslyDelete(dispatches);
      },
      onCancel: () => {
        alertDeleteAuth(dispatches);
      },
    });
  };

  alertModal({
    mainText: title ? title : "あなたのユーザアカウントが見つかりません",
    subText: subTitle
      ? subTitle
      : "アカウント削除依頼を受け、管理者がアカウントを削除した可能性があります。もしお心当たりがない方は端末上のデータを削除せずにFullfiiへお問い合わせください。",
    cancelButton: "心当たりがないため問い合わせる",
    okButton: "端末上のデータを完全に削除する",
    okButtonStyle: "destructive",
    onPress: () => {
      finalVerification();
    },
    onCancel: () => {
      (async () => {
        await WebBrowser.openBrowserAsync(CONTACT_US_URL);
        alertDeleteAuth(dispatches);
      })();
    },
  });
};

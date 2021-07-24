import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Dispatches } from "src/types/Types.context";
import { CONTACT_US_URL } from "src/constants/env";
import {
  AsyncStorageKey,
  AsyncStorageKeyString,
  AsyncStorageKeyBool,
  AsyncStorageKeyObject,
  asyncGetItem,
  asyncGetBool,
  asyncGetObject,
  asyncStoreItem,
  asyncStoreBool,
  asyncStoreObject,
} from "src/utils/asyncStorage";
import { alertModal } from "../customModules";

/**
 * async storageからtokenを含む全ての認証情報を削除するため復帰ができません。
 * 加えて、各stateもリセットされる
 */
export const dangerouslyDelete = async (
  dispatches: Dispatches,
  _excludeKeysString?: AsyncStorageKeyString[],
  _excludeKeysBool?: AsyncStorageKeyBool[],
  _excludeKeysObject?: AsyncStorageKeyObject[]
): Promise<void> => {
  const excludeKeysString =
    typeof _excludeKeysString !== "undefined" ? _excludeKeysString : [];
  const excludeKeysBool =
    typeof _excludeKeysBool !== "undefined" ? _excludeKeysBool : [];
  const excludeKeysObject =
    typeof _excludeKeysObject !== "undefined" ? _excludeKeysObject : [];

  // 永久データ: ("isBanned",) は除外
  excludeKeysBool.push("isBanned");

  // 永久データをバッファに避難
  const fetchExcludeBuffer = async (
    excludeKeys: AsyncStorageKey[],
    asyncGet: any
  ): Promise<{ key: AsyncStorageKey; value: unknown }[]> => {
    const excludeBuffer: { key: AsyncStorageKey; value: unknown }[] = [];
    for (const excludeKey of excludeKeys) {
      const value = await asyncGet(excludeKey);
      excludeBuffer.push({ key: excludeKey, value: value });
    }
    return excludeBuffer;
  };
  const excludeBufferString = await fetchExcludeBuffer(
    excludeKeysString,
    asyncGetItem
  );
  const excludeBufferBool = await fetchExcludeBuffer(
    excludeKeysBool,
    asyncGetBool
  );
  const excludeBufferObject = await fetchExcludeBuffer(
    excludeKeysObject,
    asyncGetObject
  );

  // クリア
  await AsyncStorage.clear();

  // 永久データの復元
  const storeExcludeBuffer = async (
    excludeBuffer: { key: AsyncStorageKey; value: unknown }[],
    asyncSet: any
  ): Promise<void> => {
    excludeBuffer.forEach(async (partOfExcludeBuffer) => {
      await asyncSet(partOfExcludeBuffer.key, partOfExcludeBuffer.value);
    });
  };
  await storeExcludeBuffer(excludeBufferString, asyncStoreItem);
  await storeExcludeBuffer(excludeBufferBool, asyncStoreBool);
  await storeExcludeBuffer(excludeBufferObject, asyncStoreObject);

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

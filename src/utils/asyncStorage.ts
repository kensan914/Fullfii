import AsyncStorage from "@react-native-async-storage/async-storage";
import { isRight } from "fp-ts/lib/Either";

import { TypeIoTsOfResData } from "src/types/Types";
import { TalkingRoomCollection } from "src/types/Types.context";
import { deepCopy } from "src/utils";

export type AsyncStorageKeyString =
  | "token"
  | "password"
  | "status"
  | "versionNum"
  | "skipUpdateVersion";
export type AsyncStorageKeyBool = "isBanned" | "isReviewed";
export type AsyncStorageKeyObject =
  | "profile"
  | "talkingRoomCollection"
  | "signupBuffer";
export type AsyncStorageKeyObjectIncludeId = "messageHistory";
export type AsyncStorageKey =
  | AsyncStorageKeyString
  | AsyncStorageKeyBool
  | AsyncStorageKeyObject
  | AsyncStorageKeyObjectIncludeId;

export const asyncStoreItem = async (
  key: AsyncStorageKeyString,
  value: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(error);
  }
};

export const asyncStoreBool = async (
  key: AsyncStorageKeyBool,
  value: boolean
): Promise<void> => {
  await asyncStoreItem(key as AsyncStorageKeyString, JSON.stringify(value));
};

export const asyncStoreObject = async (
  key: AsyncStorageKeyObject,
  value: Record<string, unknown> | unknown[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

/** keyにIDを含むデータのストア (object限定) */
export const asyncStoreObjectIncludeId = async (
  key: AsyncStorageKeyObjectIncludeId,
  id: string,
  value: Record<string, unknown> | unknown[]
): Promise<void> => {
  try {
    await asyncStoreObject(`${key}_${id}` as AsyncStorageKeyObject, value);
  } catch (error) {
    console.error(error);
  }
};

/**
 * async storageからstringをget.
 * type checkがleftでもobjectを返しエラーのみ出力する.
 * (アップデート時, 古いデータがleftされる可能性がある & async storageのデータはAPIレスより安全であると判断)
 **/
export const asyncGetItem = async (
  key: AsyncStorageKeyString,
  typeIoTsOfResData?: TypeIoTsOfResData
): Promise<string | null> => {
  try {
    const str = await AsyncStorage.getItem(key);
    if (str === null) return null;
    if (typeof typeIoTsOfResData !== "undefined") {
      const typeIoTsResult = typeIoTsOfResData.decode(str);
      if (!isRight(typeIoTsResult)) {
        console.group();
        console.error(
          `Type does not match(asyncGetItem). key is "${key}". value can be found below.`
        );
        console.error(str);
        console.groupEnd();
        return str;
      }
    }
    return str;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const asyncGetBool = async (
  key: AsyncStorageKeyBool,
  typeIoTsOfResData?: TypeIoTsOfResData
): Promise<boolean | null> => {
  try {
    const str = await AsyncStorage.getItem(key);
    if (str === null) return null;

    const item = JSON.parse(str);

    if (typeof typeIoTsOfResData !== "undefined") {
      const typeIoTsResult = typeIoTsOfResData.decode(item);
      if (!isRight(typeIoTsResult)) {
        console.group();
        console.error(
          `Type does not match(asyncGetItem). key is "${key}". value can be found below.`
        );
        console.error(item);
        console.groupEnd();
        return item;
      }
    }
    return item;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * async storageからobjectをget.
 * type checkがleftでもobjectを返しエラーのみ出力する.
 * (アップデート時, 古いデータがleftされる可能性がある & async storageのデータはAPIレスより安全であると判断)
 **/
export const asyncGetObject = async (
  key: AsyncStorageKeyObject,
  typeIoTsOfResData: TypeIoTsOfResData
): Promise<Record<string, unknown> | unknown[] | null> => {
  try {
    const json = await AsyncStorage.getItem(key);

    if (json === null) return null;
    else {
      // JSにおけるJSONパースは, デフォルトではDateオブジェクトの復元ができないので対応.
      const obj = JSON.parse(json, function (key, value) {
        const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,}|)Z$/;
        if (typeof value === "string" && dateFormat.test(value)) {
          return new Date(value);
        } else {
          return value;
        }
      });

      // deepCvtKeyFromSnakeToCamel()かけると, Dateオブジェクトが空オブジェクトになってしまうので見送り (async storageのデータは全てキャメルケース想定).

      const typeIoTsResult = typeIoTsOfResData.decode(obj);

      if (isRight(typeIoTsResult)) {
        return obj;
      } else {
        console.group();
        console.error(
          `Type does not match(asyncGetJson). key is "${key}". value can be found below.`
        );
        console.error({ ...obj });
        console.groupEnd();
        return obj;
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** keyにIDを含むデータのフェッチ (object限定) */
export const asyncGetObjectIncludeId = async (
  key: AsyncStorageKeyObjectIncludeId,
  id: string,
  typeIoTsOfResData: TypeIoTsOfResData
): Promise<Record<string, unknown> | unknown[] | null> => {
  return await asyncGetObject(
    `${key}_${id}` as AsyncStorageKeyObject,
    typeIoTsOfResData
  );
};

export const asyncRemoveItem = async (key: AsyncStorageKey): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};

export const asyncRemoveItemIncludeId = async (
  key: AsyncStorageKeyObjectIncludeId,
  id: string
): Promise<void> => {
  asyncRemoveItem(`${key}_${id}` as AsyncStorageKeyObject);
};

export const asyncStoreTalkingRoomCollection = async (
  talkingRoomCollection: TalkingRoomCollection
): Promise<void> => {
  const _talkingRoomCollection: TalkingRoomCollection = deepCopy(
    talkingRoomCollection,
    ["ws", "time", "createdAt"]
  ) as TalkingRoomCollection; // deep copy

  Object.keys(_talkingRoomCollection).forEach((key) => {
    _talkingRoomCollection[key].ws = null;
  });

  asyncStoreObject("talkingRoomCollection", _talkingRoomCollection);
};

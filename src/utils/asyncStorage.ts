import AsyncStorage from "@react-native-async-storage/async-storage";
import { isRight } from "fp-ts/lib/Either";

import { TypeIoTsOfResData } from "src/types/Types";
import { TalkingRoomCollection } from "src/types/Types.context";
import { deepCopy } from "src/utils";

export type AsyncStorageKey =
  | "token"
  | "password"
  | "status"
  | "profile"
  | "talkingRoomCollection"
  | "versionNum"
  | "skipUpdateVersion";

export const asyncStoreItem = async (
  key: AsyncStorageKey,
  value: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(error);
  }
};

export const asyncStoreObject = async (
  key: AsyncStorageKey,
  value: Record<string, unknown>
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
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
  key: AsyncStorageKey,
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

/**
 * async storageからobjectをget.
 * type checkがleftでもobjectを返しエラーのみ出力する.
 * (アップデート時, 古いデータがleftされる可能性がある & async storageのデータはAPIレスより安全であると判断)
 **/
export const asyncGetObject = async (
  key: AsyncStorageKey,
  typeIoTsOfResData: TypeIoTsOfResData
): Promise<Record<string, unknown> | null> => {
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

export const asyncRemoveItem = async (key: AsyncStorageKey): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};

export const asyncRemoveAll = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error(error);
  }
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

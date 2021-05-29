import { VERSION_NUM } from "src/constants/env";
import { TalkTicketCollectionJsonIoTs } from "src/types/Types.context";
import {
  asyncGetItem,
  asyncGetObject,
  asyncRemoveItem,
  asyncStoreItem,
} from "src/utils/asyncStorage";

export const checkUpdateVersion = async (): Promise<void | null> => {
  const versionNumKey = "versionNum";
  const _versionNumOrStr = await asyncGetItem(versionNumKey);

  if (_versionNumOrStr === null) {
    // 新規ユーザ or 既存ユーザ(v2.0.0時点)
    if (
      await asyncGetObject("talkTicketCollection", TalkTicketCollectionJsonIoTs)
    ) {
      // 既存ユーザ(v2.0.0時点)
      onUpdateVersion(200);
      asyncStoreItem(versionNumKey, VERSION_NUM.toString());
    } else {
      // 新規ユーザ
      asyncStoreItem(versionNumKey, VERSION_NUM.toString());
    }
  } else {
    if (!Number.isNaN(_versionNumOrStr)) {
      const _versionNum = Number(_versionNumOrStr);
      if (_versionNum < VERSION_NUM) {
        // アップデートした
        onUpdateVersion(_versionNum);
        asyncStoreItem(versionNumKey, VERSION_NUM.toString());
      } else {
        // 最新バージョン(通常時)
      }
    }
  }

  return null;
};

/**
 * バージョンアップした時に1回だけ実行させたい処理をここに追記していく.
 * ex) prevVersionNum === 200のとき, v2.0.0から最新バージョンにアップデートした時という意味になる
 **/
const onUpdateVersion = (prevVersionNum: number) => {
  switch (prevVersionNum) {
    case 200: {
      asyncRemoveItem("talkTicketCollection");
      break;
    }
    case 240: {
      console.log("2.4.0から最新バージョンにアップデートしました");
      break;
    }
  }
};

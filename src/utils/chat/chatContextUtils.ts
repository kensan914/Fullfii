import {
  AllMessages,
  CommonMessage,
  CommonMessageSettings,
  TalkingRoomCollection,
} from "src/types/Types.context";

export const canAddCommonMessage = (
  prevMessages: AllMessages,
  commonMessageSettings: CommonMessageSettings
): boolean => {
  const commonMessageId = geneCommonMessageId(commonMessageSettings);

  return !prevMessages.some((prevMessage) => {
    return prevMessage.id === commonMessageId;
  });
};

/**
 * 同一のcommon messageを探し, 重複を防ぐ.
 * @param prevMessages
 * @param commonMessageSettings
 * @returns
 */
export const checkAndAddCommonMessage = (
  prevMessages: AllMessages,
  commonMessageSettings: CommonMessageSettings
): AllMessages => {
  // 一つでも同一IDのcommonMessageが存在した場合, スキップ
  if (canAddCommonMessage(prevMessages, commonMessageSettings)) {
    return [...prevMessages, geneCommonMessage(commonMessageSettings)];
  } else {
    return prevMessages;
  }
};

export const geneCommonMessage = (
  commonMessageSettings: CommonMessageSettings
): CommonMessage => {
  const commonMessageId = geneCommonMessageId(commonMessageSettings);

  const message: CommonMessage = {
    id: commonMessageId,
    text: "",
    time: new Date(Date.now()),
    isCommon: true,
  };
  switch (commonMessageSettings.type) {
    // 作成者がルームを作成した時
    case "CREATED_ROOM": {
      message["text"] = "まだ相手が参加していません";
      break;
    }
    // 作成者側でルームに参加者が入ってきた時
    case "SOMEONE_PARTICIPATED": {
      message[
        "text"
      ] = `${commonMessageSettings.participant.name}さんが参加しました！話を聞いてもらいましょう`;
      break;
    }
    // 参加者側でルームに参加した時
    case "I_PARTICIPATED": {
      message[
        "text"
      ] = `ルームに参加しました！${commonMessageSettings.owner.name}さんのお話を聞いてあげましょう`;
      break;
    }
    // 作成者・参加者共通で相手がルームを退室した時
    case "END": {
      message[
        "text"
      ] = `${commonMessageSettings.targetUser.name}さんがルームを退室しました`;
      break;
    }
  }
  return message;
};

const geneCommonMessageId = (commonMessageSettings: CommonMessageSettings) => {
  switch (commonMessageSettings.type) {
    case "CREATED_ROOM": {
      return "COMMON_MESSAGE_START_TALK";
    }
    case "SOMEONE_PARTICIPATED": {
      return `COMMON_MESSAGE_SOMEONE_PARTICIPATED_${commonMessageSettings.participant.id}`;
    }
    case "I_PARTICIPATED": {
      return `COMMON_MESSAGE_I_PARTICIPATED_${commonMessageSettings.owner.id}`;
    }
    case "END": {
      return `COMMON_MESSAGE_END_${commonMessageSettings.targetUser.id}`;
    }
  }
};

export const getTotalUnreadNum = (
  talkingRoomCollection: TalkingRoomCollection
): number => {
  const unreadNumList = Object.values(talkingRoomCollection).map(
    (_talkingRoom) => _talkingRoom.unreadNum
  );
  if (unreadNumList.length <= 0) return 0;
  return unreadNumList.reduce(
    (prevUnreadNum, currentUnreadNum) => prevUnreadNum + currentUnreadNum
  );
};

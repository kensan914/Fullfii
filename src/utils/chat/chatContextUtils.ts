import {
  AllMessages,
  CommonMessage,
  CommonMessageSettings,
  TalkingRoomCollection,
  ThirdPartyMessage,
} from "src/types/Types.context";

export const canAddCommonMessage = (
  prevMessages: AllMessages,
  commonMessageSettings: CommonMessageSettings
): boolean => {
  const commonMessages = geneCommonMessages(commonMessageSettings);
  const commonMessageIds = commonMessages.map((commonMessage) => {
    return commonMessage.id;
  });

  return !commonMessageIds.some((commonMessageId) => {
    return prevMessages.some((prevMessage) => {
      return prevMessage.id === commonMessageId;
    });
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
    return [...prevMessages, ...geneCommonMessages(commonMessageSettings)];
  } else {
    return prevMessages;
  }
};

export const geneCommonMessages = (
  commonMessageSettings: CommonMessageSettings
): (CommonMessage | ThirdPartyMessage)[] => {
  switch (commonMessageSettings.type) {
    // 作成者がルームを作成した時
    case "CREATED_ROOM": {
      return [
        {
          id: "COMMON_MESSAGE_START_TALK",
          text: "まだ相手が参加していません",
          time: new Date(Date.now()),
          isCommon: true,
        },
        {
          id: "ASSISTANT_MESSAGE_1",
          text: "アシスタントの匿名子です",
          time: new Date(Date.now()),
          isThirdParty: true,
          senderId: "ASSISTANT",
        },
        {
          id: "ASSISTANT_MESSAGE_2",
          text: "話し相手がこのルームに入ってくるまでもう少し待っててね",
          time: new Date(Date.now()),
          isThirdParty: true,
          senderId: "ASSISTANT",
        },
      ];
    }
    // 作成者側でルームに参加者が入ってきた時
    case "SOMEONE_PARTICIPATED": {
      return [
        {
          id: "ASSISTANT_MESSAGE_3",
          text: "悩みが解決したら右上の「終了」から相談を終了できるよ",
          time: new Date(Date.now()),
          isThirdParty: true,
          senderId: "ASSISTANT",
        },
        {
          id: "ASSISTANT_MESSAGE_4",
          text: commonMessageSettings.isSpeaker
            ? "早速相談してみよう"
            : "早速話しを聞いてあげよう",
          time: new Date(Date.now()),
          isThirdParty: true,
          senderId: "ASSISTANT",
        },
        {
          id: "COMMON_MESSAGE_LEFT_ASSISTANT",
          text: "匿名子が退室しました",
          time: new Date(Date.now()),
          isCommon: true,
        },
        {
          id: `COMMON_MESSAGE_SOMEONE_PARTICIPATED_${commonMessageSettings.participant.id}`,
          text: `${commonMessageSettings.participant.name}さんがルームに参加しました`,
          time: new Date(Date.now()),
          isCommon: true,
        },
      ];
    }
    // 参加者側でルームに参加した時
    case "I_PARTICIPATED": {
      return [
        {
          id: "ASSISTANT_MESSAGE_1",
          text: "アシスタントの匿名子です",
          time: new Date(Date.now()),
          isThirdParty: true,
          senderId: "ASSISTANT",
        },
        {
          id: "ASSISTANT_MESSAGE_2",
          text: "相談が終了したら右上の「退室」から相談を終了できるよ",
          time: new Date(Date.now()),
          isThirdParty: true,
          senderId: "ASSISTANT",
        },
        {
          id: "ASSISTANT_MESSAGE_3",
          text: commonMessageSettings.isSpeaker
            ? "早速話しを聞いてあげよう"
            : "早速相談してみよう",
          time: new Date(Date.now()),
          isThirdParty: true,
          senderId: "ASSISTANT",
        },
        {
          id: "COMMON_MESSAGE_LEFT_ASSISTANT",
          text: "匿名子が退室しました",
          time: new Date(Date.now()),
          isCommon: true,
        },
        {
          id: `COMMON_MESSAGE_I_PARTICIPATED_${commonMessageSettings.owner.id}`,
          text: `${commonMessageSettings.owner.name}さんのルームに参加しました`,
          time: new Date(Date.now()),
          isCommon: true,
        },
      ];
    }
    // 作成者・参加者共通で相手がルームを退室した時
    case "END": {
      return [
        {
          id: `COMMON_MESSAGE_END_${commonMessageSettings.targetUser.id}`,
          text: `${commonMessageSettings.targetUser.name}さんがルームを退室しました`,
          time: new Date(Date.now()),
          isCommon: true,
        },
      ];
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

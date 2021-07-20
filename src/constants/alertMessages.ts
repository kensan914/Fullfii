import { ShowToastSettings } from "src/utils/customModules";

type AlertMessagesValue = [string, string];
type AlertMessages = {
  CANNOT_FIX_TALKING_ROOM: AlertMessagesValue;
  CANNOT_DELETE_TALKING_ROOM: AlertMessagesValue;
  CANNOT_CREATE_NEW_ROOM: AlertMessagesValue;
  CANNOT_PARTICIPATE_ROOM: AlertMessagesValue;
  LEAVE_ROOM_OWNER: AlertMessagesValue;
  LEAVE_ROOM_PARTICIPANT: AlertMessagesValue;
  LEAVE_ROOM_WITHOUT_MESSAGE: AlertMessagesValue;
  CANNOT_SET_IS_EXCLUDE_DEFERENT_GENDER: AlertMessagesValue;
  SEND_TABOO: AlertMessagesValue;
  OWNER_LEAVE_PARTICIPANT: AlertMessagesValue;
  CANNOT_SEND_MSG_ALREADY_END_ROOM: AlertMessagesValue;
  CANNOT_SEND_MSG_NOT_EXIST_USER: AlertMessagesValue;
  CANNOT_SEND_MSG_INAPPROPRIATE: AlertMessagesValue;
  CANNOT_SEND_MSG_NOT_START: AlertMessagesValue;
};
/**
 * アラートメッセージのみこの定数で管理. 確認モーダルとしてのアラートなどは実行元で管理
 * @example
 * Alert.alert(...ALERT_MESSAGES["CANNOT_FIX_TALKING_ROOM"]);
 */
export const ALERT_MESSAGES: AlertMessages = {
  CANNOT_FIX_TALKING_ROOM: ["トーク中はルームを修正できません", ""],
  CANNOT_DELETE_TALKING_ROOM: [
    "トーク中はルームを削除できません",
    "ルームを退室してトークを終了してください。",
  ],
  CANNOT_CREATE_NEW_ROOM: [
    "作成済みのルームを終了してください",
    "ルームはひとつまでしか作成できません。",
  ],
  CANNOT_PARTICIPATE_ROOM: [
    "既に参加しているルームを退室してください",
    "ルームにはひとつまでしか参加できません。",
  ],
  LEAVE_ROOM_OWNER: ["終了しますか？", "相手に一言贈りましょう"],
  LEAVE_ROOM_PARTICIPANT: ["退室しますか？", "相手に一言贈りましょう"],
  LEAVE_ROOM_WITHOUT_MESSAGE: ["ルームを退室します", ""],
  CANNOT_SET_IS_EXCLUDE_DEFERENT_GENDER: ["性別を登録してください", ""],
  SEND_TABOO: [
    "不適切な単語が含まれています",
    "相手を傷つけるような表現が確認された場合、アカウントが予告なく凍結される可能性があります。",
  ],
  OWNER_LEAVE_PARTICIPANT: [
    "さんを退室させますか？",
    "相手をブロックして強制的にルームから退出させます。相手には通知されません。",
  ],
  CANNOT_SEND_MSG_ALREADY_END_ROOM: ["このルームは終了されています", ""],
  CANNOT_SEND_MSG_NOT_EXIST_USER: ["まだ相手が参加していません", ""],
  CANNOT_SEND_MSG_INAPPROPRIATE: [
    "このメッセージは送信することができません",
    "",
  ],
  CANNOT_SEND_MSG_NOT_START: [
    "トークが開始されていません",
    "アプリを再起動しますと改善する場合があります。",
  ],
};

type ToastMessages = {
  CREATE_ROOM: ShowToastSettings;
  FIX_ROOM: ShowToastSettings;
  DELETE_ROOM: ShowToastSettings;
  LEAVE_ROOM_WITH_RECREATE_OWNER: ShowToastSettings;
  LEAVE_ROOM_PARTICIPANT: ShowToastSettings;
  LEAVE_ROOM_OWNER: ShowToastSettings;
  HIDE_ROOM: ShowToastSettings;
  BLOCK_ROOM: ShowToastSettings;
  LEAVE_PARTICIPANT: ShowToastSettings;
  ADD_FAVORITE_USER: ShowToastSettings;
  DELETE_FAVORITE_USER: ShowToastSettings;
};
export const TOAST_SETTINGS: ToastMessages = {
  CREATE_ROOM: {
    text1: "ルームを作成しました", // イントロ時のルーム作成時用
  },
  FIX_ROOM: {
    text1: "ルームを修正しました",
  },
  DELETE_ROOM: {
    text1: "ルームを削除しました",
  },
  LEAVE_ROOM_WITH_RECREATE_OWNER: {
    text1: "ルームを再募集しています",
  },
  LEAVE_ROOM_PARTICIPANT: {
    text1: "ルームを退室しました",
  },
  LEAVE_ROOM_OWNER: {
    text1: "ルームを退室して削除しました",
  },
  HIDE_ROOM: {
    text1: "ルームを非表示にしました",
  },
  BLOCK_ROOM: {
    text1: "ルームをブロックしました",
  },
  LEAVE_PARTICIPANT: {
    text1: "相手を退室させました",
  },
  ADD_FAVORITE_USER: {
    text1: "また話したいリストに追加しました",
  },
  DELETE_FAVORITE_USER: {
    text1: "また話したいリストから削除しました",
  },
};

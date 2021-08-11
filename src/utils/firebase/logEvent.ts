import { firebase } from "@react-native-firebase/analytics";

import { DEBUG } from "src/constants/env";
import { ProfileState } from "src/types/Types.context";

export type FirebaseEventName =
  | "delete_created_room" // 作成したルームMyRoomsでを削除した
  | "input_intro_room_name" // ルーム作成イントロにてルーム名を記入し登録した
  | "complete_intro_create_room" // ルーム作成イントロを完遂
  | "complete_intro_participate_room" // ルーム参加イントロを完遂
  | "complete_intro" // イントロを完遂し, アプリを始めた
  | "press_prohibited_matters" // 「禁止事項について」を閲覧
  | "press_what_is_this_app" // 「どういうアプリ？」を閲覧
  | "press_what_is_room" // 「ルームとは？」を閲覧
  | "press_how_to_speak" // 「悩みを話すには？」を閲覧
  | "press_how_to_listen_to" // 「悩みを聞くには？」を閲覧
  | "press_what_is_private_room" //「プライベートルームとは？」を閲覧
  | "press_want_to_talk_list" // 「また話したい人リストとは？」を閲覧
  | "start_intro" // Topにて「承諾を」押下し, イントロを開始
  | "complete_intro_signup" // イントロにてプロフィールを入力し, サインアップをした
  | "navigate_intro_create_room" // イントロTopにて「話したい」を押下
  | "navigate_intro_participate_room" // イントロTopにて「聞きたい」を押下
  | "navigate_intro_signup" // イントロTopにて「プロフィールを入力」を押下
  | "open_review_modal" // レビューモーダルが表示された
  | "press_review_in_review_modal" // レビューモーダル内で「レビューする」を押下
  | "press_cancel_in_review_modal" // レビューモーダル内で「キャンセル」を押下
  | "press_dissatisfaction_in_review_modal" // レビューモーダル内で「不満がある」を押下
  | "success_review"; // アプリ内レビューを完了してくれた

export const logEvent = async (
  name: FirebaseEventName,
  params?: { [key: string]: any },
  profileState?: ProfileState
): Promise<void> => {
  if (DEBUG) return;

  const joined_params = {
    ...params,
    ...(profileState
      ? {
          sender_gender: profileState?.profile?.gender?.label,
          sender_name: profileState?.profile?.name,
          sender_job: profileState?.profile?.job?.label,
        }
      : {}),
  };
  await firebase.analytics().logEvent(name, joined_params);
};

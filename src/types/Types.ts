import { Dispatch } from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AxiosError, AxiosResponse } from "axios";
import { GestureResponderEvent } from "react-native";
import * as t from "io-ts";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { Asset } from "expo-asset";

import {
  GenderKey,
  MeProfile,
  MeProfileIoTs,
  MessageJsonIoTs,
  Profile,
  ProfileDispatch,
  RoomJsonIoTs,
  TalkTicketKey,
} from "src/types/Types.context";

//--------- App.tsx ---------//
export type Assets = { [key: string]: Asset };
//--------- App.tsx ---------//

//--------- Screens.tsx ---------//
export type RootStackParamList = {
  Home: undefined;
  WorrySelect: undefined;
  ProfileEditor: undefined;
  ProfileInput: {
    screen: ProfileInputScreen;
    prevValue: unknown;
    user: MeProfile;
  };
  Chat: { roomId: string };
  Settings: undefined;
  AccountDelete: undefined;
  Authenticated: undefined;
  Top: undefined;
  Onboarding: undefined;
  IntroCreateRoom: undefined;
  MyRooms: { navigateState: { willOpenRoomCreatedModal: boolean; id: string } };
};
export type ChatRouteProp = RouteProp<RootStackParamList, "Chat">;
export type ProfileInputRouteProp = RouteProp<
  RootStackParamList,
  "ProfileInput"
>;
export type MyRoomsRouteProp = RouteProp<RootStackParamList, "MyRooms">;
export type HomeNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;
export type ProfileEditorNavigationPros = StackNavigationProp<
  RootStackParamList,
  "ProfileEditor"
>;
export type ProfileInputNavigationProps = StackNavigationProp<
  RootStackParamList,
  "ProfileInput"
>;
export type WorrySelectNavigationProps = StackNavigationProp<
  RootStackParamList,
  "WorrySelect"
>;

export type ProfileInputScreen =
  | "InputName"
  | "InputGender"
  | "InputIntroduction";

export type RouteName =
  | (
      | "Rooms"
      | "MyRooms"
      | "Profile"
      | "ProfileEditor"
      | "Chat"
      | "Settings"
      | "AccountDelete"
    )
  | ProfileInputScreen;
//--------- Screens.tsx ---------//

//--------- Home.tsx ---------//
export type HomeRooms = {
  key: string;
  title: string;
  color: string[];
  image: string;
  content: string;
  onPress: () => void;
  countNum: number;
}[];
export type HomeFirstItem = {
  icon: string;
  iconFamily: string;
  iconColor: string;
  color: string[];
  borderLess: boolean;
  onPress: () => void;
};
export type AdmobItem = {
  isAdmob: boolean;
};
export type HomeItems = [AdmobItem, ...HomeRooms];
//--------- Home.tsx ---------//

//--------- HomeTemplate.tsx ---------//
//--------- HomeTemplate.tsx ---------//

//--------- ProfileInput.tsx ---------//
export type SuccessSubmitProfile = () => void;
export type ErrorSubmitProfile = (err: AxiosError) => void;
export type ProfileInputData = { [key: string]: unknown };
export type RequestPatchProfile = (
  token: string,
  data: ProfileInputData,
  profileDispatch: ProfileDispatch,
  successSubmit?: SuccessSubmitProfile,
  errorSubmit?: ErrorSubmitProfile,
  finallySubmit?: () => void
) => void;
export type RequestPutGender = (
  token: string,
  putGenderKey: FormattedGenderKey,
  profileDispatch: ProfileDispatch,
  successSubmit?: SuccessSubmitProfile,
  errorSubmit?: ErrorSubmitProfile
) => void;
export type FormattedGenderKey = "female" | "male" | "secret";
export type FormattedGender = {
  key: FormattedGenderKey;
  label: string;
  isNotSet: boolean;
  realGenderKey: GenderKey;
};
//--------- ProfileInput.tsx ---------//

//--------- Chat.tsx ---------//
export type AppendOfflineMessage = (
  messageId: string,
  messageText: string
) => void;
export type SendWsMessage = (
  ws: WebSocket,
  messageId: string,
  messageText: string
) => void;
export type AnimationObject = {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assets: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  layers: any[];
};
export type LottieSource = string | AnimationObject | { uri: string };

export type RoomMemberCollection = {
  [memberId: string]: Profile;
};
//--------- Chat.tsx ---------//

//--------- ChatTemplate.tsx ---------//
export type ItemLayout = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[] | null | undefined,
  index: number
) => {
  length: number;
  offset: number;
  index: number;
};
export type OnContentSizeChange = (width: number, height: number) => void;
//--------- ChatTemplate.tsx ---------//

//--------- ProfileEditor.tsx ---------//
export type RequestPostProfileImage = (
  token: string,
  image: ImageInfo,
  profileDispatch: ProfileDispatch,
  successSubmit: () => void,
  errorSubmit: (err?: AxiosError) => void
) => void;
//--------- ProfileEditor.tsx ---------//

//--------- useSlideView.tsx ---------//
export type GoToPage = (toPageNum: number) => void;
//--------- useSlideView.tsx ---------//

//--------- useAdMobInterstitial.tsx ---------//
export type ShowAdMobInterstitial = () => boolean;
//--------- useAdMobInterstitial.tsx ---------//

//--------- BubbleList.tsx ---------//
export type PressBubble = (key: TalkTicketKey) => void;
export type BubbleItem = { key: string; label: string };
export type BubbleItems = BubbleItem[];
//--------- BubbleList.tsx ---------//

//--------- FormTemplate.tsx ---------//
export type Forms = Form[];
export type Form = {
  type: "INPUT_TEXTAREA";
  value: string;
  setValue: Dispatch<string>;
  title?: string;
  maxLength?: number;
};
export type SubmitSettings = {
  label: string;
  onSubmit: () => void;
  isLoading?: boolean;
  canSubmit?: boolean;
};
//--------- FormTemplate.tsx ---------//

//--------- axios ---------//
export type AxiosMethod = "get" | "post" | "delete" | "put" | "patch";
export type AxiosHeaders = {
  Accept?: string;
  "Content-Type"?: string;
  Authorization?: string;
};
export type AxiosSettings = {
  url: string;
  method: AxiosMethod;
  headers?: AxiosHeaders;
  data?: unknown;
};

export type UseAxiosActionType = RequestAxiosActionType & {
  data?: unknown;
  didRequestCallback?: () => void;
  shouldRequestDidMount?: boolean;
  limitRequest?: number;
};
export type AxiosReActionType = {
  url?: string;
  data?: unknown;
  thenCallback?: (resData: unknown, res: AxiosResponse) => void;
};
export type Request = (reAction?: AxiosReActionType | null) => void;
export type UseAxiosReturn = {
  isLoading: boolean;
  resData: unknown;
  request: Request;
};
export type TypeIoTsOfResData =
  /* eslint-disable @typescript-eslint/no-explicit-any */
  t.TypeC<any> | t.RecordC<any, any> | t.UnionC<any> | t.IntersectionC<any>;
/* eslint-enable @typescript-eslint/no-explicit-any */
export type UseAxios = (
  url: string,
  method: AxiosMethod,
  typeIoTsOfResData: TypeIoTsOfResData | null,
  action: UseAxiosActionType
) => UseAxiosReturn;

export type RequestAxiosActionType = {
  data?: unknown;
  thenCallback?: (resData: unknown, res: AxiosResponse) => void;
  catchCallback?: (err?: AxiosError) => void;
  finallyCallback?: () => void;
  token?: string;
  headers?: { [key: string]: string };
};
export type RequestAxios = (
  url: string,
  method: AxiosMethod,
  typeIoTsOfResData: TypeIoTsOfResData | null,
  action: RequestAxiosActionType
) => void;
//--------- axios ---------//

//--------- axios res.data ---------//
export type SignupResData = t.TypeOf<typeof SignupResDataIoTs>;
export const SignupResDataIoTs = t.type({
  me: MeProfileIoTs,
  token: t.string,
});
export type PutGenderResData = t.TypeOf<typeof PutGenderResDataIoTs>;
export const PutGenderResDataIoTs = t.type({
  me: MeProfileIoTs,
});
export type GetRoomsResData = t.TypeOf<typeof GetRoomsResDataIoTs>;
export const GetRoomsResDataIoTs = t.type({
  rooms: t.array(RoomJsonIoTs),
  hasMore: t.boolean,
});
//--------- axios res.data ---------//

//--------- ws ---------//
export type WsSettings = {
  url: string;
  onopen: (ws: WebSocket) => void;
  onmessage: (
    eData: unknown,
    e: WebSocketMessageEvent,
    ws: WebSocket,
    isReconnect: boolean
  ) => void;
  onclose: (e: WebSocketCloseEvent, ws: WebSocket) => void;
  typeIoTsOfResData: TypeIoTsOfResData;
};
export type WsResNotification = t.TypeOf<typeof WsResNotificationIoTs>;
export type WsResChat = t.TypeOf<typeof WsResChatIoTs>;
//--------- ws ---------//

//--------- ws io-ts ---------//
export const WsResNotificationAuthIoTs = t.type({
  type: t.literal("auth"),
  // profile: MeProfileIoTs,
});
export const WsResNoticeTalkSomeoneParticipatedIoTs = t.type({
  type: t.literal("notice_talk"),
  status: t.literal("SOMEONE_PARTICIPATED"),
  room: RoomJsonIoTs,
  participantId: t.string,
  shouldStart: t.boolean,
});
const WsResNoticeTalkEmptyIoTs = t.type({
  type: t.literal("notice_talk"),
  status: t.literal(""),
});
export const WsResNoticeTalkIoTs = t.union([
  WsResNoticeTalkSomeoneParticipatedIoTs,
  WsResNoticeTalkEmptyIoTs, // notice_talkが増えるたびここに追加 (t.unionは2つからし受け付けないのでWsResNoticeTalkEmptyIoTsを入れているだけ)
]);
export const WsResNotificationIoTs = t.union([
  WsResNotificationAuthIoTs,
  WsResNoticeTalkIoTs,
]);

export const WsResChatAuthIoTs = t.type({
  type: t.literal("auth"),
  roomId: t.string,
  room: t.union([RoomJsonIoTs, t.null]),
  notStoredMessages: t.array(MessageJsonIoTs),
  isAlreadyEnded: t.boolean,
});
export const WsResChatMessageIoTs = t.type({
  type: t.literal("chat_message"),
  roomId: t.string,
  message: MessageJsonIoTs,
});
export const WsResEndTalkIoTs = t.type({
  type: t.literal("end_talk"),
  room: RoomJsonIoTs,
});
export const WsResErrorIoTs = t.intersection([
  t.type({
    type: t.literal("error"),
    errorType: t.string,
  }),
  t.partial({
    message: t.string,
  }),
]);
export const WsResChatIoTs = t.union([
  WsResChatAuthIoTs,
  WsResChatMessageIoTs,
  WsResEndTalkIoTs,
  WsResErrorIoTs,
]);
//--------- ws io-ts ---------//

//--------- support ---------//
//--------- support ---------//

//--------- Utils ---------//
export type OnPress = (event: GestureResponderEvent) => void;
//--------- Utils ---------//

//--------- RoomsScreen ---------//
export type HideRoom = (roomId: string) => void;
export type BlockRoom = (roomId: string) => void;
//--------- RoomsScreen ---------//

//

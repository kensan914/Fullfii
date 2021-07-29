import React from "react";
import * as t from "io-ts";
import { either } from "fp-ts/lib/Either";
import { RouteName } from "./Types";

//========== Auth ==========//
export type AuthState = {
  status: AuthStatus;
  token: TokenNullable;
  isShowSpinner: boolean;
  initBottomTabRouteName: null | RouteName;
  signupBuffer: SignupBuffer;
};
export type AuthDispatch = React.Dispatch<AuthActionType>;
export type UnauthenticatedType = t.TypeOf<typeof UnauthenticatedTypeIoTs>;
export type AuthenticatingType = t.TypeOf<typeof AuthenticatingTypeIoTs>;
export type AuthenticatedType = t.TypeOf<typeof AuthenticatedTypeIoTs>;
export type DeletedType = t.TypeOf<typeof DeletedTypeIoTs>;
export type AuthStatus = t.TypeOf<typeof AuthStatusIoTs>;
export type AuthStatusNullable = AuthStatus | null;
export type SignupBuffer = t.TypeOf<typeof SignupBufferIoTs>;
export type SignupBufferNullable = SignupBuffer | null;
export type TokenNullable = string | null;
export type AuthActionType =
  // TODO: 使用しない
  // | { type: "COMPLETE_SIGNUP"; initBottomTabRouteName: RouteName }
  // TODO: 使用しない
  // | { type: "COMPLETE_INTRO" }
  | { type: "SET_TOKEN"; token: string }
  | { type: "SET_PASSWORD"; password: string }
  | {
      type: "START_INTRO";
    }
  | {
      type: "COMPLETE_ROOM_INTRO";
      introType: "introCreateRoom" | "introParticipateRoom";
    }
  | {
      type: "SET_ROOM_NAME_INTRO";
      roomName: string;
    }
  | { type: "SUCCESS_SIGNUP_INTRO" }
  | { type: "COMPLETE_INTRO"; initBottomTabRouteName: RouteName }
  | { type: "SET_IS_SHOW_SPINNER"; value: boolean }
  | { type: "DELETE_ACCOUNT" }
  | { type: "DANGEROUSLY_RESET" };
//========== Auth ==========//

//========== Auth io-ts ==========//
export const UnauthenticatedTypeIoTs = t.literal("Unauthenticated");
export const AuthenticatingTypeIoTs = t.literal("Authenticating");
export const AuthenticatedTypeIoTs = t.literal("Authenticated");
export const DeletedTypeIoTs = t.literal("Deleted");
export const AuthStatusIoTs = t.union([
  UnauthenticatedTypeIoTs,
  AuthenticatingTypeIoTs,
  AuthenticatedTypeIoTs,
  DeletedTypeIoTs,
]);
export const SignupBufferIoTs = t.type({
  introCreateRoom: t.type({
    isComplete: t.boolean,
    roomName: t.string,
  }),
  introParticipateRoom: t.type({
    isComplete: t.boolean,
  }),
  introSignup: t.type({
    isSignedup: t.boolean,
  }),
});
//========== Auth io-ts ==========//

//========== Profile ==========//
export type ProfileState = {
  profile: MeProfile;
  profileParams: ProfileParams | null;
  isBanned: boolean;
  profileBuffer: {
    username: string;
    genderKey: string;
    jobKey: string;
  };
};
export type ProfileDispatch = React.Dispatch<ProfileActionType>;
export type ProfileActionType =
  | { type: "SET_ALL"; profile: MeProfile }
  | { type: "SET_PARAMS"; profileParams: ProfileParams }
  | { type: "SET_IS_BANNED"; isBan: boolean }
  | {
      type: "SET_PROFILE_BUFFER";
      username: string;
      genderKey: string;
      jobKey: string;
    }
  | { type: "DANGEROUSLY_RESET_OTHER_THAN_PROFILE_PARAMS" };

export type Plan = t.TypeOf<typeof PlanIoTs>;
export type GenderKey = t.TypeOf<typeof GenderKeyIoTs>;
export type Gender = t.TypeOf<typeof GenderIoTs>;
export type Genders = t.TypeOf<typeof GendersIoTs>;
export type GenreOfWorry = t.TypeOf<typeof GenreOfWorryIoTs>;
export type GenreOfWorries = t.TypeOf<typeof GenreOfWorriesIoTs>;
export type GenreOfWorriesCollection = t.TypeOf<
  typeof GenreOfWorriesCollectionIoTs
>;
export type Job = t.TypeOf<typeof JobIoTs>;
export type Jobs = t.TypeOf<typeof JobsIoTs>;
export type ProfileParams = t.TypeOf<typeof ProfileParamsIoTs>;
export type MeProfile = t.TypeOf<typeof MeProfileIoTs>;
export type Profile = t.TypeOf<typeof ProfileIoTs>;

export type WorriesResJson = t.TypeOf<typeof WorriesResJsonIoTs>;
//========== Profile ==========//

//========== Profile io-ts ==========//
export const GenderKeyIoTs = t.keyof({
  female: null,
  male: null,
  notset: null,
});
export const GenderIoTs = t.type({
  key: GenderKeyIoTs,
  name: t.string,
  label: t.string,
});
export const GendersIoTs = t.record(t.string, GenderIoTs);
export const GenreOfWorryIoTs = t.type({
  key: t.string,
  value: t.string,
  label: t.string,
});
export const GenreOfWorriesIoTs = t.array(GenreOfWorryIoTs);
export const GenreOfWorriesCollectionIoTs = t.record(
  t.string,
  GenreOfWorryIoTs
);
export const JobIoTs = t.type({
  key: t.string,
  name: t.string,
  label: t.string,
});
export const JobsIoTs = t.record(t.string, JobIoTs);
export const ProfileParamsIoTs = t.type({
  gender: GendersIoTs,
  job: JobsIoTs,
});

export const PlanIoTs = t.type({
  key: t.string,
  label: t.string,
});
export const ProfileIoTs = t.type({
  id: t.string,
  name: t.string,
  gender: GenderIoTs,
  isSecretGender: t.boolean,
  job: JobIoTs,
  introduction: t.string,
  image: t.union([t.string, t.null]),
  numOfOwner: t.number,
  numOfParticipated: t.number,
  isPrivateProfile: t.boolean,
});
export const MeProfileIoTs = t.intersection([
  t.type({
    dateJoined: t.string,
    deviceToken: t.union([t.string, t.null]),
    isActive: t.boolean,
    isBan: t.boolean,
    me: t.boolean,
  }),
  ProfileIoTs,
]);

//========== Profile io-ts ==========//

//========== Chat ==========//
export type ChatState = {
  totalUnreadNum: TotalUnreadNum;
  chatDispatchTask: ChatDispatchTask;
  talkingRoomCollection: { [talkingRoomId: string]: TalkingRoom };
};
export type ChatDispatch = React.Dispatch<ChatActionType>;
export type ChatActionType =
  | { type: "INIT_TALKING_ROOM"; roomJson: Room | RoomJson }
  | { type: "UPDATE_TALKING_ROOM"; roomJson: RoomJson }
  | {
      type: "APPEND_OFFLINE_MESSAGE";
      messageId: string;
      text: string;
      senderId: string;
      time: Date;
      roomId: string;
    }
  | {
      type: "APPEND_COMMON_MESSAGE";
      roomId: string;
      commonMessageSettings: CommonMessageSettings;
    }
  | { type: "START_TALK"; roomId: string; ws: WebSocket }
  | { type: "RESTART_TALK"; roomId: string; ws: WebSocket }
  | { type: "RECONNECT_TALK"; roomId: string; ws: WebSocket }
  | {
      type: "MERGE_MESSAGES";
      roomId: string;
      meId: string;
      messages: MessageJson[];
      token: string;
    }
  | { type: "I_END_TALK"; roomId: string }
  | { type: "MEMBER_END_TALK"; roomId: string; meId: string }
  | { type: "CLOSE_TALK"; roomId: string }
  | {
      type: "APPEND_MESSAGE";
      roomId: string;
      messageId: string;
      text: string;
      senderId: string;
      time: Date | string;
      meId: string;
      token: string;
    }
  | {
      type: "DELETE_OFFLINE_MESSAGE";
      roomId: string;
      messageId: string;
    }
  | {
      type: "READ_BY_ROOM";
      roomId: string;
      token: string;
      isForceSendReadNotification?: boolean;
    }
  | {
      type: "ADD_FAVORITE_USER";
      userId: string;
    }
  | {
      type: "DELETE_FAVORITE_USER";
      userId: string;
    }
  | { type: "TURN_ON_DELAY"; excludeType: string[] }
  | { type: "TURN_OFF_DELAY" }
  | { type: "EXECUTED_DELAY_DISPATCH" }
  | { type: "DANGEROUSLY_RESET" };

export type TotalUnreadNum = number;
export type TalkStatus = t.TypeOf<typeof TalkStatusIoTs>;
export type TalkTicket = t.TypeOf<typeof TalkTicketJsonExceptRoomIoTs> & {
  room: Room;
};
export type TalkTicketJson = t.TypeOf<typeof TalkTicketJsonIoTs>;
export type TalkTicketKey = t.TypeOf<typeof TalkTicketKeyIoTs>;
export type TalkTicketCollection = { [talkTicketKey: string]: TalkTicket };
export type TalkTicketCollectionJson = t.TypeOf<
  typeof TalkTicketCollectionJsonIoTs
>;
export type TalkTicketCollectionAsync = t.TypeOf<
  typeof TalkTicketCollectionAsyncIoTs
>;
export type TalkInfoJson = t.TypeOf<typeof TalkInfoJsonIoTs>;
//

// 通常
export type TalkingRoomCollection = { [roomId: string]: TalkingRoom };
// response用
export type TalkingRoomCollectionJson = t.TypeOf<
  typeof TalkingRoomCollectionJsonIoTs
>;
// asyncStorage用. TalkingRoomCollectionと比較してwsが必ずnull. 相違点はそこだけなので, TalkingRoomCollection ∈ TalkingRoomCollectionAsync.
export type TalkingRoomCollectionAsync = t.TypeOf<
  typeof TalkingRoomCollectionAsyncIoTs
>;

export type BaseRoom = t.TypeOf<typeof BaseRoomIoTs>;

/** RoomJsonとの違い: createdAtのtypeがDate */
export type Room = t.TypeOf<typeof RoomIoTs>;
/** Roomとの違い: createdAtのtypeがstring|null */
export type RoomJson = t.TypeOf<typeof RoomJsonIoTs>;

export type TalkingRoomParts = {
  messages: AllMessages;
  offlineMessages: OfflineMessage[];
  unreadNum: number;
  ws: WsNullable;
  isStart: boolean;
};
/** TalkingRoomJsonとの違い: wsのtypeがWsNullable, createdAtのtypeがDate */
export type TalkingRoom = TalkingRoomParts & Room;
/** TalkingRoomとの違い: wsのtypeがnull, createdAtのtypeがstring|null */
export type TalkingRoomJson = t.TypeOf<typeof TalkingRoomJsonIoTs>;
export type WsNullable = WebSocket | null;

export type OfflineMessage = t.TypeOf<typeof OfflineMessageIoTs>;
export type Message = t.TypeOf<typeof MessageIoTs>;
export type MessageJson = t.TypeOf<typeof MessageJsonIoTs>;
export type CommonMessage = t.TypeOf<typeof CommonMessageIoTs>;
export type AllMessage = t.TypeOf<typeof AllMessageIoTs>;
export type AllMessages = t.TypeOf<typeof AllMessagesIoTs>;

export type ChatDispatchTask = {
  status: "GO" | "DELAY";
  queue: ChatActionType[];
  excludeType: string[];
};

export type CommonMessageSettings =
  | {
      type: "CREATED_ROOM";
    }
  | {
      type: "SOMEONE_PARTICIPATED";
      participant: Profile;
    }
  | {
      type: "I_PARTICIPATED";
      owner: Profile;
    }
  | {
      type: "END";
      targetUser: Profile;
    };
//========== Chat ==========//

//========== Chat io-ts ==========//
/** https://github.com/gcanti/io-ts/blob/master/index.md */
export const DateType = new t.Type<Date, string, unknown>(
  "DateFromString",
  (u): u is Date => u instanceof Date,
  (u, c) =>
    either.chain(t.string.validate(u, c), (s) => {
      const d = new Date(s);
      return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d);
    }),
  (a) => a.toISOString()
);
export const BaseMessageIoTs = t.type({
  id: t.string,
  text: t.string,
  senderId: t.string,
});
export const OfflineMessageIoTs = t.type({
  id: t.string,
  text: t.string,
  senderId: t.string,
  time: DateType,
  isOffline: t.boolean,
});
export const MessageIoTs = t.intersection([
  BaseMessageIoTs,
  t.type({
    time: DateType,
  }),
]);
export const MessageJsonIoTs = t.intersection([
  BaseMessageIoTs,
  t.type({
    time: t.string,
  }),
]);
export const CommonMessageIoTs = t.type({
  id: t.string,
  text: t.string,
  time: DateType,
  isCommon: t.boolean,
});
export const AllMessageIoTs = t.union([
  OfflineMessageIoTs,
  MessageIoTs,
  CommonMessageIoTs,
]);
export const AllMessagesIoTs = t.array(AllMessageIoTs);

export const BaseRoomIoTs = t.type({
  id: t.string,
  name: t.string,
  image: t.union([t.string, t.null]),
  owner: ProfileIoTs,
  participants: t.array(ProfileIoTs),
  leftMembers: t.array(ProfileIoTs),
  maxNumParticipants: t.number,
  isExcludeDifferentGender: t.boolean,
  isPrivate: t.boolean,
  isEnd: t.boolean,
  isActive: t.boolean,
  addedFavoriteUserIds: t.array(t.string),
});
const RoomCreatedAtIoTs = t.type({
  createdAt: DateType,
});
export const RoomIoTs = t.intersection([BaseRoomIoTs, RoomCreatedAtIoTs]);
const RoomCreatedAtJsonIoTs = t.type({
  createdAt: t.union([t.string, t.null]),
});
export const RoomJsonIoTs = t.intersection([
  BaseRoomIoTs,
  RoomCreatedAtJsonIoTs,
]);

// -- TalkingRoomCollectionJsonIoTs -- //
// response用IoTs. TalkingRoomCollectionのwsが常にnullで, 時間はDateを表すstring.
export const TalkingRoomPartsJsonIoTs = t.type({
  messages: AllMessagesIoTs,
  offlineMessages: t.array(OfflineMessageIoTs),
  unreadNum: t.number,
  ws: t.null,
});
export const TalkingRoomJsonIoTs = t.intersection([
  TalkingRoomPartsJsonIoTs,
  RoomJsonIoTs,
]);
export const TalkingRoomCollectionJsonIoTs = t.record(
  t.string,
  TalkingRoomJsonIoTs
);
// ------ //

// -- TalkingRoomCollectionAsyncIoTs -- //
// asyncStorage用IoTs. TalkingRoomCollectionのwsが常にnull(TalkingRoomとの唯一の違い)で, 時間は全てDateオブジェクト. (+ isStart)
export const TalkingRoomPartsAsyncIoTs = t.intersection([
  TalkingRoomPartsJsonIoTs,
  t.type({
    isStart: t.boolean, // "START_TALK"実行済みか
  }),
]);
export const TalkingRoomAsyncIoTs = t.intersection([
  TalkingRoomPartsAsyncIoTs,
  RoomIoTs,
]);
export const TalkingRoomCollectionAsyncIoTs = t.record(
  t.string,
  TalkingRoomAsyncIoTs
);
// ------ //

export const TalkStatusIoTs = t.type({
  key: t.string,
  name: t.string,
  label: t.string,
});
export const TalkTicketKeyIoTs = t.string;
const TalkTicketJsonExceptRoomIoTs = t.type({
  id: t.string,
  owner: MeProfileIoTs,
  worry: GenreOfWorryIoTs,
  isSpeaker: t.boolean,
  status: TalkStatusIoTs,
  waitStartTime: t.string,
  canTalkHeterosexual: t.boolean,
  canTalkDifferentJob: t.boolean,
  topic: t.string,
});
/** TalkTicketAsyncIoTsとの違い: roomがnullable & roomJson */
export const TalkTicketJsonIoTs = t.intersection([
  TalkTicketJsonExceptRoomIoTs,
  t.type({
    room: t.union([RoomJsonIoTs, t.null]),
  }),
]);
/** TalkTicketJsonIoTsとの違い: roomのwsのみがnull */
export const TalkTicketAsyncIoTs = t.intersection([
  TalkTicketJsonExceptRoomIoTs,
  t.type({
    room: RoomJsonIoTs,
  }),
]);
/** TalkTicketCollectionAsyncIoTsとの違い: roomがnullable & roomJson */
export const TalkTicketCollectionJsonIoTs = t.record(
  t.string,
  TalkTicketJsonIoTs
);
/** TalkTicketCollectionJsonIoTsとの違い: roomのwsのみがnull */
export const TalkTicketCollectionAsyncIoTs = t.record(
  t.string,
  TalkTicketAsyncIoTs
);
export const TalkInfoJsonIoTs = t.type({
  // talkTickets: t.array(TalkTicketJsonIoTs),
  // lengthParticipants: t.record(t.string, t.number),
  createdRooms: t.array(RoomJsonIoTs),
  participatingRooms: t.array(RoomJsonIoTs),
});
//========== Chat io-ts ==========//

//========== Dom ==========//
export type TaskSchedulesKey = "refreshRooms";
export type DomState = {
  taskSchedules: { [key in TaskSchedulesKey]: boolean };
  pushNotificationParams: {
    isPermission: boolean;
    isChosenPermission: boolean;
    isChanged: boolean;
  };
};
export type DomDispatch = React.Dispatch<DomActionType>;
export type DomActionType =
  | { type: "SCHEDULE_TASK"; taskKey: TaskSchedulesKey }
  | { type: "DONE_TASK"; taskKey: TaskSchedulesKey }
  | {
      type: "SET_PUSH_NOTIFICATION_PARAMS";
      isPermission?: boolean;
      isChosenPermission?: boolean;
    }
  | { type: "CONFIGURED_PUSH_NOTIFICATION" }
  | { type: "FINISH_SET_PUSH_NOTIFICATION_PARAMS" };

//========== Dom ==========//

//========== ContextUtils ==========//
export type States = {
  authState: AuthState;
  profileState: ProfileState;
  chatState: ChatState;
};
export type Dispatches = {
  authDispatch: AuthDispatch;
  profileDispatch: ProfileDispatch;
  chatDispatch: ChatDispatch;
};
//========== ContextsUtils ==========//

//========== 呼び出し順 ==========//
export const WorriesResJsonIoTs = t.type({
  addedTalkTickets: t.array(TalkTicketJsonIoTs),
  removedTalkTicketKeys: t.array(TalkTicketKeyIoTs),
});
//========== 呼び出し順 ==========//

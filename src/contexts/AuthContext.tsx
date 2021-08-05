import React, { createContext, useReducer, useContext } from "react";

import { asyncStoreItem, asyncStoreObject } from "src/utils/asyncStorage";
import {
  AuthenticatedType,
  AuthenticatingType,
  AuthState,
  UnauthenticatedType,
  AuthActionType,
  AuthDispatch,
  TokenNullable,
  AuthStatusNullable,
  DeletedType,
  SignupBuffer,
  SignupBufferNullable,
} from "src/types/Types.context";

const authReducer = (prevState: AuthState, action: AuthActionType) => {
  let _signupBuffer: SignupBuffer;
  switch (action.type) {
    case "SET_TOKEN": {
      /** set token. tokenが設定されていた場合、変更しない
       * @param {Object} action [type, token] */

      if (prevState.token) return { ...prevState };
      asyncStoreItem("token", action.token);

      return {
        ...prevState,
        token: action.token,
      };
    }

    case "SET_PASSWORD": {
      /** set password.
       * @param {Object} action [type, password] */

      asyncStoreItem("password", action.password);
      return {
        ...prevState,
      };
    }

    case "START_INTRO": {
      /** start intro.
       * @param {Object} action [type] */

      const authenticatingStatus = AUTHENTICATING;
      asyncStoreItem("status", authenticatingStatus);
      return {
        ...prevState,
        status: authenticatingStatus,
      };
    }

    case "COMPLETE_ROOM_INTRO": {
      /** ルーム作成イントロ or ルーム参加イントロ完了時に実行.
       * @param {Object} action [type, introType] */

      _signupBuffer = { ...prevState.signupBuffer };
      switch (action.introType) {
        case "introCreateRoom":
          _signupBuffer["introCreateRoom"] = {
            ..._signupBuffer["introCreateRoom"],
            isComplete: true,
          };
          break;
        case "introParticipateRoom":
          _signupBuffer["introParticipateRoom"] = {
            ..._signupBuffer["introParticipateRoom"],
            isComplete: true,
          };
          break;
      }

      asyncStoreObject("signupBuffer", _signupBuffer);
      return {
        ...prevState,
        signupBuffer: _signupBuffer,
      };
    }

    case "SET_ROOM_NAME_INTRO": {
      /** イントロ時のルーム名をset.
       * @param {Object} action [type, roomName] */

      _signupBuffer = { ...prevState.signupBuffer };
      _signupBuffer["introCreateRoom"] = {
        ..._signupBuffer["introCreateRoom"],
        roomName: action.roomName,
      };

      asyncStoreObject("signupBuffer", _signupBuffer);
      return {
        ...prevState,
        signupBuffer: _signupBuffer,
      };
    }

    case "SUCCESS_SIGNUP_INTRO": {
      /** イントロのサインアップ成功時に実行. この時点ではHOMEに遷移しない
       * @param {Object} action [type] */

      _signupBuffer = { ...prevState.signupBuffer };
      _signupBuffer["introSignup"] = {
        ..._signupBuffer["introSignup"],
        isSignedup: true,
      };

      asyncStoreObject("signupBuffer", _signupBuffer);
      return {
        ...prevState,
        signupBuffer: _signupBuffer,
      };
    }

    case "COMPLETE_INTRO": {
      /** 全イントロ終了時に実行. initBottomTabRouteNameに指定したbottomタブに遷移.
       * @param {Object} action [type, initBottomTabRouteName] */

      const authenticatedStatus = AUTHENTICATED;
      asyncStoreItem("status", authenticatedStatus);

      return {
        ...prevState,
        status: authenticatedStatus,
        initBottomTabRouteName: action.initBottomTabRouteName,
      };
    }

    case "SET_IS_SHOW_SPINNER": {
      /** set isShowSpinner.
       * @param {Object} action [type, value] */

      return {
        ...prevState,
        isShowSpinner: Boolean(action.value),
      };
    }
    case "DELETE_ACCOUNT": {
      /** auth stateを初期化.
       * @param {Object} action [type] */

      const deleteAccountStatus = DELETED;
      asyncStoreItem("status", deleteAccountStatus);
      return {
        ...prevState,
        status: deleteAccountStatus,
      };
    }

    case "DANGEROUSLY_RESET": {
      /** auth stateを初期化.
       * @param {Object} action [type] */

      return { ...initAuthState };
    }
    default: {
      console.warn(`Not found the action.type (${action.type}).`);
      return { ...prevState };
    }
  }
};

export const UNAUTHENTICATED: UnauthenticatedType = "Unauthenticated"; // signup処理前. AppIntro描画
export const AUTHENTICATING: AuthenticatingType = "Authenticating"; // signup処理中. イントロ時ルーム作成描画 (ver.3.0.3現在)
export const AUTHENTICATED: AuthenticatedType = "Authenticated"; // signup処理後. Home描画
export const DELETED: DeletedType = "Deleted"; // アカウント削除されている状態. 「無事削除されました」描画

const initSignupBuffer: SignupBuffer = Object.freeze({
  introCreateRoom: {
    isComplete: false,
    roomName: "",
  },
  introParticipateRoom: {
    isComplete: false,
  },
  introSignup: {
    isSignedup: false,
  },
});
const initAuthState = Object.freeze({
  status: UNAUTHENTICATED,
  token: null,
  isShowSpinner: false,
  initBottomTabRouteName: null, // イントロ完了時にどのタブへ遷移するか
  signupBuffer: { ...initSignupBuffer },
});
const authStateContext = createContext<AuthState>({ ...initAuthState });
const authDispatchContext = createContext<AuthDispatch>(() => {
  return void 0;
});

export const useAuthState = (): AuthState => {
  const context = useContext(authStateContext);
  return context;
};
export const useAuthDispatch = (): AuthDispatch => {
  const context = useContext(authDispatchContext);
  return context;
};

type Props = {
  status: AuthStatusNullable;
  token: TokenNullable;
  signupBuffer: SignupBufferNullable;
};
export const AuthProvider: React.FC<Props> = ({
  children,
  status,
  token,
  signupBuffer,
}) => {
  const initAuthState: AuthState = {
    status: status ? status : UNAUTHENTICATED,
    token: token ? token : null,
    isShowSpinner: false,
    initBottomTabRouteName: null, // イントロ完了時にどのタブへ遷移するか
    signupBuffer: signupBuffer ? signupBuffer : initSignupBuffer,
  };
  const [authState, authDispatch] = useReducer(authReducer, {
    ...initAuthState,
  });

  return (
    <authStateContext.Provider value={authState}>
      <authDispatchContext.Provider value={authDispatch}>
        {children}
      </authDispatchContext.Provider>
    </authStateContext.Provider>
  );
};

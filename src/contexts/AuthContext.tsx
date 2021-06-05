import React, { createContext, useReducer, useContext } from "react";

import { asyncStoreItem } from "src/utils/asyncStorage";
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
} from "src/types/Types.context";

const authReducer = (prevState: AuthState, action: AuthActionType) => {
  switch (action.type) {
    case "COMPLETE_SIGNUP": {
      /** signup時に実行. tokenが設定されていた場合、stateは変更しない
       * @param {Object} action [type, token, password] */

      if (prevState.token) return { ...prevState };
      asyncStoreItem("token", action.token);
      asyncStoreItem("password", action.password);

      const authenticatedStatus = AUTHENTICATED;
      asyncStoreItem("status", authenticatedStatus);

      return {
        ...prevState,
        token: action.token,
        status: authenticatedStatus,
      };
    }

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
export const AUTHENTICATING: AuthenticatingType = "Authenticating"; // signup処理中. SignUp描画
export const AUTHENTICATED: AuthenticatedType = "Authenticated"; // signup処理後. Home描画
export const DELETED: DeletedType = "Deleted"; // アカウント削除されている状態. 「無事削除されました」描画

const initAuthState = Object.freeze({
  status: UNAUTHENTICATED,
  token: null,
  isShowSpinner: false,
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
};
export const AuthProvider: React.FC<Props> = ({ children, status, token }) => {
  const initAuthState: AuthState = {
    status: status ? status : UNAUTHENTICATED,
    token: token ? token : null,
    isShowSpinner: false,
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

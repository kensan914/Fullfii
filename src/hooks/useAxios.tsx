import { Dispatch, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { isRight } from "fp-ts/lib/Either";
import NetInfo from "@react-native-community/netinfo";

import {
  AxiosMethod,
  AxiosSettings,
  Request,
  RequestAxios,
  RequestAxiosActionType,
  TypeIoTsOfResData,
  UseAxios,
  UseAxiosActionType,
} from "src/types/Types";
import { checkCorrectKey, deepCvtKeyFromSnakeToCamel } from "src/utils";
import { DomDispatch } from "src/types/Types.context";
import { DOWN, MAINTENANCE, useDomDispatch } from "src/contexts/DomContext";

/**
 * カスタムHooks ver, Function verの共通init処理
 * token, dataをsetしたAxiosSettings・actionKeys・axiosInstanceを返す
 * @param url
 * @param method
 * @param action
 */
const initAxios = (
  url: string,
  method: AxiosMethod,
  action: UseAxiosActionType | RequestAxiosActionType
): [AxiosInstance, AxiosSettings, string[]] => {
  const actionKeys = Object.keys(action);

  const axiosSettings: AxiosSettings = {
    url: url,
    method: method,
  };

  // set token
  const authHeaders =
    actionKeys.indexOf("token") !== -1
      ? {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `JWT ${action.token}`,
        }
      : {};
  axiosSettings["headers"] = {
    ...authHeaders,
    ...("headers" in action ? action.headers : {}),
  };

  // set data
  if (actionKeys.indexOf("data") !== -1) axiosSettings["data"] = action.data;

  // generate axios instance
  const axiosInstance = axios.create();

  return [axiosInstance, axiosSettings, actionKeys];
};

/**
 * カスタムHooks ver, Function verの共通タスク(then)処理
 */
const useCommonThen = (
  res: AxiosResponse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeIoTsOfResData: TypeIoTsOfResData | null,
  action: UseAxiosActionType | RequestAxiosActionType,
  setResData?: Dispatch<unknown>
): void => {
  const formattedResData = deepCvtKeyFromSnakeToCamel(res.data) as Record<
    string,
    unknown
  >;
  if (typeIoTsOfResData === null) {
    if (action.thenCallback !== void 0) {
      action.thenCallback(formattedResData, res);
    }
    return;
  }
  const typeIoTsResult = typeIoTsOfResData.decode(formattedResData);
  if (!isRight(typeIoTsResult)) {
    console.group();
    console.error(
      `Type does not match(axios then). The object can be found below.`
    );
    console.error({ ...formattedResData });
    console.groupEnd();
  }

  if (action.thenCallback !== void 0) {
    action.thenCallback(formattedResData, res);
  }
  setResData && setResData(formattedResData);
};

/**
 * カスタムHooks ver, Function verの共通タスク(catch)処理
 */
const useCommonCatch = (
  err: AxiosError,
  action: UseAxiosActionType | RequestAxiosActionType,
  domDispatch?: DomDispatch
): void => {
  if (err.response) {
    console.error(err.response);

    // 共通エラーアラート (バックから {error: {alert: True}} がレスポンスされた場合、アラートを表示)
    if (err.response.data?.error?.alert) {
      Alert.alert(
        err.response.data?.error?.title,
        err.response.data?.error?.message
      );
    }
  } else {
    console.error(err);
  }
  if (action.catchCallback !== void 0) action.catchCallback(err);

  // メンテナンス or サーバダウン検知
  if (err.response?.status === 503) {
    domDispatch &&
      domDispatch({ type: "SET_API_STATUS", apiStatus: MAINTENANCE });
  } else {
    // ⇓ detect network error
    if (!!err.isAxiosError && !err.response) {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          domDispatch &&
            domDispatch({ type: "SET_API_STATUS", apiStatus: DOWN });
        }
      });
    }
  }
};
/**
 * カスタムHooks ver, Function verの共通タスク(finally)処理
 */
const useCommonFinally = (
  action: UseAxiosActionType | RequestAxiosActionType
): void => {
  if (action.finallyCallback !== void 0) action.finallyCallback();
};

/** axiosを使用したリクエストのカスタムHooks
 * @param {string} url
 * @param {string} method [get, post, delete, put, patch]
 * @param {object} action [data, thenCallback, catchCallback, finallyCallback, didRequestCallback, token, shouldRequestDidMount, limitRequest]
 * @return {object} { isLoading, resData, request }
 * @example
  // デフォルトではdidMount時にリクエストは走らない。didMount時の自動リクエストはaction.shouldRequestDidMountにtrueをsetし設定。
  const { isLoading, resData, request } = useAxios(URLJoin(BASE_URL, ".../"), "post", {
    data: {},
    thenCallback: (resData, res) => { }, // resDataは, 整形済みであり型安全が保証されているためasしても構わない
    catchCallback: err => { },
    token: authState.token,
    shouldRequestDidMount: true,
  });
  // request()でリクエスト。urlかdataパラメータをobjectで渡してそのリクエスト間だけで有効な上書き設定が可能。
  request({ url: URLJoin(BASE_URL, ".../"), data: {}, });
 * */
export const useAxios: UseAxios = (url, method, typeIoTsOfResData, action) => {
  //---------- constants ----------//
  const axiosRequestMethods = ["get", "post", "delete", "put", "patch"];
  // ↓変更があれば都度追加していく↓
  const correctActionKeys = [
    "data",
    "thenCallback",
    "catchCallback",
    "finallyCallback",
    "didRequestCallback",
    "token",
    "shouldRequestDidMount",
    "limitRequest",
  ];
  const correctRequestActionKeys = ["url", "data", "thenCallback", "token"];
  //---------- constants ----------//

  const domDispatch = useDomDispatch();

  // init axios
  const [axiosInstance, axiosSettings, actionKeys] = initAxios(
    url,
    method,
    action
  );

  // set didRequestCallback
  axiosInstance.interceptors.request.use((request) => {
    if (action.didRequestCallback !== void 0) {
      action.didRequestCallback();
    }
    return request;
  });

  const [resData, setResData] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(false);
  const [limitRequest] = useState(
    action.limitRequest !== void 0 && !isNaN(action.limitRequest)
      ? Number(action.limitRequest) // limitRequestが指定されている、かつ数値変換可能である
      : -1 // それ以外は-1(リクエスト無制限)
  );
  const requestNum = useRef(0);

  /** 再リクエストしたい時に使用する。最初の設定から変更できるパラメータはurl, dataのみ。どちらも引数も省略し、最初の設定を使用することが可能。
   * @param {string} url
   * @param {Object} data
   * */
  const request: Request = (reAction = null) => {
    // リクエスト回数制限
    if (++requestNum.current > limitRequest && limitRequest >= 0) {
      console.warn(
        `The request limit set to ${limitRequest} has been exceeded. Abort the request.`
      );
      if (action.catchCallback !== void 0) action.catchCallback();
      return;
    }

    setIsLoading(true);

    const _axiosSettings = { ...axiosSettings };
    if (reAction !== null) {
      // actionのエラーハンドリング
      checkCorrectKey(
        correctRequestActionKeys,
        reAction,
        (incorrectkey: string) => {
          console.error(`"${incorrectkey}" action key is not supported.`);
        }
      );
      if (reAction.url) _axiosSettings["url"] = reAction.url;
      if (reAction.data) _axiosSettings["data"] = reAction.data;
      // thenCallback追加
      if (reAction.thenCallback) {
        const tempThenCallback =
          action.thenCallback && action.thenCallback.bind({});
        action.thenCallback = (resData: unknown, res: AxiosResponse<any>) => {
          tempThenCallback && tempThenCallback(resData, res);
          reAction.thenCallback && reAction.thenCallback(resData, res);
        };
      }
      // token上書き
      if (typeof reAction.token !== "undefined") {
        _axiosSettings["headers"] = {
          ..._axiosSettings["headers"],
          Authorization: `JWT ${reAction.token}`,
        };
      }
    }

    axiosInstance
      .request(_axiosSettings)
      .then((res) => {
        useCommonThen(res, typeIoTsOfResData, action, setResData);
      })
      .catch((err) => {
        requestNum.current--; // リクエスト無効
        useCommonCatch(err, action, domDispatch);
      })
      .finally(() => {
        useCommonFinally(action);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // http methodのエラーハンドリング
    if (!axiosRequestMethods.includes(method))
      console.error(`"${method}" HTTP method is not supported.`);

    // actionのエラーハンドリング
    checkCorrectKey(correctActionKeys, action, (incorrectkey: string) => {
      console.error(`"${incorrectkey}" action key is not supported.`);
    });

    if (
      actionKeys.indexOf("shouldRequestDidMount") !== -1 &&
      action.shouldRequestDidMount
    ) {
      request();
    }
  }, []);

  return { isLoading, resData, request };
};

/**
 * axiosを使用したリクエスト(Function ver)
 * @param url
 * @param method
 * @param typeIoTsOfResData
 * @param action
 */
const requestAxios: RequestAxios = (url, method, typeIoTsOfResData, action) => {
  // init axios
  const [axiosInstance, axiosSettings] = initAxios(url, method, action);
  const _axiosSettings = { ...axiosSettings };

  axiosInstance
    .request(_axiosSettings)
    .then((res) => {
      useCommonThen(res, typeIoTsOfResData, action);
    })
    .catch((err) => {
      useCommonCatch(err, action);
    })
    .finally(() => {
      useCommonFinally(action);
    });
};

export default requestAxios;

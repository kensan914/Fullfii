import { isRight } from "fp-ts/lib/Either";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

import { CODE } from "src/constants/statusCodes";
import { WsSettings } from "src/types/Types";
import { closeWsSafely, deepCvtKeyFromSnakeToCamel } from "src/utils";

type WsState = undefined | null | WebSocket;
type UseWebsocket = (
  wsSettings: WsSettings,
  wsState: WsState,
  wsHandlersDeps?: unknown[],
  wsSettingsDeps?: unknown[]
) => {
  connectWebsocket: () => void;
};
/** websocket hook
 *
 * 問題点①: websocketのonmessageがstateに依存している場合, stateが変更されてもデフォルトではonmessage等は更新されない.
 * 対策①: wsHandlersDepsにその依存stateを配列で指定することで対応.
 *
 * 問題点②: connectWebsocket()の引数にwsSettingsを指定していたが, これでは対策①でもwsSettingsの更新がなされないため, 問題①は解決しなかった.
 * 対策②: wsSettingsの指定場所をuseWebsocket()の引数に変更.
 *
 * 問題点③: chat wsの場合など, wsSettings内に不備が生まれるタイミングが存在することがあり(ex. connectWsChat()が呼ばれるまでwsSettings内のroomIdが不明値), その状態でwebsocketのconnect処理を行ってしまう.
 * 対策③: wsSettingsが完成するまでwebsocketのconnect処理を遅延. roomIdなどのwsSettings内の不明値は, wsSettingsDepsに指定.
 * @param wsSettings
 * @param wsHandlersDeps optional. 指定しなかった場合, 各wsHandlersのrerenderはスキップされる(デフォルトの振る舞い).
 * @param wsSettingsDeps optional. 指定しなかった場合, connectWebsocket()でwebsocketのconnect処理が遅延されず即時実行される(デフォルトの振る舞い).
 * @returns
 */
export const useWebsocket: UseWebsocket = (
  wsSettings,
  wsState,
  wsHandlersDeps = [],
  wsSettingsDeps = []
) => {
  const [connectIntervalTime] = useState(2000);
  const connectInterval = useRef<NodeJS.Timeout>(
    setTimeout(() => {
      return void 0;
    }, 0)
  );
  const ws = useRef<WebSocket>();
  type DelayConnectSettings = {
    isDelay: boolean;
    isReconnect: boolean;
  };
  const [
    delayConnectSettings,
    setDelayConnectSettings,
  ] = useState<DelayConnectSettings>({
    isDelay: false,
    isReconnect: false,
  });

  // 各wsHandlersのrerender
  useEffect(() => {
    if (wsHandlersDeps.length > 0) {
      setWebsocketHandlers();
    }
  }, wsHandlersDeps);

  // websocketのconnect処理
  useEffect(() => {
    // wsSettingsDepsが全てセット済みだったら, connectWebsocket()実行
    if (
      delayConnectSettings.isDelay &&
      (wsSettingsDeps.length <= 0 || wsSettingsDeps.every((elm) => !!elm))
    ) {
      _connectWebsocket(delayConnectSettings.isReconnect);
    }
  }, [delayConnectSettings, ...wsSettingsDeps]);

  const setWebsocketHandlers = (isReconnect = false): void => {
    const _ws = ws.current;
    // ws.currentがセットされていない限り, つまりconnectWebsocket()が実行されていない限り, useWebsocketの引数wsSettingsが未完成であっても各handlerはセットされない.
    if (_ws) {
      _ws.onopen = () => {
        clearTimeout(connectInterval.current);
        wsSettings.onopen(_ws);
      };
      _ws.onmessage = (e) => {
        const eData = deepCvtKeyFromSnakeToCamel(JSON.parse(e.data)) as Record<
          string,
          unknown
        >;
        const typeIoTsResult = wsSettings.typeIoTsOfResData.decode(eData);
        if (!isRight(typeIoTsResult)) {
          console.group();
          console.error(
            `Type does not match(ws onmessage). The object can be found below.`
          );
          console.error({ ...eData });
          console.groupEnd();
        }
        wsSettings.onmessage(eData, e, _ws, isReconnect);
      };
    }
  };

  /**
   * closeWsSafelyがきかなくなるので, oncloseのみrerenderできないように.
   */
  const setWebsocketOnclose = () => {
    const _ws = ws.current;
    if (_ws) {
      _ws.onclose = (e) => {
        if (
          e.code === CODE.WS.UNAUTHORIZED ||
          e.code === 1000 /* 接続の正常な完了 */ ||
          typeof e.code === "undefined" /* サーバダウン */
        ) {
          // ws切断
        } else {
          // ws再接続
          connectInterval.current = setTimeout(() => {
            if (!_ws || _ws.readyState == WebSocket.CLOSED) {
              _connect(true); // isReconnect = true
            }
          }, connectIntervalTime);
        }
        wsSettings.onclose(e, _ws);
      };
    }
  };

  const _connect = (isReconnect = false): void => {
    ws.current = new WebSocket(wsSettings.url);
    setWebsocketHandlers(isReconnect);
    setWebsocketOnclose();
  };

  const _connectWebsocket = (isReconnect = false) => {
    connectInterval.current = setTimeout(() => {
      return void 0;
    }, 0);
    _connect(isReconnect);
    setDelayConnectSettings({
      isDelay: false,
      isReconnect: false,
    });
  };

  const connectWebsocket = (isReconnect = false) => {
    // wsSettingsの準備が完了するまで遅延
    // setIsDelayConnect(true);
    setDelayConnectSettings({
      isDelay: true,
      isReconnect: isReconnect,
    });
  };

  // ws再接続 (background => active)
  useReconnectWebsocket(
    ws,
    () => {
      // _connectWebsocket(true);
      connectWebsocket(true);
    },
    wsState
  );

  return {
    connectWebsocket,
  };
};

/**
 * アプリがbackground => activeに状態変化した時, wsが切断されてしまうissueの対処.
 * 完全に接続を切り, 再度1から接続を開始する
 * @param wsRef
 * @param connectWebsocket
 */
const useReconnectWebsocket = (
  wsRef: React.MutableRefObject<WebSocket | undefined>,
  connectWebsocket: () => void,
  wsState: WsState
) => {
  const appState = useRef(AppState.currentState);
  const wsStateRef = useRef(wsState); // イベントハンドラー内で最新のstateを参照するため
  wsStateRef.current = wsState;

  /**
   * 単純な再接続ではなく, 一度切断してから再度1から接続を行う
   */
  const reconnectWsCompletely = (
    ws: WebSocket,
    _connectWebsocket: () => void
  ) => {
    // wsState(ex. chatState.talkingRoomCollection)でwebsocketがセットされていない時, 再接続をしない.
    // 例えば, 終了した直後のルームはuseWebsocket内では生きているため, 再接続が行われてしまう.
    if (wsStateRef.current !== null && !wsStateRef.current) {
      return;
    }

    closeWsSafely(ws);
    _connectWebsocket();
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    // background => active に復帰
    if (nextAppState === "active" && appState.current === "background") {
      if (wsRef.current) {
        reconnectWsCompletely(wsRef.current, connectWebsocket);
      }
    }
    appState.current = nextAppState;
  };
  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);
};

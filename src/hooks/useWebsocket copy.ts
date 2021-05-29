import { isRight } from "fp-ts/lib/Either";
import { useEffect, useRef, useState } from "react";

import { CODE } from "src/constants/statusCodes";
import { WsSettings } from "src/types/Types";
import { deepCvtKeyFromSnakeToCamel } from "src/utils";

type UseWebsocket = (
  deps?: unknown[]
) => {
  connectWebsocket: (wsSettings: WsSettings) => void;
};
/** websocket hook
 *
 * websocketのonmessageがstateに依存している場合, stateが変更されてもデフォルトではonmessage等は更新されない.
 * そこでdepsにその依存stateを配列で指定することで対応.
 * @param deps optional. 指定しなかった場合, 更新処理はスキップされる(デフォルトの振る舞い).
 * @returns
 */
export const useWebsocket: UseWebsocket = (deps = []) => {
  const [connectIntervalTime] = useState(2000);
  const connectInterval = useRef<NodeJS.Timeout>(
    setTimeout(() => {
      return void 0;
    }, 0)
  );
  const ws = useRef<WebSocket>();
  const wsSettings = useRef<WsSettings>();

  useEffect(() => {
    if (deps.length > 0 && wsSettings.current) {
      console.log("setWebsocketHandlers更新");

      setWebsocketHandlers(wsSettings.current);
    }
  }, deps);

  const setWebsocketHandlers = (
    _wsSettings: WsSettings,
    isReconnect = false
  ): void => {
    const _ws = ws.current;
    if (_ws) {
      _ws.onopen = () => {
        clearTimeout(connectInterval.current);
        _wsSettings.onopen(_ws);
      };
      _ws.onmessage = (e) => {
        const eData = deepCvtKeyFromSnakeToCamel(JSON.parse(e.data));
        const typeIoTsResult = _wsSettings.typeIoTsOfResData.decode(eData);
        if (!isRight(typeIoTsResult)) {
          console.group();
          console.error(
            `Type does not match(ws onmessage). The object can be found below.`
          );
          console.error({ ...eData });
          console.groupEnd();
        }
        _wsSettings.onmessage(eData, e, _ws, isReconnect);
      };
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
              _connect(_wsSettings, true); // isReconnect = true
            }
          }, connectIntervalTime);
        }
        _wsSettings.onclose(e, _ws);
      };
    }
  };

  const _connect = (_wsSettings: WsSettings, isReconnect = false): void => {
    ws.current = new WebSocket(_wsSettings.url);
    setWebsocketHandlers(_wsSettings, isReconnect);
    _wsSettings.registerWs && _wsSettings.registerWs(ws.current);
  };

  const connectWebsocket = (_wsSettings: WsSettings) => {
    connectInterval.current = setTimeout(() => {
      return void 0;
    }, 0);

    wsSettings.current = _wsSettings;
    _connect(_wsSettings);
  };

  return {
    connectWebsocket,
  };
};

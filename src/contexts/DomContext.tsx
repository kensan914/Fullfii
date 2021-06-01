import React, { createContext, useReducer, useContext } from "react";

import { usePushNotificationParams } from "src/hooks/pushNotifications/usePushNotificationParams";
import { DomActionType, DomState, DomDispatch } from "src/types/Types.context";

const domReducer = (prevState: DomState, action: DomActionType): DomState => {
  const _taskSchedules = { ...prevState.taskSchedules };
  const _pushNotificationParams = { ...prevState.pushNotificationParams };
  switch (action.type) {
    case "SCHEDULE_TASK":
      /** 指定したtaskKeyのタスクをスケジュール.
       * @param {Object} action [type, taskKey] */

      _taskSchedules[action.taskKey] = true;
      return { ...prevState, taskSchedules: _taskSchedules };

    case "DONE_TASK":
      /** スケジュールされたタスクの実行終了後に実行.
       * @param {Object} action [type, taskKey] */

      _taskSchedules[action.taskKey] = false;
      return { ...prevState, taskSchedules: _taskSchedules };

    case "SET_PUSH_NOTIFICATION_PARAMS":
      /** set pushNotificationParams.isPermission or pushNotificationParams.isChosenPermission
       * @param {Object} action [type, isPermission, isChosenPermission] */

      if (typeof action.isPermission !== "undefined") {
        _pushNotificationParams.isPermission = action.isPermission;
      }
      if (typeof action.isChosenPermission !== "undefined") {
        _pushNotificationParams.isChosenPermission = action.isChosenPermission;
      }

      return { ...prevState, pushNotificationParams: _pushNotificationParams };

    case "CONFIGURED_PUSH_NOTIFICATION":
      /** push通知設定をした際に実行. pushNotificationParamsを最新状態に更新.
       * @param {Object} action [type] */

      _pushNotificationParams.isChanged = true;
      return { ...prevState, pushNotificationParams: _pushNotificationParams };

    case "FINISH_SET_PUSH_NOTIFICATION_PARAMS":
      /** pushNotificationParamsを設定をした際に実行.
       * @param {Object} action [type] */

      _pushNotificationParams.isChanged = false;
      return { ...prevState, pushNotificationParams: _pushNotificationParams };

    default:
      console.warn(`Not found this action.type.`);
      return { ...prevState };
  }
};

const initDomState = Object.freeze({
  taskSchedules: {
    refreshRooms: false,
  },
  pushNotificationParams: {
    isPermission: false, // 既に設定され, かつ許可されている
    isChosenPermission: false, // 未だ通知設定がされていない
    isChanged: false, // depフラグ
  },
});
const domStateContext = createContext<DomState>({ ...initDomState });
const domDispatchContext = createContext<DomDispatch>(() => {
  return void 0;
});

export const useDomState = (): DomState => {
  const context = useContext(domStateContext);
  return context;
};
export const useDomDispatch = (): DomDispatch => {
  const context = useContext(domDispatchContext);
  return context;
};

export const DomProvider: React.FC = ({ children }) => {
  const [domState, domDispatch] = useReducer(domReducer, {
    ...initDomState,
    pushNotificationParams: {
      isPermission: false,
      isChosenPermission: false,
      isChanged: false,
    },
  });

  return (
    <domStateContext.Provider value={domState}>
      <domDispatchContext.Provider value={domDispatch}>
        {children}
      </domDispatchContext.Provider>
    </domStateContext.Provider>
  );
};

import React, { createContext, useReducer, useContext } from "react";

import { DomActionType, DomState, DomDispatch } from "src/types/Types.context";

const domReducer = (prevState: DomState, action: DomActionType): DomState => {
  const _taskSchedules = { ...prevState.taskSchedules };
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

    default:
      console.warn(`Not found this action.type.`);
      return { ...prevState };
  }
};

const initDomState = Object.freeze({
  taskSchedules: {
    refreshRooms: false,
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
  const [domState, domDispatch] = useReducer(domReducer, { ...initDomState });

  return (
    <domStateContext.Provider value={domState}>
      <domDispatchContext.Provider value={domDispatch}>
        {children}
      </domDispatchContext.Provider>
    </domStateContext.Provider>
  );
};

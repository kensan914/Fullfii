import { Dispatch, useEffect, useState } from "react";
import { useDomDispatch, useDomState } from "src/contexts/DomContext";

export const useLevelUp = (): {
  isOpenLevelUpModal: boolean;
  setIsOpenLevelUpModal: Dispatch<boolean>;
} => {
  const domState = useDomState();
  const domDispatch = useDomDispatch();

  const [isOpenLevelUpModal, setIsOpenLevelUpModal] = useState(false);

  useEffect(() => {
    if (domState.taskSchedules.openLevelUpModal) {
      setIsOpenLevelUpModal(true);

      domDispatch({ type: "DONE_TASK", taskKey: "openLevelUpModal" });
    }
  }, [domState.taskSchedules.openLevelUpModal]);

  return { isOpenLevelUpModal, setIsOpenLevelUpModal };
};

import { Dispatch, useEffect, useState } from "react";

import { useDomDispatch, useDomState } from "src/contexts/DomContext";
import { useProfileDispatch } from "src/contexts/ProfileContext";

export const useReview = (): {
  isOpenReviewModal: boolean;
  setIsOpenReviewModal: Dispatch<boolean>;
} => {
  const domState = useDomState();
  const domDispatch = useDomDispatch();
  const profileDispatch = useProfileDispatch();

  const [isOpenReviewModal, setIsOpenReviewModal] = useState(false);

  useEffect(() => {
    if (domState.taskSchedules.openReviewModal) {
      setIsOpenReviewModal(true);

      domDispatch({ type: "DONE_TASK", taskKey: "openReviewModal" });

      profileDispatch({ type: "HAS_REVIEWED" });
    }
  }, [domState.taskSchedules.openReviewModal]);

  return { isOpenReviewModal, setIsOpenReviewModal };
};

import React, { Dispatch } from "react";

import { MenuModal } from "src/components/molecules/Menu";
import { useAuthDispatch, useAuthState } from "src/contexts/AuthContext";
import { useProfileState } from "src/contexts/ProfileContext";
import { useRequestPatchMe } from "src/hooks/requests/useRequestMe";

type Props = {
  isOpenJobModal: boolean;
  setIsOpenJobModal: Dispatch<boolean>;
};
export const JobEditorMenu: React.FC<Props> = (props) => {
  const { isOpenJobModal, setIsOpenJobModal } = props;

  const profileState = useProfileState();
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();

  const { requestPatchMe } = useRequestPatchMe(
    () => void 0,
    () => void 0,
    () => {
      authDispatch({
        type: "SET_IS_SHOW_SPINNER",
        value: false,
      });
    }
  );

  return (
    <MenuModal
      isOpen={isOpenJobModal}
      setIsOpen={setIsOpenJobModal}
      items={
        profileState.profileParams?.job
          ? Object.values(profileState.profileParams.job).map((jobObj) => {
              return {
                label: jobObj.label,
                onPress: () => {
                  if (authState.token) {
                    authDispatch({
                      type: "SET_IS_SHOW_SPINNER",
                      value: true,
                    });
                    requestPatchMe({ data: { job: jobObj.key } });
                  }
                  setIsOpenJobModal(false);
                },
              };
            })
          : []
      }
    />
  );
};

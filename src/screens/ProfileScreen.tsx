import React, { useEffect, useState } from "react";
import { ProfileTemplate } from "src/components/templates/ProfileTemplate";
import { NO_NAME_LABEL } from "src/constants";
import { useProfileState } from "src/contexts/ProfileContext";

export const ProfileScreen: React.FC = () => {
  const profileState = useProfileState();

  // 初期状態であるか
  const [isInit, setIsInit] = useState(true);
  useEffect(() => {
    const _isInit =
      profileState.profile.name === NO_NAME_LABEL &&
      profileState.profile.gender.key === "notset" &&
      !profileState.profile.isSecretGender &&
      profileState.profile.job.key === "secret";
    // !profileState.profile.image; // HACK: no imageでもデフォルトURLが入ってしまうため見送り
    setIsInit(_isInit);
  }, [profileState.profile]);

  const [isShowProfileEditor, setIsShowProfileEditor] = useState(false);
  const [close, setClose] = useState(false);

  const onPressCloseProfileEditReminder = () => {
    setClose(true);
  };

  return (
    <ProfileTemplate
      isInit={isInit}
      isShowProfileEditor={isShowProfileEditor}
      setIsShowProfileEditor={setIsShowProfileEditor}
      close={close}
      onPressCloseProfileEditReminder={onPressCloseProfileEditReminder}
    />
  );
};

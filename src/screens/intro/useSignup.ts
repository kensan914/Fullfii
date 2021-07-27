import { useEffect, useState } from "react";

import { SignupProps } from "src/components/templates/intro/IntroSignupTemplate/pages/InputProfileTemplate";
import {
  useProfileDispatch,
  useProfileState,
} from "src/contexts/ProfileContext";
import { FormattedGenderKey, NotSetGenderKey } from "src/types/Types";
import { Job } from "src/types/Types.context";

export const useSignup = (): SignupProps => {
  const profileState = useProfileState();
  const profileDispatch = useProfileDispatch();

  // ユーザネーム
  const [username, setUsername] = useState("");
  const [maxUsernameLength] = useState(15);
  const [isFocusInputUsername, setIsFocusInputUsername] = useState(false);

  // 性別
  const genderKeys: FormattedGenderKey[] = ["female", "male", "secret"];
  const NOTSET_GENDER_KEY: NotSetGenderKey = "notset";
  const [genderKey, setGenderKey] = useState<
    FormattedGenderKey | NotSetGenderKey | undefined
  >(NOTSET_GENDER_KEY);

  // 職業
  const [job, setJob] = useState<Job>();
  const [isOpenJobModal, setIsOpenJobModal] = useState(false);
  const jobModalItems = profileState.profileParams?.job
    ? Object.values(profileState.profileParams.job).map((jobObj) => {
        return {
          label: jobObj.label,
          onPress: () => {
            setJob(jobObj);
            setIsOpenJobModal(false);
          },
        };
      })
    : [];

  const [canSignup, setCanSignup] = useState(false);
  useEffect(() => {
    setCanSignup(username.length > 0 && !!genderKey && !!job);
  }, [username, genderKey, job]);

  const signupProps: SignupProps = {
    username: username,
    setUsername: setUsername,
    maxUsernameLength: maxUsernameLength,
    isFocusInputUsername: isFocusInputUsername,
    setIsFocusInputUsername: setIsFocusInputUsername,
    genderKeys: genderKeys,
    genderKey: genderKey,
    setGenderKey: setGenderKey,
    isOpenJobModal: isOpenJobModal,
    setIsOpenJobModal: setIsOpenJobModal,
    job: job,
    jobModalItems: jobModalItems,
    canSignup: canSignup,
  };

  return signupProps;
};

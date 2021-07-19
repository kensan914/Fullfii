import React, { useEffect, useState } from "react";

import { FormattedGenderKey, NotSetGenderKey } from "src/types/Types";
import { SignupTemplate } from "src/components/templates/signup/SignupTemplate";
import {
  useProfileDispatch,
  useProfileState,
} from "src/contexts/ProfileContext";
import { Job } from "src/types/Types.context";
import { useNavigation } from "@react-navigation/native";

export const SignupScreen: React.FC = () => {
  const profileState = useProfileState();
  const profileDispatch = useProfileDispatch();
  const navigation = useNavigation();

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

  const onPressNext = () => {
    if (genderKey && job) {
      profileDispatch({
        type: "SET_PROFILE_BUFFER",
        username: username,
        genderKey: genderKey,
        jobKey: job.key,
      });
    }

    navigation.navigate("IntroCreateRoom");
  };

  return (
    <SignupTemplate
      username={username}
      setUsername={setUsername}
      maxUsernameLength={maxUsernameLength}
      isFocusInputUsername={isFocusInputUsername}
      setIsFocusInputUsername={setIsFocusInputUsername}
      genderKeys={genderKeys}
      genderKey={genderKey}
      setGenderKey={setGenderKey}
      isOpenJobModal={isOpenJobModal}
      setIsOpenJobModal={setIsOpenJobModal}
      job={job}
      jobModalItems={jobModalItems}
      canSignup={canSignup}
      onPressNext={onPressNext}
    />
  );
};

import React, { useState } from "react";
import { Alert } from "react-native";

import { OnboardingTemplate } from "src/components/templates/OnboardingTemplate";
import { BASE_URL } from "src/constants/env";
import { useAuthDispatch } from "src/contexts/AuthContext";
import { useProfileDispatch } from "src/contexts/ProfileContext";
import { useAxios } from "src/hooks/useAxios";
import { SignupResData, SignupResDataIoTs } from "src/types/Types";
import { generatePassword, URLJoin } from "src/utils";

export const OnboardingScreen: React.FC = () => {
  const authDispatch = useAuthDispatch();
  const profileDispatch = useProfileDispatch();

  const [password] = useState(generatePassword());

  const {
    isLoading: isLoadingPostSignup,
    request: requestPostSignup,
  } = useAxios(URLJoin(BASE_URL, "signup/"), "post", SignupResDataIoTs, {
    data: {
      ...{
        username: "",
        password: password,
      },
    },
    thenCallback: (resData) => {
      const _resData = resData as SignupResData;
      const _me = _resData.me;
      const _token = _resData.token;
      profileDispatch({ type: "SET_ALL", profile: _me });
      authDispatch({
        type: "COMPLETE_SIGNUP",
        token: _token,
        password: password,
      });
    },
    catchCallback: () => {
      Alert.alert("新規登録に失敗しました。");
    },
    limitRequest: 1,
  });

  return (
    <OnboardingTemplate
      requestPostSignup={requestPostSignup}
      isLoadingPostSignup={isLoadingPostSignup}
    />
  );
};

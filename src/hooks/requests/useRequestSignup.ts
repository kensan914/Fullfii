import { Alert } from "react-native";

import { BASE_URL } from "src/constants/env";
import { useAuthDispatch, useAuthState } from "src/contexts/AuthContext";
import {
  useProfileDispatch,
  useProfileState,
} from "src/contexts/ProfileContext";
import { SignupResData, SignupResDataIoTs } from "src/types/Types";
import { URLJoin } from "src/utils";
import { useAxios } from "src/hooks/useAxios";
import { Request } from "src/types/Types";

type UseRequestPostSignup = (
  username: string,
  password: string,
  gender?: string,
  job?: string,
  additionalThenCallback?: (meProfile: SignupResData) => void
) => {
  isLoadingPostSignup: boolean;
  requestPostSignup: Request;
};
export const useRequestPostSignup: UseRequestPostSignup = (
  username,
  password,
  gender,
  job,
  additionalThenCallback
) => {
  const authDispatch = useAuthDispatch();
  const profileDispatch = useProfileDispatch();
  const profileState = useProfileState();

  const {
    isLoading: isLoadingPostSignup,
    request: requestPostSignup,
  } = useAxios(URLJoin(BASE_URL, "signup/"), "post", SignupResDataIoTs, {
    data: {
      ...{
        username: username,
        password: password,
      },
      ...(gender === "male" || gender === "female" || gender === "notset"
        ? {
            gender: gender,
          }
        : {
            is_secret_gender: true,
          }),
      ...(job
        ? {
            job: job,
          }
        : {}),
      ...(profileState.isBanned /* 凍結経験有り */
        ? {
            is_ban: true,
          }
        : {}),
    },
    thenCallback: (resData) => {
      const _resData = resData as SignupResData;
      const _me = _resData.me;
      const _token = _resData.token;

      profileDispatch({ type: "SET_ALL", profile: _me });
      authDispatch({ type: "SET_TOKEN", token: _token });
      authDispatch({ type: "SET_PASSWORD", password: password });

      additionalThenCallback && additionalThenCallback(_resData);
    },
    catchCallback: () => {
      Alert.alert("新規登録に失敗しました。");
    },
    limitRequest: 1,
  });

  return { isLoadingPostSignup, requestPostSignup };
};

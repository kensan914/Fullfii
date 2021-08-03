import { useEffect, useState } from "react";

import { SignupProps } from "src/components/templates/intro/IntroSignupTemplate/pages/InputProfileTemplate";
import { useAuthDispatch, useAuthState } from "src/contexts/AuthContext";
import { useProfileState } from "src/contexts/ProfileContext";
import { useRequestPostRoom } from "src/hooks/requests/useRequestRooms";
import { useRequestPostSignup } from "src/hooks/requests/useRequestSignup";
import {
  FormattedGenderKey,
  NotSetGenderKey,
  SignupResData,
} from "src/types/Types";
import { Job } from "src/types/Types.context";
import { generatePassword } from "src/utils";
import { logEvent } from "src/utils/firebase/logEvent";

export const useSignup = (): {
  signupProps: SignupProps;
  onSubmitSignup: () => Promise<void>;
  isLoadingSignup: boolean;
} => {
  const profileState = useProfileState();
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();

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

  // サインアップ
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);
  const [password] = useState(generatePassword());
  const { requestPostSignup } = useRequestPostSignup(
    username,
    password,
    genderKey,
    job?.key
  );
  // ルーム作成用
  const { requestPostRoom } = useRequestPostRoom(
    authState.signupBuffer.introCreateRoom.roomName,
    null, // 公開範囲設定はできない
    null, // プライベート設定はできない
    null // ルーム画像の設定はできない
  );
  const onSubmitSignup = (): Promise<void> => {
    setIsLoadingSignup(true);
    return new Promise((resolve) => {
      logEvent("complete_intro_signup");
      const completeSignup = () => {
        authDispatch({
          type: "SUCCESS_SIGNUP_INTRO",
        });
        resolve();
      };
      requestPostSignup({
        thenCallback: (resData) => {
          const _resData = resData as SignupResData;
          const _token = _resData.token;

          if (authState.signupBuffer.introCreateRoom.isComplete) {
            requestPostRoom({
              token: _token,
              thenCallback: () => {
                completeSignup();
              },
            });
          } else {
            completeSignup();
          }
        },
      });
    });
  };

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

  return { signupProps, onSubmitSignup, isLoadingSignup };
};

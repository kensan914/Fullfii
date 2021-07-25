import { AxiosError } from "axios";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { useState } from "react";
import { Platform } from "react-native";

import { BASE_URL } from "src/constants/env";
import { useAuthState } from "src/contexts/AuthContext";
import { useAllContext } from "src/contexts/ContextUtils";
import { useProfileDispatch } from "src/contexts/ProfileContext";
import requestAxios, { useAxios } from "src/hooks/useAxios";
import {
  PutGenderResData,
  PutGenderResDataIoTs,
  Request,
} from "src/types/Types";
import { MeProfile, MeProfileIoTs, Profile } from "src/types/Types.context";
import { URLJoin } from "src/utils";
import { alertDeleteAuth } from "src/utils/auth/crud";

type UseRequestGetMe = (
  additionalThenCallback?: (meProfile: MeProfile) => void
) => {
  requestGetMe: Request;
};
export const useRequestGetMe: UseRequestGetMe = (additionalThenCallback) => {
  const [states, dispatches] = useAllContext();

  const { request: requestGetMe } = useAxios(
    URLJoin(BASE_URL, "me/"),
    "get",
    MeProfileIoTs,
    {
      token: states.authState.token ? states.authState.token : "",
      thenCallback: (resData) => {
        const meProfile = resData as MeProfile;

        dispatches.profileDispatch({ type: "SET_ALL", profile: meProfile });

        // 凍結経験(isBanned)の更新
        dispatches.profileDispatch({
          type: "SET_IS_BANNED",
          isBan: meProfile.isBan,
        });

        additionalThenCallback && additionalThenCallback(meProfile);
      },
      catchCallback: (err) => {
        if (err?.response?.status === 401) {
          // 認証エラー(アカウントが非活性されているため)でアカウント削除と判断
          alertDeleteAuth(dispatches);
        }
      },
    }
  );

  return { requestGetMe };
};

type UseRequestPatchMe = (
  additionalThenCallback?: (meProfile: MeProfile) => void,
  additionalCatchCallback?: (err: AxiosError) => void,
  additionalFinallyCallback?: (() => void) | undefined
) => {
  requestPatchMe: Request;
};
export const useRequestPatchMe: UseRequestPatchMe = (
  additionalThenCallback,
  additionalCatchCallback,
  additionalFinallyCallback
) => {
  const authState = useAuthState();
  const profileDispatch = useProfileDispatch();

  const { request: requestPatchMe } = useAxios(
    URLJoin(BASE_URL, "me/"),
    "patch",
    MeProfileIoTs,
    {
      token: authState.token ? authState.token : "",
      thenCallback: (resData) => {
        const meProfile = resData as MeProfile;
        profileDispatch({ type: "SET_ALL", profile: meProfile });

        additionalThenCallback && additionalThenCallback(meProfile);
      },
      catchCallback: (err) => {
        additionalCatchCallback && err && additionalCatchCallback(err);
      },
      finallyCallback: () => {
        additionalFinallyCallback && additionalFinallyCallback();
      },
    }
  );

  return { requestPatchMe };
};

type UseRequestPostProfileImage = () => {
  requestPostProfileImage: (_image: ImageInfo) => void;
  isLoadingRequestPostProfileImage: boolean;
};
export const useRequestPostProfileImage: UseRequestPostProfileImage = () => {
  const authState = useAuthState();
  const profileDispatch = useProfileDispatch();

  const [
    isLoadingRequestPostProfileImage,
    setIsLoadingRequestPostProfileImage,
  ] = useState(false);

  const requestPostProfileImage = (_image: ImageInfo) => {
    setIsLoadingRequestPostProfileImage(true);

    const url = URLJoin(BASE_URL, "me/profile-image/");

    const formData = new FormData();
    formData.append("image", {
      name: "avatar.jpg",
      uri:
        Platform.OS === "android"
          ? _image.uri
          : _image.uri.replace("file://", ""),
      type: "image/jpg",
    });

    requestAxios(url, "post", MeProfileIoTs, {
      token: authState.token ? authState.token : "",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      thenCallback: (resData) => {
        profileDispatch({ type: "SET_ALL", profile: resData as MeProfile });
      },
      finallyCallback: () => {
        setIsLoadingRequestPostProfileImage(false);
      },
    });
  };

  return {
    requestPostProfileImage,
    isLoadingRequestPostProfileImage,
  };
};

type UseRequestPatchBlockedAccount = (
  user?: Profile,
  additionalThenCallback?: () => void
) => {
  requestPatchBlockedAccount: Request;
  dynamicRequestPatchBlockedAccount: (user: Profile) => void;
  isLoadingRequestPatchBlockedAccount: boolean;
};
export const useRequestPatchBlockedAccount: UseRequestPatchBlockedAccount = (
  user,
  additionalThenCallback
) => {
  const authState = useAuthState();

  const {
    request: requestPatchBlockedAccount,
    isLoading: isLoadingRequestPatchBlockedAccount,
  } = useAxios(URLJoin(BASE_URL, "me/blocked-accounts/"), "patch", null, {
    data: {
      account_id: user ? user.id : "",
    },
    thenCallback: () => {
      additionalThenCallback && additionalThenCallback();
    },
    token: authState.token ? authState.token : "",
  });

  // 本関数の引数userではなく, 動的にユーザを変更させたい
  const dynamicRequestPatchBlockedAccount = (user: Profile) => {
    requestPatchBlockedAccount({
      data: {
        account_id: user ? user.id : "",
      },
    });
  };

  return {
    requestPatchBlockedAccount,
    dynamicRequestPatchBlockedAccount,
    isLoadingRequestPatchBlockedAccount,
  };
};

type UseRequestPutGender = (
  genderKey: string, // FormattedGenderKey
  additionalThenCallback?: (resData: PutGenderResData) => void,
  additionalCatchCallback?: (err: AxiosError) => void,
  additionalFinallyCallback?: (() => void) | undefined
) => {
  requestPutGender: Request;
};
export const useRequestPutGender: UseRequestPutGender = (
  genderKey,
  additionalThenCallback,
  additionalCatchCallback,
  additionalFinallyCallback
) => {
  const authState = useAuthState();
  const profileDispatch = useProfileDispatch();

  const { request: requestPutGender } = useAxios(
    URLJoin(BASE_URL, "me/gender"),
    "put",
    PutGenderResDataIoTs,
    {
      token: authState.token ? authState.token : "",
      data: { key: genderKey },
      thenCallback: (resData) => {
        const _resData = resData as PutGenderResData;
        profileDispatch({ type: "SET_ALL", profile: _resData.me });

        additionalThenCallback && additionalThenCallback(_resData);
      },
      catchCallback: (err) => {
        additionalCatchCallback && err && additionalCatchCallback(err);
      },
      finallyCallback: () => {
        additionalFinallyCallback && additionalFinallyCallback();
      },
    }
  );

  return { requestPutGender };
};

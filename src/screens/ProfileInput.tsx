import React from "react";

import { ProfileInputTemplate } from "src/components/templates/ProfileInputTemplate";
import requestAxios from "src/hooks/useAxios";
import { URLJoin } from "src/utils";
import { BASE_URL } from "src/constants/env";
import { MeProfile, MeProfileIoTs } from "src/types/Types.context";
import {
  PutGenderResData,
  PutGenderResDataIoTs,
  RequestPatchProfile,
  RequestPutGender,
} from "src/types/Types";

const ProfileInput: React.FC = () => {
  return (
    <ProfileInputTemplate
      requestPatchProfile={requestPatchProfile}
      requestPutGender={requestPutGender}
    />
  );
};

export default ProfileInput;

export const requestPatchProfile: RequestPatchProfile = (
  token,
  data,
  profileDispatch,
  successSubmit,
  errorSubmit,
  finallySubmit
) => {
  const url = URLJoin(BASE_URL, "me/");

  requestAxios(url, "patch", MeProfileIoTs, {
    data: data,
    thenCallback: (resData) => {
      profileDispatch({ type: "SET_ALL", profile: resData as MeProfile });
      successSubmit && successSubmit();
    },
    catchCallback: (err) => {
      err && errorSubmit && errorSubmit(err);
    },
    finallyCallback: finallySubmit,
    token: token,
  });
};

const requestPutGender: RequestPutGender = (
  token,
  putGenderKey,
  profileDispatch,
  successSubmit,
  errorSubmit
) => {
  const url = URLJoin(BASE_URL, "me/gender/");

  requestAxios(url, "put", PutGenderResDataIoTs, {
    data: { key: putGenderKey },
    thenCallback: (resData) => {
      const _resData = resData as PutGenderResData;
      profileDispatch({ type: "SET_ALL", profile: _resData.me });
      successSubmit && successSubmit();
    },
    catchCallback: (err) => {
      err && errorSubmit && errorSubmit(err);
    },
    token: token,
  });
};

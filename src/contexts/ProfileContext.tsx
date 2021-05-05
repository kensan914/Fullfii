import React, { createContext, useReducer, useContext } from "react";

import { BASE_URL } from "src/constants/env";
import { useAxios } from "src/hooks/useAxios";
import { asyncStoreJson, URLJoin } from "src/utils";
import {
  MeProfile,
  Profile,
  ProfileActionType,
  ProfileDispatch,
  ProfileParams,
  ProfileParamsIoTs,
  ProfileState,
} from "src/types/Types.context";

const profileReducer = (
  prevState: ProfileState,
  action: ProfileActionType
): ProfileState => {
  let _profile: MeProfile;
  switch (action.type) {
    case "SET_ALL":
      /** profileをset
       * @param {Object} action [type, profile] */

      _profile = { ...initMeProfile, ...action.profile };
      asyncStoreJson("profile", _profile);
      return {
        ...prevState,
        profile: _profile,
      };

    case "SET_PARAMS":
      /** profileParamsをset
       * @param {Object} action [type, profileParams] */

      return {
        ...prevState,
        profileParams: action.profileParams,
      };

    case "DANGEROUSLY_RESET_OTHER_THAN_PROFILE_PARAMS":
      /** profile stateを初期化. 再サインアップ時のためにprofileParamsは対象外とする.
       * @param {Object} action [type] */

      return {
        ...prevState,
        profile: { ...initMeProfile },
      };

    default:
      console.warn(`Not found this action.type.`);
      return { ...prevState };
  }
};

export const initProfile: Profile = Object.freeze({
  id: "",
  name: "",
  introduction: "",
  numOfThunks: 0,
  gender: { key: "female", name: "", label: "" },
  isSecretGender: false,
  job: { key: "", name: "", label: "" },
  genreOfWorries: [],
  image: "",
  me: true,
});

export const initMeProfile: MeProfile = Object.freeze({
  id: "",
  name: "",
  introduction: "",
  numOfThunks: 0,
  gender: { key: "female", name: "", label: "" },
  isSecretGender: false,
  job: { key: "", name: "", label: "" },
  genreOfWorries: [],
  canTalkHeterosexual: false,
  dateJoined: "",
  image: "",
  me: true,
  plan: { key: "", label: "" },
  deviceToken: "",
  isActive: true,
});

const profileStateContext = createContext<ProfileState>({
  profile: { ...initMeProfile },
  profileParams: null,
});
const profileDispatchContext = createContext<ProfileDispatch>(() => {
  return void 0;
});

export const useProfileState = (): ProfileState => {
  const context = useContext(profileStateContext);
  return context;
};
export const useProfileDispatch = (): ProfileDispatch => {
  const context = useContext(profileDispatchContext);
  return context;
};

type Props = {
  profile: MeProfile | null;
};
export const ProfileProvider: React.FC<Props> = ({ children, profile }) => {
  const [profileState, profileDispatch] = useReducer(profileReducer, {
    profile: profile ? profile : { ...initMeProfile },
    profileParams: null,
  });

  // fetch profile params
  useAxios(URLJoin(BASE_URL, "profile-params/"), "get", ProfileParamsIoTs, {
    thenCallback: (resData) => {
      profileDispatch({
        type: "SET_PARAMS",
        profileParams: resData as ProfileParams,
      });
    },
    shouldRequestDidMount: true,
  });

  return (
    <profileStateContext.Provider value={profileState}>
      <profileDispatchContext.Provider value={profileDispatch}>
        {children}
      </profileDispatchContext.Provider>
    </profileStateContext.Provider>
  );
};

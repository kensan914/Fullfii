import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Block } from "galio-framework";

import requestAxios from "src/hooks/useAxios";
import { URLJoin } from "src/utils";
import {
  BASE_URL,
  ADMOB_BANNER_WIDTH,
  ADMOB_BANNER_HEIGHT,
} from "src/constants/env";
import { ProfileEditorTemplate } from "src/components/templates/ProfileEditorTemplate";
import { RequestPostProfileImage } from "src/types/Types";
import { MeProfile, MeProfileIoTs } from "src/types/Types.context";

const ProfileEditor: React.FC = () => {
  return (
    <Block flex style={styles.container}>
      <ProfileEditorTemplate
        requestPostProfileImage={requestPostProfileImage}
      />
    </Block>
  );
};

export default ProfileEditor;

const requestPostProfileImage: RequestPostProfileImage = (
  token,
  image,
  profileDispatch,
  successSubmit,
  errorSubmit
) => {
  const url = URLJoin(BASE_URL, "me/profile-image/");

  const formData = new FormData();
  formData.append("image", {
    name: "avatar.jpg",
    uri:
      Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""),
    type: "image/jpg",
  });

  requestAxios(url, "post", MeProfileIoTs, {
    token,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    thenCallback: (resData) => {
      profileDispatch({ type: "SET_ALL", profile: resData as MeProfile });
      successSubmit();
    },
    catchCallback: (err) => {
      errorSubmit(err);
    },
  });
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
  },
  adMobBanner: {
    width: ADMOB_BANNER_WIDTH,
    height: ADMOB_BANNER_HEIGHT,
    zIndex: 2,
    position: "absolute",
    bottom: 0,
  },
});

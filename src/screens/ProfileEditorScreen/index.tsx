import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { getPermissionAsync, pickImage } from "src/utils/imagePicker";
import { useProfileState } from "src/contexts/ProfileContext";
import { useAuthState } from "src/contexts/AuthContext";
import { ProfileEditorNavigationPros } from "src/types/Types";
import { formatGender } from "src/utils";
import { useRequestPostProfileImage } from "src/hooks/requests/useRequestMe";
import { ProfileEditorTemplate } from "src/components/templates/ProfileEditorTemplate";

export const ProfileEditorScreen: React.FC = () => {
  const navigation = useNavigation<ProfileEditorNavigationPros>();
  const profileState = useProfileState();
  const authState = useAuthState();

  const meProfile = profileState.profile;
  const meFormattedGender = formatGender(
    meProfile.gender,
    meProfile.isSecretGender
  );
  const [isOpenJobModal, setIsOpenJobModal] = useState(false);

  const { requestPostProfileImage, isLoadingRequestPostProfileImage } =
    useRequestPostProfileImage();

  const onPressNameEditor = () => {
    navigation.navigate("ProfileInput", {
      user: meProfile,
      prevValue: meProfile.name,
      screen: "InputName",
    });
  };
  const onPressGenderEditor = () => {
    navigation.navigate("ProfileInput", {
      user: meProfile,
      prevValue: meFormattedGender.key,
      screen: "InputGender",
    });
  };
  const onPressJobEditor = () => {
    setIsOpenJobModal(true);
  };
  const onPressProfileImageEditor = async () => {
    const result = await getPermissionAsync();
    if (result) {
      // onLoad();
      pickImage().then((image) => {
        if (image && authState.token) {
          requestPostProfileImage(image);
        }
      });
    }
  };
  const onPressIsPrivateProfileEditor = () =>
    navigation.navigate("ProfileInput", {
      user: meProfile,
      prevValue: meProfile.isPrivateProfile,
      screen: "InputIsPrivateProfile",
    });

  return (
    <ProfileEditorTemplate
      meProfile={meProfile}
      meFormattedGender={meFormattedGender}
      isOpenJobModal={isOpenJobModal}
      setIsOpenJobModal={setIsOpenJobModal}
      isLoadingRequestPostProfileImage={isLoadingRequestPostProfileImage}
      onPressNameEditor={onPressNameEditor}
      onPressGenderEditor={onPressGenderEditor}
      onPressJobEditor={onPressJobEditor}
      onPressProfileImageEditor={onPressProfileImageEditor}
      onPressIsPrivateProfileEditor={onPressIsPrivateProfileEditor}
    />
  );
};

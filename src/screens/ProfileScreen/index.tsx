import React from "react";
import { useNavigation } from "@react-navigation/native";

import { ProfileTemplate } from "src/components/templates/ProfileTemplate";
import { useProfileState } from "src/contexts/ProfileContext";
import { Profile } from "src/types/Types.context";

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const profileState = useProfileState();

  const meProfile = profileState.profile;
  const favoriteUsers: Profile[] = [meProfile];
  // const favoriteUsers: Profile[] = []; // if empty

  const onTransitionProfileEditor = () => {
    navigation.navigate("ProfileEditor");
  };

  return (
    <ProfileTemplate
      meProfile={meProfile}
      favoriteUsers={favoriteUsers}
      onTransitionProfileEditor={onTransitionProfileEditor}
    />
  );
};

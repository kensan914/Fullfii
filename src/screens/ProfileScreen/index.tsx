import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ProfileTemplate } from "src/components/templates/ProfileTemplate";

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();

  const onTransitionProfileEditor = () => {
    navigation.navigate("ProfileEditor");
  };

  return (
    <ProfileTemplate onTransitionProfileEditor={onTransitionProfileEditor} />
  );
};

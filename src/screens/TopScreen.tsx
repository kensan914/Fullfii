import { useNavigation } from "@react-navigation/core";
import React from "react";
import { TopTemplate } from "src/components/templates/TopTemplate";

export const TopScreen: React.FC = () => {
  const navigation = useNavigation();
  const onPressConsent = () => {
    navigation.navigate("Onboarding");
  };

  return <TopTemplate onPressConsent={onPressConsent} />;
};

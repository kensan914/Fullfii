import React from "react";
import { useNavigation } from "@react-navigation/native";

import { IntroCreateRoomTemplate } from "src/components/templates/intro/IntroCreateRoomTemplate";

export const IntroCreateRoomScreen: React.FC = () => {
  const navigation = useNavigation();

  const onComplete = () => {
    navigation.navigate("IntroTop");
  };

  return <IntroCreateRoomTemplate onComplete={onComplete} />;
};

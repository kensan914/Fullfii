import React from "react";
import { useNavigation } from "@react-navigation/native";

import { IntroParticipateRoomTemplate } from "src/components/templates/intro/IntroParticipateRoomTemplate";

export const IntroParticipateRoomScreen: React.FC = () => {
  const navigation = useNavigation();

  const onComplete = () => {
    navigation.navigate("IntroTop");
  };

  return <IntroParticipateRoomTemplate onComplete={onComplete} />;
};

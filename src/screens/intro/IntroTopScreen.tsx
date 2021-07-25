import { useNavigation } from "@react-navigation/native";
import React from "react";

import { IntroTopTemplate } from "src/components/templates/intro/IntroTopTemplate";

export const IntroTopScreen: React.FC = () => {
  const navigation = useNavigation();

  const navigateIntroCreateRoom = () => {
    navigation.navigate("IntroCreateRoom");
  };
  const navigateIntroParticipateRoom = () => {
    navigation.navigate("IntroParticipateRoom");
  };
  const navigateIntroSignup = () => {
    navigation.navigate("IntroSignup");
  };

  return (
    <IntroTopTemplate
      navigateIntroCreateRoom={navigateIntroCreateRoom}
      navigateIntroParticipateRoom={navigateIntroParticipateRoom}
      navigateIntroSignup={navigateIntroSignup}
    />
  );
};

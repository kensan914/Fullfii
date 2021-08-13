import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";

import { IntroTopTemplate } from "src/components/templates/intro/IntroTopTemplate";
import { useAuthDispatch, useAuthState } from "src/contexts/AuthContext";
import { useIntroTopAnimation } from "src/screens/intro/IntroTopScreen/useIntroTopAnimation";

export const IntroTopScreen: React.FC = () => {
  const navigation = useNavigation();
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();

  // サインアップ済みならHOMEへ (サインアップ後にアプリを落とした場合)
  useEffect(() => {
    if (authState.signupBuffer.introSignup.isSignedup) {
      authDispatch({
        type: "COMPLETE_INTRO",
        initBottomTabRouteName: authState.signupBuffer.introCreateRoom
          .isComplete
          ? "MyRooms"
          : "Rooms",
      });
    }
  }, []);

  const introTopAnimationProps = useIntroTopAnimation();

  // const navigateIntroCreateRoom = () => {
  //   if (!authState.signupBuffer.introCreateRoom.isComplete) {
  //     logEvent("navigate_intro_create_room");
  //     navigation.navigate("IntroCreateRoom");
  //   }
  // };
  // const navigateIntroParticipateRoom = () => {
  //   if (!authState.signupBuffer.introParticipateRoom.isComplete) {
  //     logEvent("navigate_intro_participate_room");
  //     navigation.navigate("IntroParticipateRoom");
  //   }
  // };
  // const navigateIntroSignup = () => {
  //   logEvent("navigate_intro_signup");
  //   navigation.navigate("IntroSignup");
  // };

  return (
    <IntroTopTemplate
      // signupBuffer={authState.signupBuffer}
      // navigateIntroCreateRoom={navigateIntroCreateRoom}
      // navigateIntroParticipateRoom={navigateIntroParticipateRoom}
      // navigateIntroSignup={navigateIntroSignup}
      animationProps={introTopAnimationProps}
    />
  );
};

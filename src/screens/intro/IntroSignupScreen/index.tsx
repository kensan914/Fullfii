import React, { useRef } from "react";
import { Platform } from "react-native";

import { IntroSignupTemplate } from "src/components/templates/intro/IntroSignupTemplate";
import { AnimatedViewMethods } from "src/components/templates/intro/organisms/AnimatedView";
import {
  BodyAnimSettings_inputProfile,
  BodyAnimSettings_pushNotificationReminder,
} from "src/types/Types";
import { useSignup } from "src/screens/intro/IntroSignupScreen/useSignup";
import { useAuthDispatch, useAuthState } from "src/contexts/AuthContext";

export const IntroSignupScreen: React.FC = () => {
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();

  const onComplete = () => {
    authDispatch({
      type: "COMPLETE_INTRO",
      initBottomTabRouteName: authState.signupBuffer.introCreateRoom.isComplete
        ? "MyRooms"
        : "Rooms",
    });
  };

  const { signupProps, onSubmitSignup, isLoadingSignup } = useSignup();

  const animatedViewRef_inputProfile1 = useRef<AnimatedViewMethods>(null);
  // const animatedViewRef_inputProfile2 = useRef<AnimatedViewMethods>(null);
  const bodyAnimSettings_inputProfile: BodyAnimSettings_inputProfile = [
    {
      ref: animatedViewRef_inputProfile1,
      isAuto: true,
      delayStartIntervalMs: 500,
    },
    // {
    //   ref: animatedViewRef_inputProfile2,
    //   isAuto: true,
    //   delayStartIntervalMs: 200,
    // },
  ];

  const animatedViewRef_pushNotificationReminder1 =
    useRef<AnimatedViewMethods>(null);
  const animatedViewRef_pushNotificationReminder2 =
    useRef<AnimatedViewMethods>(null);
  const bodyAnimSettings_pushNotificationReminder: BodyAnimSettings_pushNotificationReminder =
    [
      {
        ref: animatedViewRef_pushNotificationReminder1,
      },
      ...(Platform.OS === "ios"
        ? [
            {
              ref: animatedViewRef_pushNotificationReminder2,
            },
          ]
        : []),
    ];

  return (
    <IntroSignupTemplate
      onComplete={onComplete}
      bodyAnimSettings_inputProfile={bodyAnimSettings_inputProfile}
      signupProps={signupProps}
      onSubmitSignup={onSubmitSignup}
      isLoadingSignup={isLoadingSignup}
      bodyAnimSettings_pushNotificationReminder={
        bodyAnimSettings_pushNotificationReminder
      }
    />
  );
};

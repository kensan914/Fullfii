import React, { useRef } from "react";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { IntroSignupTemplate } from "src/components/templates/intro/IntroSignupTemplate";
import { AnimatedViewMethods } from "src/components/templates/intro/organisms/AnimatedView";
import {
  BodyAnimSettings_inputProfile,
  BodyAnimSettings_pushNotificationReminder,
} from "src/types/Types";
import { useSignup } from "src/screens/intro/useSignup";

export const IntroSignupScreen: React.FC = () => {
  const navigation = useNavigation();

  const signupProps = useSignup();

  const onComplete = () => {
    alert("homeへ");
  };

  const animatedViewRef_inputProfile1 = useRef<AnimatedViewMethods>(null);
  const animatedViewRef_inputProfile2 = useRef<AnimatedViewMethods>(null);
  const bodyAnimSettings_inputProfile: BodyAnimSettings_inputProfile = [
    {
      ref: animatedViewRef_inputProfile1,
      isAuto: true,
      delayStartIntervalMs: 500,
    },
    {
      ref: animatedViewRef_inputProfile2,
      isAuto: true,
      delayStartIntervalMs: 200,
    },
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
      bodyAnimSettings_pushNotificationReminder={
        bodyAnimSettings_pushNotificationReminder
      }
    />
  );
};

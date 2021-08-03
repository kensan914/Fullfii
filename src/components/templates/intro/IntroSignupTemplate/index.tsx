import React from "react";
import { Platform } from "react-native";

import { IntroSlide } from "src/components/templates/intro/organisms/IntroSlide";
import {
  InputProfileTemplate,
  SignupProps,
} from "src/components/templates/intro/IntroSignupTemplate/pages/InputProfileTemplate";
import { PushNotificationReminderTemplate } from "src/components/templates/intro/IntroSignupTemplate/pages/PushNotificationReminderTemplate";
import {
  BodyAnimSettings_inputProfile,
  BodyAnimSettings_pushNotificationReminder,
  IntroTemplateProps,
} from "src/types/Types";
import { logEvent } from "src/utils/firebase/logEvent";

type Props = {
  bodyAnimSettings_inputProfile: BodyAnimSettings_inputProfile;
  signupProps: SignupProps;
  onSubmitSignup: () => Promise<void>;
  isLoadingSignup: boolean;
  bodyAnimSettings_pushNotificationReminder: BodyAnimSettings_pushNotificationReminder;
};
export const IntroSignupTemplate: React.FC<Props & IntroTemplateProps> = (
  props
) => {
  const {
    bodyAnimSettings_inputProfile,
    signupProps,
    onSubmitSignup,
    isLoadingSignup,
    bodyAnimSettings_pushNotificationReminder,
    onComplete,
  } = props;

  return (
    <IntroSlide
      pageSettings={[
        {
          body: (
            <InputProfileTemplate
              bodyAnimSettings={bodyAnimSettings_inputProfile}
              {...signupProps}
            />
          ),
          title: "プロフィールを作成しよう",
          bodyAnimSettings: bodyAnimSettings_inputProfile,
          canPressBottomButton: signupProps.canSignup,
          bottomButtonLabel: Platform.OS === "ios" ? "通知設定へ" : void 0,
          onPressBottomAsync: onSubmitSignup,
          isLoading: isLoadingSignup,
        },
        {
          body: (
            <PushNotificationReminderTemplate
              username={signupProps.username}
              bodyAnimSettings={bodyAnimSettings_pushNotificationReminder}
            />
          ),
          title:
            Platform.OS === "ios"
              ? "メッセージが来たらお知らせするよ"
              : "プロフィールの登録が完了しました！",
          headerLeftAnimationType: "CRACKER",
          bodyAnimSettings: bodyAnimSettings_pushNotificationReminder,
          bottomButtonLabel: "はじめる",
          onPressBottom: () => {
            logEvent("complete_intro");
          },
        },
      ]}
      onComplete={onComplete}
    />
  );
};

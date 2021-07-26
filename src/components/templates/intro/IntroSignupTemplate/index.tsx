import React from "react";

import { IntroSlide } from "src/components/templates/intro/organisms/IntroSlide";
import { InputProfileTemplate } from "src/components/templates/intro/IntroSignupTemplate/pages/InputProfileTemplate";
import { PushNotificationReminderTemplate } from "src/components/templates/intro/IntroSignupTemplate/pages/PushNotificationReminderTemplate";
import { IntroTemplateProps } from "src/types/Types";

export const IntroSignupTemplate: React.FC<IntroTemplateProps> = (props) => {
  const { onComplete } = props;

  return (
    <IntroSlide
      pageSettings={[
        { body: <InputProfileTemplate />, title: "プロフィールを作成しよう" },
        {
          body: <PushNotificationReminderTemplate />,
          title: "メッセージが来たらお知らせするよ",
          headerLeftAnimationType: "POP",
        },
      ]}
      onComplete={onComplete}
    />
  );
};

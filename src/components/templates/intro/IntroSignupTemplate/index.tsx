import React from "react";

import { IntroSlide } from "src/components/templates/intro/organisms/IntroSlide";
import { InputProfileTemplate } from "src/components/templates/intro/IntroSignupTemplate/pages/InputProfileTemplate";
import { PushNotificationReminderTemplate } from "src/components/templates/intro/IntroSignupTemplate/pages/PushNotificationReminderTemplate";

export const IntroSignupTemplate: React.FC = () => {
  return (
    <IntroSlide
      pageStack={[
        <InputProfileTemplate />,
        <PushNotificationReminderTemplate />,
      ]}
    />
  );
};

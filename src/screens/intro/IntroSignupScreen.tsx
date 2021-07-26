import React from "react";

import { IntroSignupTemplate } from "src/components/templates/intro/IntroSignupTemplate";

export const IntroSignupScreen: React.FC = () => {
  const onComplete = () => {
    alert("homeへ");
  };

  return <IntroSignupTemplate onComplete={onComplete} />;
};

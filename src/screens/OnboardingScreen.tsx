import React from "react";

import { OnboardingTemplate } from "src/components/templates/OnboardingTemplate";
import { useAuthDispatch } from "src/contexts/AuthContext";

export const OnboardingScreen: React.FC = () => {
  const authDispatch = useAuthDispatch();
  const onPressCompleteInto = () => {
    authDispatch({ type: "COMPLETE_INTRO" });
  };

  return <OnboardingTemplate onPressCompleteInto={onPressCompleteInto} />;
};

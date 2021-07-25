import React from "react";

import { IntroSlide } from "src/components/templates/intro/organisms/IntroSlide";
import { ExplanationRoomParticipateTemplate } from "src/components/templates/intro/IntroParticipateRoomTemplate/pages/ExplanationRoomParticipateTemplate";
import { ExplanationRoomParticipate2Template } from "src/components/templates/intro/IntroParticipateRoomTemplate/pages/ExplanationRoomParticipate2Template";

export const IntroParticipateRoomTemplate: React.FC = () => {
  return (
    <IntroSlide
      pageStack={[
        <ExplanationRoomParticipateTemplate />,
        <ExplanationRoomParticipate2Template />,
      ]}
    />
  );
};

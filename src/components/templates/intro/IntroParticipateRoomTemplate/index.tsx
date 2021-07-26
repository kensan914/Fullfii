import React from "react";

import { IntroSlide } from "src/components/templates/intro/organisms/IntroSlide";
import { ExplanationRoomParticipateTemplate } from "src/components/templates/intro/IntroParticipateRoomTemplate/pages/ExplanationRoomParticipateTemplate";
import { ExplanationRoomParticipate2Template } from "src/components/templates/intro/IntroParticipateRoomTemplate/pages/ExplanationRoomParticipate2Template";
import { IntroTemplateProps } from "src/types/Types";

export const IntroParticipateRoomTemplate: React.FC<IntroTemplateProps> = (
  props
) => {
  const { onComplete } = props;

  return (
    <IntroSlide
      pageSettings={[
        {
          body: <ExplanationRoomParticipateTemplate />,
          title: "共感できる悩みを聞いてあげよう",
        },
        {
          body: <ExplanationRoomParticipate2Template />,
          title: "悩みを聞くにはルームに入室しよう",
          bottomButtonLabel: "分かった！",
          headerLeftAnimationType: "POP",
        },
      ]}
      onComplete={onComplete}
    />
  );
};

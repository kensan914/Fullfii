import React from "react";

import { IntroSlide } from "src/components/templates/intro/organisms/IntroSlide";
import { ExplanationRoomParticipateTemplate } from "src/components/templates/intro/IntroParticipateRoomTemplate/pages/ExplanationRoomParticipateTemplate";
import {
  BodyAnimSettings_explanationRoomParticipate,
  IntroTemplateProps,
} from "src/types/Types";

type Props = {
  bodyAnimSettings_explanationRoomParticipate: BodyAnimSettings_explanationRoomParticipate;
};
export const IntroParticipateRoomTemplate: React.FC<
  Props & IntroTemplateProps
> = (props) => {
  const { bodyAnimSettings_explanationRoomParticipate, onComplete } = props;

  return (
    <IntroSlide
      pageSettings={[
        {
          body: (
            <ExplanationRoomParticipateTemplate
              bodyAnimSettings={bodyAnimSettings_explanationRoomParticipate}
            />
          ),
          title: "悩みを聞くにはルームに入室しよう",
          bottomButtonLabel: "分かった！",
          headerLeftAnimationType: "CHECK",
          bodyAnimSettings: bodyAnimSettings_explanationRoomParticipate,
        },
      ]}
      onComplete={onComplete}
    />
  );
};

import React from "react";

import { IntroSlide } from "src/components/templates/intro/organisms/IntroSlide";
import { ExplanationRoomTemplate } from "src/components/templates/intro/IntroCreateRoomTemplate/pages/ExplanationRoomTemplate";
import { InputRoomNameTemplate } from "src/components/templates/intro/IntroCreateRoomTemplate/pages/InputRoomNameTemplate";
import { InputIsExcludeDifferentGenderTemplate } from "src/components/templates/intro/IntroCreateRoomTemplate/pages/InputIsExcludeDifferentGenderTemplate";
import { CreatedRoomTemplate } from "src/components/templates/intro/IntroCreateRoomTemplate/pages/CreatedRoomTemplate";

export const IntroCreateRoomTemplate: React.FC = () => {
  return (
    <IntroSlide
      pageSettings={[
        {
          body: <ExplanationRoomTemplate />,
          title: "あなたの悩みを話すためのルームを作ろう",
        },
        { body: <InputRoomNameTemplate />, title: "" },
        { body: <InputIsExcludeDifferentGenderTemplate />, title: "" },
        {
          body: <CreatedRoomTemplate />,
          title: "",
          bottomButtonLabel: "分かった！",
        },
      ]}
    />
  );
};

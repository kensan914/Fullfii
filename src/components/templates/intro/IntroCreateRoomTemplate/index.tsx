import React from "react";

import { IntroSlide } from "src/components/templates/intro/organisms/IntroSlide";
import { ExplanationRoomTemplate } from "src/components/templates/intro/IntroCreateRoomTemplate/pages/ExplanationRoomTemplate";
import { InputRoomNameTemplate } from "src/components/templates/intro/IntroCreateRoomTemplate/pages/InputRoomNameTemplate";
import { CreatedRoomTemplate } from "src/components/templates/intro/IntroCreateRoomTemplate/pages/CreatedRoomTemplate";
import { IntroTemplateProps } from "src/types/Types";

export const IntroCreateRoomTemplate: React.FC<IntroTemplateProps> = (
  props
) => {
  const { onComplete } = props;

  return (
    <IntroSlide
      pageSettings={[
        {
          body: <ExplanationRoomTemplate />,
          title: "あなたの悩みを話すためのルームを作ろう",
        },
        { body: <InputRoomNameTemplate />, title: "話したい悩みは何ですか？" },
        {
          body: <CreatedRoomTemplate />,
          title: "ルームが出来ました！",
          bottomButtonLabel: "分かった！",
          headerLeftAnimationType: "POP",
        },
      ]}
      onComplete={onComplete}
    />
  );
};

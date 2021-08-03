import React from "react";

import { IntroSlide } from "src/components/templates/intro/organisms/IntroSlide";
import { ExplanationRoomTemplate } from "src/components/templates/intro/IntroCreateRoomTemplate/pages/ExplanationRoomTemplate";
import {
  CreateRoomProps,
  InputRoomNameTemplate,
} from "src/components/templates/intro/IntroCreateRoomTemplate/pages/InputRoomNameTemplate";
import { CreatedRoomTemplate } from "src/components/templates/intro/IntroCreateRoomTemplate/pages/CreatedRoomTemplate";
import {
  BodyAnimSettings_createdRoom,
  BodyAnimSettings_explanationRoom,
  BodyAnimSettings_inputRoomName,
  IntroTemplateProps,
} from "src/types/Types";
import { logEvent } from "src/utils/firebase/logEvent";

type Props = {
  bodyAnimSettings_explanationRoom: BodyAnimSettings_explanationRoom;
  bodyAnimSettings_inputRoomName: BodyAnimSettings_inputRoomName;
  canCreateRoom: boolean;
  createRoomProps: CreateRoomProps;
  setRoomNameIntro: () => void;
  bodyAnimSettings_createdRoom: BodyAnimSettings_createdRoom;
};
export const IntroCreateRoomTemplate: React.FC<Props & IntroTemplateProps> = (
  props
) => {
  const {
    bodyAnimSettings_explanationRoom,
    bodyAnimSettings_inputRoomName,
    canCreateRoom,
    createRoomProps,
    setRoomNameIntro,
    bodyAnimSettings_createdRoom,
    onComplete,
  } = props;

  return (
    <IntroSlide
      pageSettings={[
        {
          body: (
            <ExplanationRoomTemplate
              bodyAnimSettings={bodyAnimSettings_explanationRoom}
            />
          ),
          title: "あなたの悩みを話すためのルームを作ろう",
          bodyAnimSettings: bodyAnimSettings_explanationRoom,
        },
        {
          body: (
            <InputRoomNameTemplate
              {...createRoomProps}
              bodyAnimSettings={bodyAnimSettings_inputRoomName}
            />
          ),
          title: "話したい悩みは何ですか？",
          bodyAnimSettings: bodyAnimSettings_inputRoomName,
          canPressBottomButton: canCreateRoom,
          onPressBottom: () => {
            setRoomNameIntro();
            logEvent("input_intro_room_name");
          },
        },
        {
          body: (
            <CreatedRoomTemplate
              roomName={createRoomProps.roomName}
              bodyAnimSettings={bodyAnimSettings_createdRoom}
            />
          ),
          title: "ルームが出来ました！",
          bottomButtonLabel: "分かった！",
          headerLeftAnimationType: "CRACKER",
          bodyAnimSettings: bodyAnimSettings_createdRoom,
          onPressBottom: () => {
            logEvent("complete_intro_create_room");
          },
        },
      ]}
      onComplete={onComplete}
    />
  );
};

import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";

import { IntroParticipateRoomTemplate } from "src/components/templates/intro/IntroParticipateRoomTemplate";
import { AnimatedViewMethods } from "src/components/templates/intro/organisms/AnimatedView";
import { BodyAnimSettings_explanationRoomParticipate } from "src/types/Types";
import { useAuthDispatch } from "src/contexts/AuthContext";

export const IntroParticipateRoomScreen: React.FC = () => {
  const navigation = useNavigation();
  const authDispatch = useAuthDispatch();

  const onComplete = () => {
    navigation.navigate("IntroTop");
  };

  useEffect(() => {
    authDispatch({
      type: "COMPLETE_ROOM_INTRO",
      introType: "introParticipateRoom",
    });
  }, []);

  const animatedViewRef_explanationRoomParticipate1 =
    useRef<AnimatedViewMethods>(null);
  const animatedViewRef_explanationRoomParticipate2 =
    useRef<AnimatedViewMethods>(null);
  const animatedViewRef_explanationRoomParticipate3 =
    useRef<AnimatedViewMethods>(null);
  const bodyAnimSettings_explanationRoomParticipate: BodyAnimSettings_explanationRoomParticipate =
    [
      {
        ref: animatedViewRef_explanationRoomParticipate1,
        // isAuto: true,
        // delayStartIntervalMs: 500,
      },
      {
        ref: animatedViewRef_explanationRoomParticipate2,
      },
      { ref: animatedViewRef_explanationRoomParticipate3 },
    ];

  return (
    <IntroParticipateRoomTemplate
      onComplete={onComplete}
      bodyAnimSettings_explanationRoomParticipate={
        bodyAnimSettings_explanationRoomParticipate
      }
    />
  );
};

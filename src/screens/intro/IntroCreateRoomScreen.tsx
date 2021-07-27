import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { IntroCreateRoomTemplate } from "src/components/templates/intro/IntroCreateRoomTemplate";
import { AnimatedViewMethods } from "src/components/templates/intro/organisms/AnimatedView";
import {
  BodyAnimSettings_createdRoom,
  BodyAnimSettings_explanationRoom,
  BodyAnimSettings_inputRoomName,
} from "src/types/Types";
import { CreateRoomProps } from "src/components/templates/intro/IntroCreateRoomTemplate/pages/InputRoomNameTemplate";

export const IntroCreateRoomScreen: React.FC = () => {
  const navigation = useNavigation();

  const onComplete = () => {
    navigation.navigate("IntroTop");
  };

  // ルーム作成
  const [roomName, setRoomName] = useState("");
  const [maxRoomNameLength] = useState(60);
  const [isFocusInputRoomName, setIsFocusInputRoomName] = useState(false);
  const [canCreateRoom, setCanCreateRoom] = useState(false);
  useEffect(() => {
    setCanCreateRoom(roomName.length > 0);
  }, [roomName]);
  const createRoomProps: CreateRoomProps = {
    roomName: roomName,
    setRoomName: setRoomName,
    maxRoomNameLength: maxRoomNameLength,
    isFocusInputRoomName: isFocusInputRoomName,
    setIsFocusInputRoomName: setIsFocusInputRoomName,
  };

  const animatedViewRef_explanationRoom1 = useRef<AnimatedViewMethods>(null);
  const animatedViewRef_explanationRoom2 = useRef<AnimatedViewMethods>(null);
  const animatedViewRef_explanationRoom3 = useRef<AnimatedViewMethods>(null);
  const bodyAnimSettings_explanationRoom: BodyAnimSettings_explanationRoom = [
    {
      ref: animatedViewRef_explanationRoom1,
    },
    { ref: animatedViewRef_explanationRoom2 },
    { ref: animatedViewRef_explanationRoom3 },
  ];

  const animatedViewRef_inputRoomName1 = useRef(null);
  const animatedViewRef_inputRoomName2 = useRef(null);
  const bodyAnimSettings_inputRoomName: BodyAnimSettings_inputRoomName = [
    {
      ref: animatedViewRef_inputRoomName1,
      isAuto: true,
      delayStartIntervalMs: 500,
    },
    {
      ref: animatedViewRef_inputRoomName2,
      isAuto: true,
      delayStartIntervalMs: 200,
    },
  ];

  const animatedViewRef_createdRoom1 = useRef(null);
  const animatedViewRef_createdRoom2 = useRef(null);
  const animatedViewRef_createdRoom3 = useRef(null);
  const bodyAnimSettings_createdRoom: BodyAnimSettings_createdRoom = [
    {
      ref: animatedViewRef_createdRoom1,
      isAuto: true,
      delayStartIntervalMs: 500,
    },
    {
      ref: animatedViewRef_createdRoom2,
    },
    { ref: animatedViewRef_createdRoom3 },
  ];

  return (
    <IntroCreateRoomTemplate
      bodyAnimSettings_explanationRoom={bodyAnimSettings_explanationRoom}
      bodyAnimSettings_inputRoomName={bodyAnimSettings_inputRoomName}
      canCreateRoom={canCreateRoom}
      createRoomProps={createRoomProps}
      bodyAnimSettings_createdRoom={bodyAnimSettings_createdRoom}
      onComplete={onComplete}
    />
  );
};

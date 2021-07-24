import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { IntroCreateRoomTemplate } from "src/components/templates/signup/IntroCreateRoomTemplate";
import {
  useProfileDispatch,
  useProfileState,
} from "src/contexts/ProfileContext";
import { generatePassword } from "src/utils";
import { useRequestPostSignup } from "src/hooks/requests/useRequestSignup";
import { SignupResData } from "src/types/Types";
import { useAuthDispatch, useAuthState } from "src/contexts/AuthContext";
import { useRequestPostRoom } from "src/hooks/requests/useRequestRooms";
import { TOAST_SETTINGS } from "src/constants/alertMessages";
import { showToast } from "src/utils/customModules";

export const IntroCreateRoomScreen: React.FC = () => {
  const navigation = useNavigation();
  const profileState = useProfileState();
  const profileDispatch = useProfileDispatch();
  const authDispatch = useAuthDispatch();
  const authState = useAuthState();

  // ルーム名
  const [roomName, setRoomName] = useState("");
  const [maxRoomNameLength] = useState(60);
  const [isFocusInputRoomName, setIsFocusInputRoomName] = useState(false);
  const [isOpenRoomCardDemoModal, setIsOpenRoomCardDemoModal] = useState(false);

  // 異性表示
  const [isExcludeDifferentGender, setIsExcludeDifferentGender] = useState<
    boolean | null
  >(null);
  const canSetIsExcludeDifferentGender =
    profileState.profileBuffer.genderKey === "male" ||
    profileState.profileBuffer.genderKey === "female";

  const [canCreateRoom, setCanCreateRoom] = useState(false);
  useEffect(() => {
    setCanCreateRoom(roomName.length > 0 && isExcludeDifferentGender !== null);
  }, [roomName, isExcludeDifferentGender]);

  // サインアップ
  const [password] = useState(generatePassword());
  const { isLoadingPostSignup, requestPostSignup } = useRequestPostSignup(
    profileState.profileBuffer.username,
    password,
    profileState.profileBuffer.genderKey,
    profileState.profileBuffer.jobKey
  );

  // ルーム作成用
  const { requestPostRoom, isLoadingPostRoom } = useRequestPostRoom(
    roomName,
    isExcludeDifferentGender,
    null, // プライベート設定はできない
    null, // ルーム画像の設定はできない
    () => {
      authDispatch({
        type: "COMPLETE_SIGNUP",
        initBottomTabRouteName: "MyRooms",
      });
      showToast(TOAST_SETTINGS["CREATE_ROOM"]);
    }
  );

  const onPressBack = () => {
    navigation.goBack();
  };

  const onPressLater = () => {
    requestPostSignup({
      thenCallback: (resData) => {
        const _resData = resData as SignupResData;
        const _me = _resData.me;
        const _token = _resData.token;

        profileDispatch({ type: "SET_ALL", profile: _me });
        authDispatch({ type: "SET_TOKEN", token: _token });
        authDispatch({ type: "SET_PASSWORD", password: password });
        authDispatch({
          type: "COMPLETE_SIGNUP",
          initBottomTabRouteName: "Rooms",
        });
      },
    });
  };

  const [isDelayRequestPostRoom, setIsDelayRequestPostRoom] = useState(false);
  const onPressSubmit = () => {
    requestPostSignup({
      thenCallback: (resData) => {
        const _resData = resData as SignupResData;
        const _me = _resData.me;
        const _token = _resData.token;

        profileDispatch({ type: "SET_ALL", profile: _me });
        authDispatch({ type: "SET_TOKEN", token: _token });
        authDispatch({ type: "SET_PASSWORD", password: password });

        // tokenが反映されるまで遅延
        setIsDelayRequestPostRoom(true);
      },
    });
  };
  useEffect(() => {
    if (isDelayRequestPostRoom && authState.token) {
      requestPostRoom();
      setIsDelayRequestPostRoom(false);
    }
  }, [isDelayRequestPostRoom, authState.token]);
  const isLoadingSubmit = isLoadingPostRoom || isLoadingPostSignup;

  return (
    <IntroCreateRoomTemplate
      roomName={roomName}
      setRoomName={setRoomName}
      maxRoomNameLength={maxRoomNameLength}
      isFocusInputRoomName={isFocusInputRoomName}
      setIsFocusInputRoomName={setIsFocusInputRoomName}
      isOpenRoomCardDemoModal={isOpenRoomCardDemoModal}
      setIsOpenRoomCardDemoModal={setIsOpenRoomCardDemoModal}
      isExcludeDifferentGender={isExcludeDifferentGender}
      setIsExcludeDifferentGender={setIsExcludeDifferentGender}
      canSetIsExcludeDifferentGender={canSetIsExcludeDifferentGender}
      canCreateRoom={canCreateRoom}
      onPressBack={onPressBack}
      onPressLater={onPressLater}
      onPressSubmit={onPressSubmit}
      isLoadingSubmit={isLoadingSubmit}
    />
  );
};

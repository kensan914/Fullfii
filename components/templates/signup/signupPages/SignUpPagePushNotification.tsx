import React, { useState } from "react";
import { Alert, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Block, Checkbox, Icon, Input, Text } from "galio-framework";
import * as WebBrowser from "expo-web-browser";

import SignUpPageTemplate from "./SignUpPageTemplate";
import { useAuthDispatch, useAuthState } from "../../../contexts/AuthContext";
import { useAxios } from "../../../modules/axios";
import { generatePassword, URLJoin } from "../../../modules/support";
import { BASE_URL, USER_POLICY_URL } from "../../../../constants/env";
import {
  useProfileDispatch,
  useProfileState,
} from "../../../contexts/ProfileContext";
import { COLORS } from "../../../../constants/Theme";
import { MenuModal } from "../../../molecules/Menu";
import { logEvent } from "../../../modules/firebase/logEvent";
import {
  FormattedGenderKey,
  SignupResData,
  SignupResDataIoTs,
} from "../../../types/Types";
import GenderInputButtonList from "../../../molecules/GenderInputButtonList";
import { GenderKey } from "../../../types/Types.context";

const { width } = Dimensions.get("window");

const SignUpPagePushNotification: React.FC = () => {
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();
  const profileDispatch = useProfileDispatch();
  const profileState = useProfileState();
  const progressNum = 5;
  const pressButton = () => {
    authDispatch({
      type: "TO_PROGRESS_SIGNUP",
      didProgressNum: progressNum,
      isFinished: false,
    });
    goToPage(progressNum + 1);
  };

  return (
    <SignUpPageTemplate
      title={"はじめまして" + "\n" + "ようこそ、Fullfiiへ"}
      subTitle="これから使い方の説明を始めていきます。"
      isLoading={false}
      pressCallback={pressButton}
      buttonTitle="次へ"
    />
  );
};

export default SignUpPagePushNotification;

const styles = StyleSheet.create({});

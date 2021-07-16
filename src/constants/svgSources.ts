import { Platform } from "react-native";

// TODO: https://github.com/kristerkari/react-native-svg-transformer#using-typescript
import _detailSvg from "src/assets/icons/detail.svg";
export const detailSvg = Platform.select({
  ios: require("src/assets/icons/detail.svg"),
  android: _detailSvg,
});

import _enterRoomSvg from "src/assets/icons/enterRoom.svg";
export const enterRoomSvg = Platform.select({
  ios: require("src/assets/icons/enterRoom.svg"),
  android: _enterRoomSvg,
});

import _homeIconSvg from "src/assets/icons/homeIcon.svg";
export const homeIconSvg = Platform.select({
  ios: require("../assets/icons/homeIcon.svg"),
  android: _homeIconSvg,
});

import _chatIconSvg from "src/assets/icons/chatIcon.svg";
export const chatIconSvg = Platform.select({
  ios: require("src/assets/icons/chatIcon.svg"),
  android: _chatIconSvg,
});

import _mypageIconSvg from "src/assets/icons/mypageIcon.svg";
export const mypageIconSvg = Platform.select({
  ios: require("src/assets/icons/mypageIcon.svg"),
  android: _mypageIconSvg,
});

import _homeIconFocusSvg from "src/assets/icons/homeIconFocus.svg";
export const homeIconFocusSvg = Platform.select({
  ios: require("src/assets/icons/homeIconFocus.svg"),
  android: _homeIconFocusSvg,
});

import _chatIconFocusSvg from "src/assets/icons/chatIconFocus.svg";
export const chatIconFocusSvg = Platform.select({
  ios: require("src/assets/icons/chatIconFocus.svg"),
  android: _chatIconFocusSvg,
});

import _mypageIconFocusSvg from "src/assets/icons/mypageIconFocus.svg";
export const mypageIconFocusSvg = Platform.select({
  ios: require("src/assets/icons/mypageIconFocus.svg"),
  android: _mypageIconFocusSvg,
});

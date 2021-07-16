import { Platform } from "react-native";

// const DEBUG = true;
const DEBUG = false;
// const ADMOB_DEBUG = true;
const ADMOB_DEBUG = false;

const BASE_HOST = DEBUG ? "192.168.11.46:8080" : "fullfii.com";
const URL_SCHEME_HTTP = DEBUG ? "http" : "https";
const WS_SCHEME_HTTP = DEBUG ? "ws" : "wss";

export const BASE_URL = `${URL_SCHEME_HTTP}://${BASE_HOST}/api/v4/`;
export const BASE_URL_WS = `${WS_SCHEME_HTTP}://${BASE_HOST}/ws/v4/`;
export const USER_POLICY_URL = "https://fullfii.com/terms-of-service/";
export const PRIVACY_POLICY_URL = "https://fullfii.com/privacy-policy/";
export const CONTACT_US_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScaGHQYXpvYtPPSIKqVgPdSgM5QY_dzOQeTG6j8Jz16bJWV3A/viewform?usp=sf_link";
export const REPORT_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScuWE_hUXY8GN2Nu4CpMa7rNsUTtVRfcL0_avj5h69XwwjD8g/viewform";
export const ACCOUNT_DELETION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSclvk_l4JsWCMQf6a6qh2AmoAkiM9ReU6eZOaYTUoTz9MP3gw/viewform?usp=sf_link";
export let VERSION = "";
export let VERSION_NUM = 0; // 243

export const setVersion = (isExpo: boolean): void => {
  if (!isExpo)
    import("react-native-device-info").then((DeviceInfoModule) => {
      const DeviceInfo = DeviceInfoModule.default;
      VERSION = DeviceInfo.getVersion();

      const _VERSION_NUM = Number(VERSION.split(".").join(""));
      VERSION_NUM = isNaN(_VERSION_NUM) ? 0 : _VERSION_NUM;
    });
};

export const PRODUCT_ID_LIST = ["com.fullfii.fullfii.normal_plan"];

export const FREE_PLAN = Object.freeze({
  productId: "com.fullfii.fullfii.free_plan",
  title: "未加入",
  description: "",
});

const ADMOB_UNIT_ID_DEBUG_BANNER = "ca-app-pub-3940256099942544/2934735716";
const ADMOB_UNIT_ID_DEBUG_INT = "ca-app-pub-3940256099942544/4411468910";
const ADMOB_UNIT_ID_DEBUG_INT_MOV = "ca-app-pub-3940256099942544/5135589807";
const ADMOB_UNIT_ID_DEBUG_NATIVE_HOME =
  "ca-app-pub-3940256099942544/3986624511";
const ADMOB_UNIT_ID_DEBUG_NATIVE_WAITING =
  "ca-app-pub-3940256099942544/2521693316";
export const ADMOB_UNIT_ID_HOME = ADMOB_DEBUG
  ? ADMOB_UNIT_ID_DEBUG_BANNER
  : "ca-app-pub-1754293395940427/5865171200";
export const ADMOB_UNIT_ID_SELECT_WORRY = ADMOB_DEBUG
  ? ADMOB_UNIT_ID_DEBUG_BANNER
  : "ca-app-pub-1754293395940427/1351211125";
export const ADMOB_UNIT_ID_SETTINGS = ADMOB_DEBUG
  ? ADMOB_UNIT_ID_DEBUG_BANNER
  : "ca-app-pub-1754293395940427/7725047785";
export const ADMOB_UNIT_ID_EDIT_PROFILE = ADMOB_DEBUG
  ? ADMOB_UNIT_ID_DEBUG_BANNER
  : "ca-app-pub-1754293395940427/4708319431";
export const ADMOB_UNIT_ID_AFTER_SHUFFLE = ADMOB_DEBUG
  ? ADMOB_UNIT_ID_DEBUG_INT
  : "ca-app-pub-1754293395940427/3594231086";

export const ADMOB_UNIT_ID_NATIVE = {
  image:
    Platform.OS === "ios"
      ? ADMOB_DEBUG
        ? ADMOB_UNIT_ID_DEBUG_NATIVE_HOME //ios&&debug
        : "ca-app-pub-1754293395940427/8231741791" //ios&&prod
      : "ca-app-pub-3940256099942544/2247696110",
  video:
    Platform.OS === "ios"
      ? ADMOB_DEBUG
        ? ADMOB_UNIT_ID_DEBUG_NATIVE_WAITING //ios&&debug
        : "ca-app-pub-1754293395940427/4100925091" //ios&&prod
      : "ca-app-pub-3940256099942544/1044960115",
};

export const ADMOB_BANNER_WIDTH = 320;
export const ADMOB_BANNER_HEIGHT = 50;

export let isExpo = false;
export const setIsExpo = (val: boolean): void => {
  isExpo = val;
};

import Config from "react-native-config";
export const CAN_APP_TRACKING_TRANSPARENCY =
  Config.CAN_APP_TRACKING_TRANSPARENCY === "false" ? false : true;

export const USER_EMPTY_ICON_URL = `${URL_SCHEME_HTTP}://${BASE_HOST}/static/images/user_empty_icon.png`;

export const appId = "1533306689";
export const ITUNES_LOOKUP_URL = `https://itunes.apple.com/lookup/?id=${appId}&country=JP`;
export const APP_STORE_URI_ITMS_APPS = `itms-apps://itunes.apple.com/jp/app/id${appId}/?mt=8`;
export const APP_STORE_URL = `https://itunes.apple.com/jp/app/id${appId}/?mt=8`;

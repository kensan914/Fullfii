import { Dimensions, Platform } from "react-native";
import {
  getStatusBarHeight,
  getBottomSpace,
} from "react-native-iphone-x-helper";

export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;

// Androidはステータスバー非表示のため
export const STATUS_BAR_HEIGHT =
  Platform.OS === "ios" ? getStatusBarHeight() : 0;
export const BOTTOM_SPACE_HEIGHT = getBottomSpace();

export const HEADER_HEIGHT = 54;
export const HEADER_HEIGHT_INCLUDE_STATUS_BAR =
  HEADER_HEIGHT + STATUS_BAR_HEIGHT;
export const BOTTOM_TAB_BAR_HEIGHT = 49 + BOTTOM_SPACE_HEIGHT;

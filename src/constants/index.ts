import { Dimensions } from "react-native";
import {
  getStatusBarHeight,
  getBottomSpace,
} from "react-native-iphone-x-helper";

export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;

export const STATUS_BAR_HEIGHT = getStatusBarHeight(true);
export const BOTTOM_SPACE_HEIGHT = getBottomSpace();

export const HEADER_HEIGHT = 54;
export const HEADER_HEIGHT_INCLUDE_STATUS_BAR =
  HEADER_HEIGHT + STATUS_BAR_HEIGHT;
export const BOTTOM_TAB_BAR_HEIGHT = 49 + BOTTOM_SPACE_HEIGHT;
export const HOME_TOP_TAB_HEIGHT = 48;
export const MY_ROOMS_TOP_TAB_HEIGHT = HOME_TOP_TAB_HEIGHT;

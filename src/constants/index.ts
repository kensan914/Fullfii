import { Dimensions } from "react-native";
import {
  getStatusBarHeight,
  getBottomSpace,
} from "react-native-iphone-x-helper";

export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;
export const STATUS_BAR_HEIGHT = getStatusBarHeight();
export const BOTTOM_SPACE_HEIGHT = getBottomSpace();

export const HEADER_HEIGHT = 54;
export const HEADER_HEIGHT_INCLUDE_STATUS_BAR =
  HEADER_HEIGHT + STATUS_BAR_HEIGHT;
export const BOTTOM_TAB_BAR_HEIGHT = 49 + BOTTOM_SPACE_HEIGHT;

/**
 *
 * @param {string} tag
 * @param {string} type
 * @param {string} value
 */
export const Logger = (tag = "AD", type, value) => {
  console.log(`[${tag}][${type}]:`, value);
};

export const Events = {
  onViewableItemsChanged: "onViewableItemsChanged",
};

export const routes = [
  {
    index: 0,
    type: "banner",
  },
  {
    index: 1,
    type: "image",
  },
  {
    index: 2,
    type: "video",
  },
  {
    index: 3,
    type: "list",
  },
];

export const NO_NAME_LABEL = "名無し";

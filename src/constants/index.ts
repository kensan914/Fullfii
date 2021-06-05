import { StatusBar, Dimensions } from "react-native";

export const width = Dimensions.get("screen").width;
export const height = Dimensions.get("screen").height;
export const StatusHeight = StatusBar.currentHeight;

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

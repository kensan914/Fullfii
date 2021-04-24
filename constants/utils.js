import { Platform, StatusBar, Dimensions } from "react-native";
import { theme } from "galio-framework";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export const StatusHeight = StatusBar.currentHeight;
export const HeaderHeight = theme.SIZES.BASE * 4 + StatusHeight;
export const iPhoneX = () =>
  Platform.OS === "ios" && (height === 812 || width === 812);

/**
 *
 * @param {string} tag
 * @param {string} type
 * @param {string} value
 */
export const Logger = (tag = "AD", type, value) => {
  console.log(`[${tag}][${type}]:`, value);
}

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

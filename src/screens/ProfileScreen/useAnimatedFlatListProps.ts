import { Animated, Platform, ScrollViewProps } from "react-native";

import { BOTTOM_TAB_BAR_HEIGHT, HEADER_HEIGHT, height } from "src/constants";
import { AnimatedScrollY, PROFILE_VIEW_HEIGHT_TYPE } from "src/types/Types";

export const useAnimatedFlatListProps = (
  animatedScrollY: AnimatedScrollY,
  onUpdateOffsetY: (offsetY: number) => void,
  PROFILE_VIEW_HEIGHT: PROFILE_VIEW_HEIGHT_TYPE,
  PROFILE_BODY_HEIGHT: number
): { animatedFlatListProps: ScrollViewProps } => {
  const animatedFlatListProps: ScrollViewProps = {
    contentContainerStyle: {
      // iOSはcontentContainerStyle内でなく, contentInset・contentOffsetで指定 (インジケータ表示の関係上)
      // https://stackoverflow.com/questions/56969502/progressviewoffset-for-ios-refresh-control-react-native
      paddingTop: Platform.OS === "android" ? PROFILE_BODY_HEIGHT : 0,
      minHeight:
        height - (HEADER_HEIGHT + BOTTOM_TAB_BAR_HEIGHT) + PROFILE_VIEW_HEIGHT,
    },
    contentInset: Platform.OS === "ios" ? { top: PROFILE_BODY_HEIGHT } : void 0,
    contentOffset:
      Platform.OS === "ios" ? { x: 0, y: -PROFILE_BODY_HEIGHT } : void 0,
    onMomentumScrollEnd: (e) => {
      onUpdateOffsetY(e.nativeEvent.contentOffset.y);
    },
    // iOSではスクロール時に滑らせないとonMomentumScrollEndがトリガーされないため対処
    onScrollEndDrag: (e) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      onUpdateOffsetY(offsetY < 0 ? 0 : offsetY);
    },
    onScroll: Animated.event(
      [
        {
          nativeEvent: { contentOffset: { y: animatedScrollY } },
        },
      ],
      {
        useNativeDriver: true,
      }
    ),
  };
  return {
    animatedFlatListProps,
  };
};

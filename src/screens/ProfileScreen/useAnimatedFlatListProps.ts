import { Animated, ScrollViewProps } from "react-native";

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
      paddingTop: PROFILE_BODY_HEIGHT,
      minHeight:
        height - (HEADER_HEIGHT + BOTTOM_TAB_BAR_HEIGHT) + PROFILE_VIEW_HEIGHT,
    },
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

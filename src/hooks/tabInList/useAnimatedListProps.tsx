import React from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  RefreshControl,
  ScrollViewProps,
  StyleSheet,
} from "react-native";

import { width } from "src/constants";
import { COLORS } from "src/constants/colors";
import {
  TabInListSettings,
  FlatListRef,
} from "src/hooks/tabInList/useTabInList";

export type AnimatedFlatListProps = ScrollViewProps;
/**
 * src/hooks/tabInList/useTabInList 参照
 */
export const useAnimatedListProps = (
  tabInListSettings: TabInListSettings,
  refreshProps?: {
    isRefreshing: boolean;
    handleRefresh: () => void;
  }
): { animatedFlatListProps: AnimatedFlatListProps } => {
  const {
    animatedScrollY,
    onUpdateOffsetY,
    animatedListRef,
    hiddenHeight,
    hiddenAndTabBarHeight,
    tabViewHeight,
  } = tabInListSettings;

  const animatedFlatListProps: AnimatedFlatListProps & { ref: FlatListRef } = {
    ref: animatedListRef,
    contentContainerStyle: {
      paddingTop: hiddenAndTabBarHeight,
      minHeight: tabViewHeight + hiddenHeight,
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
    ...(typeof refreshProps !== "undefined"
      ? {
          refreshControl: (
            <RefreshControl
              refreshing={refreshProps.isRefreshing}
              onRefresh={refreshProps.handleRefresh}
              // android only (インジケータの位置は, iOSでは上記ListHeaderComponentにて対応済み)
              progressViewOffset={tabInListSettings.hiddenAndTabBarHeight}
            />
          ),
          ListHeaderComponent:
            // iOSはprogressViewOffsetがきかないため, 擬似インジケータで対処
            Platform.OS === "ios"
              ? () => {
                  return (
                    <ActivityIndicator
                      size="large"
                      color={COLORS.LIGHT_GRAY}
                      style={styles.indicatorOnlyIOS}
                    />
                  );
                }
              : void 0,
        }
      : {}),
  };
  return {
    animatedFlatListProps,
  };
};

const styles = StyleSheet.create({
  indicatorOnlyIOS: {
    position: "absolute",
    top: -60,
    width: width,
    height: 60,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

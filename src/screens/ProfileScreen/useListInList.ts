import { useRef, useState } from "react";
import { Animated, FlatList } from "react-native";
import {
  AnimatedScrollY,
  FlatListRef,
  FlatListRefCollection,
  GeneSceneProps,
  OnIndexChange,
  PROFILE_VIEW_HEIGHT_TYPE,
  RouteKey,
  Routes,
  ScrollYCollection,
} from "src/types/Types";

type UseListInList = (
  routes: Routes,
  PROFILE_VIEW_HEIGHT: PROFILE_VIEW_HEIGHT_TYPE,
  PROFILE_BODY_HEIGHT: number
) => {
  tabIndex: number;
  animatedScrollY: AnimatedScrollY;
  onIndexChange: OnIndexChange;
  geneSceneProps: GeneSceneProps;
};
export const useListInList: UseListInList = (
  routes,
  PROFILE_VIEW_HEIGHT,
  PROFILE_BODY_HEIGHT
) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [animatedScrollY] = useState(new Animated.Value(0));

  /** ex) { tab1: 0, tab2: 0 } */
  const scrollYCollection = useRef<ScrollYCollection>(
    routes
      .map((route) => route.key)
      .reduce((obj, routeKey) => {
        obj[routeKey] = 0;
        return obj;
      }, {} as ScrollYCollection)
  );
  // scrollYCollectionは下記synchronizeScrollY内の最後に一括更新するため, 途中の変更を格納するtempを用意(変更なし: null).
  const scrollYCollectionTemp = useRef<ScrollYCollection | null>(null);
  // for 差分検知
  const prevScrollYCollection = useRef<ScrollYCollection>({
    ...scrollYCollection.current,
  });
  // スクロール実行と共にscrollYCollectionの変更も行う
  const scrollToOffset = (
    routeKey: RouteKey,
    flatListRef: FlatListRef,
    offset: number
  ) => {
    flatListRef.current?.scrollToOffset({
      offset: offset,
      animated: false,
    });
    if (scrollYCollectionTemp.current === null) {
      scrollYCollectionTemp.current = {};
    }
    scrollYCollectionTemp.current[routeKey] = offset;
  };

  /** ex) { tab1: useRef<FlatList>(null), tab2: useRef<FlatList>(null) } */
  const flatListRefCollection = routes
    .map((route) => route.key)
    .reduce((obj, routeKey) => {
      obj[routeKey] = useRef<FlatList>(null);
      return obj;
    }, {} as FlatListRefCollection);

  // 複数FlatListのscroll同期
  const synchronizeScrollY = () => {
    Object.keys(scrollYCollection.current).forEach((routeKeyStr) => {
      const routeKey = routeKeyStr as RouteKey;

      // スクロールされていない
      const targetScrollY = scrollYCollection.current[routeKey];
      if (prevScrollYCollection.current[routeKey] === targetScrollY) {
        return;
      }

      // スクロールされた
      const otherRouteKeys = Object.keys(scrollYCollection.current).filter(
        (filteredRk) => filteredRk !== routeKey
      );
      // tab barが完全に上につかない状態
      if (
        typeof targetScrollY !== "undefined" &&
        targetScrollY < PROFILE_VIEW_HEIGHT
      ) {
        otherRouteKeys.forEach((otherRouteKeyStr) => {
          const otherRouteKey = otherRouteKeyStr as RouteKey;
          const otherFlatListRef = flatListRefCollection[otherRouteKey];
          if (typeof otherFlatListRef !== "undefined") {
            scrollToOffset(otherRouteKey, otherFlatListRef, targetScrollY);
          }
        });
      }
      // tab barが完全に上についた状態
      else {
        otherRouteKeys.forEach((otherRouteKeyStr) => {
          const otherRouteKey = otherRouteKeyStr as RouteKey;
          const otherScrollY = scrollYCollection.current[otherRouteKey];
          const otherFlatListRef = flatListRefCollection[otherRouteKey];
          if (
            typeof otherScrollY !== "undefined" &&
            otherScrollY < PROFILE_VIEW_HEIGHT &&
            typeof otherFlatListRef !== "undefined"
          ) {
            scrollToOffset(
              otherRouteKey,
              otherFlatListRef,
              PROFILE_VIEW_HEIGHT
            );
          }
        });
      }
    });

    // scrollYCollectionの更新
    if (scrollYCollectionTemp.current !== null) {
      scrollYCollection.current = {
        ...scrollYCollection.current,
        ...scrollYCollectionTemp.current,
      };

      // prevScrollYCollectionの更新
      prevScrollYCollection.current = { ...scrollYCollection.current };
    }
    scrollYCollectionTemp.current = null;
  };

  const onIndexChange: OnIndexChange = (_index) => {
    setTabIndex(_index);
  };

  const geneSceneProps: GeneSceneProps = (_routeKey) => {
    const flatListRef = flatListRefCollection[_routeKey];
    return {
      animatedScrollY: animatedScrollY,
      onUpdateOffsetY: (offsetY: number) => {
        scrollYCollection.current[_routeKey] = offsetY;
        synchronizeScrollY();
      },
      ref: typeof flatListRef !== "undefined" ? flatListRef : useRef(null),
      PROFILE_VIEW_HEIGHT: PROFILE_VIEW_HEIGHT,
      PROFILE_BODY_HEIGHT: PROFILE_BODY_HEIGHT,
    };
  };

  return {
    tabIndex,
    animatedScrollY,
    onIndexChange,
    geneSceneProps,
  };
};

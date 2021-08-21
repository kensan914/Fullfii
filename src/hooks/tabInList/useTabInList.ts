import { useRef, useState } from "react";
import { Animated, FlatList, ViewStyle } from "react-native";

import { COLORS } from "src/constants/colors";

export type Route<RouteKey> = { key: RouteKey; title: string };
export type Routes<RouteKey> = Route<RouteKey>[];
export type ScrollYCollection<RouteKey extends string> = {
  [key in RouteKey]?: number;
};
export type FlatListRef = React.RefObject<FlatList>;
export type FlatListRefCollection<RouteKey extends string> = {
  [key in RouteKey]?: FlatListRef;
};
export type OnIndexChange = (index: number) => void;
export type TabInListSettings = {
  animatedScrollY: Animated.Value;
  onUpdateOffsetY: (offsetY: number) => void;
  animatedListRef: FlatListRef;
  hiddenHeight: number;
  hiddenAndTabBarHeight: number;
  tabViewHeight: number;
};
export type GeneTabInListSettings<RouteKey> = (
  routeKey: RouteKey
) => TabInListSettings;
export type TabInListSettingsProps = {
  tabInListSettings: TabInListSettings;
};
export type HiddenAnimatedViewStyle = Animated.WithAnimatedArray<ViewStyle>;
/**
 * scroll可能コンテンツ(FlatList等)内にtopTabBarがある状況によるアニメーションが引き起こす諸問題の解決.
 *  - InstagramのプロフィールのようなUIでは, 下にスクロールした時にプロフィール部分は隠れtopTabBarのみ画面上部に残る.
 *  - これを実現する際のstateやpropsを管理・生成し提供する.
 *  - また, topTabBar内の複数のタブ内のFlatListを同期し表示崩れを防ぐ (あるタブ内のFlatListが上部に達した時, 他全てをto topするなど).
 * topTabBarは, react-navigationでなくreact-native-tab-viewを用いる.
 *
 * 当hooks(useTabInList.ts)に合わせてuseAnimatedListProps.tsを必ずセットで用いる.
 * 各hooksの責務は以下の通りである.
 * 【useTabInList.ts】
 *    1箇所だけで呼び出し, animatedScrollYなどの各stateの管理や各Scene内のスクロールの同期を行う.
 *    下記useAnimatedListProps.tsで使用するtabInListSettingsというオブジェクトを返す.
 *    また, 隠れる部分(hiddenHeightの該当箇所)で使用するAnimated.Viewのstyle(hiddenAnimatedViewStyle)も生成し返す.
 * 【useAnimatedListProps.ts】
 *    各Sceneごとに1箇所配置. 受け取ったtabInListSettingsをもとにSceneごとのFlatListのPropsを生成 (onScrollなどtabInList実現に関連するもののみ).
 * @param routes
 * @param hiddenHeight スクロールした時完全に隠れる部分のheight
 * @param tabBarHeight TabBarのheight
 * @param tabViewHeight TabViewのheight
 * @param priorityAnimatedScrollY 独自のanimatedScrollYを使用する際に指定
 */
export const useTabInList = <RouteKey extends string>(
  routes: Routes<RouteKey>,
  hiddenHeight: number,
  tabBarHeight: number,
  tabViewHeight: number,
  priorityAnimatedScrollY?: Animated.Value,
  initIndex?: number
): {
  animatedScrollY: Animated.Value; // 任意のスクロールアニメーション使用 (ex. プロフィール画像の縮小)
  tabIndex: number; // TabViewのpropsに指定
  onIndexChange: OnIndexChange; // TabViewのpropsに指定
  geneTabInListSettings: GeneTabInListSettings<RouteKey>;
  hiddenAnimatedViewStyle: Animated.WithAnimatedArray<ViewStyle>;
} => {
  const [hiddenAndTabBarHeight] = useState(hiddenHeight + tabBarHeight);

  const [tabIndex, setTabIndex] = useState(
    typeof initIndex !== "undefined" ? initIndex : 0
  );
  const [animatedScrollY] = useState(
    priorityAnimatedScrollY || new Animated.Value(0)
  );

  /** ex) { tab1: 0, tab2: 0 } */
  const scrollYCollection = useRef<ScrollYCollection<RouteKey>>(
    routes
      .map((route) => route.key)
      .reduce((obj, routeKey) => {
        obj[routeKey] = 0;
        return obj;
      }, {} as ScrollYCollection<RouteKey>)
  );
  // scrollYCollectionは下記synchronizeScrollY内の最後に一括更新するため, 途中の変更を格納するtempを用意(変更なし: null).
  const scrollYCollectionTemp = useRef<ScrollYCollection<RouteKey> | null>(
    null
  );
  // for 差分検知
  const prevScrollYCollection = useRef<ScrollYCollection<RouteKey>>({
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
    }, {} as FlatListRefCollection<RouteKey>);

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
        targetScrollY < hiddenHeight
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
            otherScrollY < hiddenHeight &&
            typeof otherFlatListRef !== "undefined"
          ) {
            scrollToOffset(otherRouteKey, otherFlatListRef, hiddenHeight);
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

  const geneTabInListSettings: GeneTabInListSettings<RouteKey> = (
    _routeKey
  ) => {
    const flatListRef = flatListRefCollection[_routeKey];
    return {
      animatedScrollY: animatedScrollY,
      onUpdateOffsetY: (offsetY: number) => {
        scrollYCollection.current[_routeKey] = offsetY;
        synchronizeScrollY();
      },
      animatedListRef:
        typeof flatListRef !== "undefined" ? flatListRef : useRef(null),
      hiddenHeight: hiddenHeight,
      hiddenAndTabBarHeight: hiddenAndTabBarHeight,
      tabViewHeight: tabViewHeight,
    };
  };

  const hiddenAnimatedViewStyle: Animated.WithAnimatedArray<ViewStyle> = [
    {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      backgroundColor: COLORS.BEIGE,
    },
    {
      height: hiddenAndTabBarHeight,
      transform: [
        {
          translateY: animatedScrollY.interpolate({
            inputRange: [0, hiddenHeight],
            outputRange: [0, -1 * hiddenHeight],
            extrapolate: "clamp",
          }),
        },
      ],
    },
  ];

  return {
    tabIndex,
    animatedScrollY,
    onIndexChange,
    geneTabInListSettings,
    hiddenAnimatedViewStyle,
  };
};

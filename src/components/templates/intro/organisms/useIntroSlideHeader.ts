import { useEffect, useRef, useState } from "react";

import { AnimatedTextMethods } from "src/components/templates/intro/organisms/AnimatedText";

export const useIntroSlideHeader = (
  currentPage: number,
  pageLength: number
): {
  headerTitleRef: React.Ref<AnimatedTextMethods>;
  onPressBodyForHeader: () => void;
  currentIsReadyBody: boolean;
  isReadyBodyCollection: boolean[];
} => {
  // ⇓ ヘッダの描画が完了し, ボディの描画の準備が出来た状態を管理. [true, false, false]
  const [isReadyBodyCollection, _setIsReadyBodyCollection] = useState(
    new Array(pageLength).fill(false)
  );
  // false => trueの一方通行
  const setIsReadyBodyCollection = (page: number): void => {
    const newIsReadyBodyCollection = [...isReadyBodyCollection];
    newIsReadyBodyCollection[page - 1] = true;
    _setIsReadyBodyCollection(newIsReadyBodyCollection);
  };
  const currentIsReadyBody = isReadyBodyCollection[currentPage - 1];

  const headerTitleRef = useRef<AnimatedTextMethods>(null);
  useEffect(() => {
    if (!currentIsReadyBody) {
      // 未だヘッダ描画完了していない場合, タイトルアニメーション開始
      headerTitleRef.current &&
        headerTitleRef.current.startAnimation(currentPage.toString(), () => {
          // console.log("コンプリート", currentPage.toString());
          setIsReadyBodyCollection(currentPage);
        });
    } else {
      // アニメーションを無効化し, そのままタイトルを表示 (戻る操作の対処)
      headerTitleRef.current && headerTitleRef.current.disableAnimation();
    }
  }, [currentPage]);

  const onPressBodyForHeader = () => {
    // ヘッダーの描画完了後は, 以下は実行しないように
    if (currentIsReadyBody) return;
    headerTitleRef.current &&
      headerTitleRef.current.skipAnimation(currentPage.toString());
  };

  return {
    headerTitleRef,
    onPressBodyForHeader,
    isReadyBodyCollection,
    currentIsReadyBody,
  };
};

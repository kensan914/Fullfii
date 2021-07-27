import { useEffect, useRef, useState } from "react";

import { IntroPageSetting } from "src/types/Types";

export const useIntroSlideBody = (
  currentPage: number,
  pageLength: number,
  currentPageSetting: IntroPageSetting,
  currentIsReadyBody: boolean,
  isReadyBodyCollection: boolean[]
): {
  onPressBodyForBody: () => void;
  isReadyFooterCollection: boolean[];
} => {
  // ページごとのボディアニメーション進捗. 完了時-1を格納. ex) [-1, 2, 0]
  const animProgressCollection = useRef<number[]>(
    new Array(pageLength).fill(0)
  );
  const proceedAnimProgress = (page: number): number => {
    if (
      animProgressCollection.current[page - 1] >=
      currentPageSetting.bodyAnimSettings.length - 1
    ) {
      // アニメーション完了
      animProgressCollection.current[page - 1] = -1;
      return -1;
    }
    animProgressCollection.current[page - 1] += 1;
    return animProgressCollection.current[page - 1];
  };

  // ⇓ ボディの描画が完了し, フッターの描画の準備が出来た状態を管理. [true, false, false]
  const [isReadyFooterCollection, _setIsReadyFooterCollection] = useState(
    new Array(pageLength).fill(false)
  );
  // false => trueの一方通行
  const setIsReadyFooterCollection = (page: number): void => {
    const newIsReadyFooterCollection = [...isReadyFooterCollection];
    newIsReadyFooterCollection[page - 1] = true;
    _setIsReadyFooterCollection(newIsReadyFooterCollection);
  };
  const currentIsReadyFooter = isReadyFooterCollection[currentPage - 1];

  const isAnimating = useRef(false);
  const startAnimation = (forAuto = false) => {
    // 前回のアニメーションが終了していない
    if (isAnimating.current) return;

    const currentAnimProgress = animProgressCollection.current[currentPage - 1];
    // auto用でない時にautoアニメーションを再生しようとした場合, 中断
    if (
      !forAuto &&
      currentPageSetting.bodyAnimSettings[currentAnimProgress].isAuto
    ) {
      return;
    }

    const animatedView =
      currentPageSetting.bodyAnimSettings[currentAnimProgress].ref.current;

    if (animatedView === null) {
      console.error("animatedView is null");
      return;
    }

    const resultProgress = proceedAnimProgress(currentPage);

    isAnimating.current = true;
    animatedView.startInAnimation(() => {
      isAnimating.current = false;
      if (resultProgress === -1) {
        setIsReadyFooterCollection(currentPage);
      } else {
        // 次回アニメーションがautoだった場合
        const nextAnimProgress = resultProgress;
        if (currentPageSetting.bodyAnimSettings[nextAnimProgress].isAuto) {
          startAnimation(true);
        }
      }
    });
  };

  // 初回autoアニメーション再生
  useEffect(() => {
    if (currentIsReadyBody) {
      // 現在のページのisReadyBodyがtrueになった時
      const currentAnimProgress =
        animProgressCollection.current[currentPage - 1];
      if (
        currentAnimProgress === 0 &&
        currentPageSetting.bodyAnimSettings[0].isAuto
      ) {
        startAnimation(true);
      }
    }
  }, [isReadyBodyCollection]);

  const onPressBodyForBody = () => {
    // ヘッダーの描画完了前は, 以下は実行しないように
    if (!currentIsReadyBody) return;

    // アニメーション完了済み
    const currentAnimProgress = animProgressCollection.current[currentPage - 1];
    if (currentAnimProgress === -1) return;

    startAnimation();
  };

  return { onPressBodyForBody, isReadyFooterCollection };
};

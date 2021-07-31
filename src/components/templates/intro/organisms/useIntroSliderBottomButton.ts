import { RefObject, useEffect, useRef, useState } from "react";

import { AnimatedViewMethods } from "src/components/templates/intro/organisms/AnimatedView";
import { GoToPage, IntroPageSetting } from "src/types/Types";

export const useIntroSliderBottomButton = (
  page: number,
  currentPage: number,
  pageLength: number,
  pageSetting: IntroPageSetting,
  isReadyFooter: boolean,
  onComplete: () => void,
  goToPage: GoToPage
): {
  bottomButtonRef: RefObject<AnimatedViewMethods>;
  onPressBottom: () => void;
  geneBottomButtonLabel: () => string;
  isShowBottomButton: boolean;
} => {
  // タップ可能状態
  const [isTouchableBottomButton, _setIsTouchableBottomButton] =
    useState(false);
  const isTouchableBottomButtonRef = useRef(false); // 即時反映
  const setIsTouchableBottomButton = (_isTouchableBottomButton: boolean) => {
    isTouchableBottomButtonRef.current = _isTouchableBottomButton;
    _setIsTouchableBottomButton(_isTouchableBottomButton);
  };

  // 描画状態
  const [isShowBottomButton, _setIsShowBottomButton] = useState(false);
  const isShowBottomButtonRef = useRef(false); // 即時反映
  const setIsShowBottomButton = (_isShowBottomButton: boolean) => {
    isShowBottomButtonRef.current = _isShowBottomButton;
    _setIsShowBottomButton(_isShowBottomButton);
  };

  const bottomButtonRef = useRef<AnimatedViewMethods>(null);
  useEffect(() => {
    if (isReadyFooter) {
      // ボディ描画完了時, ボトムボタンのFADE_IN_UPアニメーション開始
      setIsShowBottomButton(true);
      bottomButtonRef.current &&
        bottomButtonRef.current.startInAnimation(
          () => {
            setIsTouchableBottomButton(true);
          },
          {
            settingByType: { type: "FADE_IN_UP", initTransLateBottom: 200 },
            duration: 200,
            delayStartIntervalMs: 500,
          }
        );
    }
  }, [isReadyFooter]);

  // 戻る操作によるボトムボタンの復元
  const preventPage = useRef(1);
  useEffect(() => {
    if (currentPage === page && currentPage < preventPage.current) {
      setIsTouchableBottomButton(true);
    }
    preventPage.current = currentPage;
  }, [currentPage]);

  const onPressBottom = () => {
    if (!isTouchableBottomButtonRef.current) return;

    // ⇓ ボトムボタン処理 (ページにつき1度までの処理)
    setIsTouchableBottomButton(false);
    const onPressBottom = pageSetting.onPressBottom;
    onPressBottom && onPressBottom();

    const completePage = () => {
      if (pageLength <= page) {
        onComplete();
      } else {
        goToPage();
      }
    };

    // 遅延
    const onPressAsync = pageSetting.onPressBottomAsync;
    if (typeof onPressAsync === "undefined") {
      completePage();
    } else {
      onPressAsync().finally(() => {
        completePage();
      });
    }
  };

  const geneBottomButtonLabel = (): string => {
    const bottomButtonLabel = pageSetting.bottomButtonLabel;
    return typeof bottomButtonLabel !== "undefined"
      ? bottomButtonLabel
      : "次へ";
  };

  return {
    bottomButtonRef,
    onPressBottom,
    geneBottomButtonLabel,
    isShowBottomButton,
  };
};

import { RefObject, useEffect, useRef, useState } from "react";

import { AnimatedViewMethods } from "src/components/templates/intro/organisms/AnimatedView";
import { GoToPage, IntroPageSetting } from "src/types/Types";

export const useIntroSliderBottomButton = (
  page: number,
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

  // 戻る操作によるボトムボタンの再描画
  // const preventPage = useRef(1);
  // useEffect(() => {
  //   if (currentPage < preventPage.current) {
  //     setIsShowBottomButton(true);
  //     bottomButtonRef.current &&
  //       bottomButtonRef.current.startInAnimation(
  //         () => {
  //           setIsTouchableBottomButton(true);
  //         },
  //         {
  //           settingByType: { type: "FADE_IN" },
  //           //
  //           duration: isShowBottomButtonRef.current ? 0 : 100,
  //         }
  //       );
  //   }
  //   preventPage.current = currentPage;
  // }, [currentPage]);

  const onPressBottom = () => {
    if (!isTouchableBottomButtonRef.current) return;

    // setIsTouchableBottomButton(false);
    // bottomButtonRef.current &&
    //   bottomButtonRef.current.startOutAnimation(
    //     () => {
    //       setIsShowBottomButton(false);
    //     },
    //     {
    //       settingByType: { type: "FADE_OUT" },
    //       duration: 150,
    //     }
    //   );

    // ⇓ ボトムボタン処理
    const additionalOnPressBottom = pageSetting.onPressBottom;
    additionalOnPressBottom && additionalOnPressBottom();
    if (pageLength <= page) {
      onComplete();
    } else {
      goToPage();
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

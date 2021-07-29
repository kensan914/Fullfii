import React from "react";
import { StyleSheet } from "react-native";

import { useIntroSliderBottomButton } from "src/components/templates/intro/organisms/useIntroSliderBottomButton";
import { AnimatedView } from "src/components/templates/intro/organisms/AnimatedView";
import { RoundButton } from "src/components/atoms/RoundButton";
import { GoToPage, IntroPageSetting } from "src/types/Types";

type Props = {
  page: number;
  currentPage: number;
  pageLength: number;
  pageSetting: IntroPageSetting;
  isReadyFooter: boolean;
  onComplete: () => void;
  goToPage: GoToPage;
};
export const IntroBottomButton: React.FC<Props> = (props) => {
  const {
    page,
    currentPage,
    pageLength,
    pageSetting,
    isReadyFooter,
    onComplete,
    goToPage,
  } = props;

  const {
    bottomButtonRef,
    onPressBottom,
    geneBottomButtonLabel,
    isShowBottomButton,
  } = useIntroSliderBottomButton(
    page,
    currentPage,
    pageLength,
    pageSetting,
    isReadyFooter,
    onComplete,
    goToPage
  );

  return (
    <AnimatedView ref={bottomButtonRef}>
      {isShowBottomButton && (
        <RoundButton
          style={styles.bottomButton}
          label={geneBottomButtonLabel()}
          onPress={onPressBottom}
          isLoading={pageSetting.isLoading}
          disabled={
            typeof pageSetting.canPressBottomButton !== "undefined"
              ? !pageSetting.canPressBottomButton
              : false
          }
        />
      )}
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  bottomButton: {},
});

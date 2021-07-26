import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Block, Text } from "galio-framework";

import { useIntroSlide } from "src/components/templates/intro/organisms/useIntroSlide";
import { RoundButton } from "src/components/atoms/RoundButton";
import { height, width } from "src/constants";
import { COLORS } from "src/constants/colors";
import { ProgressBar } from "src/components/templates/intro/organisms/ProgressBar";
import { IntroPageSettings } from "src/types/Types";
import { IntroHeaderLeft } from "src/components/templates/intro/organisms/IntroHeaderLeft";

type Props = {
  pageSettings: IntroPageSettings;
  onComplete: () => void;
};
export const IntroSlide: React.FC<Props> = (props) => {
  const { pageSettings, onComplete } = props;

  const pageLength = pageSettings.length;
  const { initPage, currentPage, scrollViewRef, goToPage } =
    useIntroSlide(pageLength);
  const currentPageSetting = pageSettings[currentPage - 1];

  const onPressBottom = () => {
    const additionalOnPressBottom = currentPageSetting.onPressBottom;
    additionalOnPressBottom && additionalOnPressBottom();
    if (pageLength <= currentPage) {
      onComplete();
    } else {
      goToPage();
    }
  };

  const geneBottomButtonLabel = (): string => {
    const bottomButtonLabel = currentPageSetting.bottomButtonLabel;
    return typeof bottomButtonLabel !== "undefined"
      ? bottomButtonLabel
      : "次へ";
  };

  const PageWrapper: React.FC = ({ children }) => {
    return (
      <ScrollView
        style={styles.pageWrapper}
        showsHorizontalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  };

  return (
    <Block style={styles.container}>
      <Block style={styles.header}>
        <Block row style={styles.progressBarContainer}>
          <IntroHeaderLeft
            currentPage={currentPage}
            goToPage={goToPage}
            currentPageSetting={currentPageSetting}
            height={PROGRESS_BAR_CONTAINER}
          />
          <ProgressBar
            step={currentPage}
            steps={pageLength}
            // isShowPopAnimation
            height={18}
            style={{
              flex: 1,
            }}
          />
        </Block>
        <Text size={width * 0.04} bold color={COLORS.BLACK}>
          {currentPageSetting.title}
        </Text>
      </Block>
      <ScrollView
        ref={scrollViewRef}
        style={styles.signupScrollView}
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        <Block flex row>
          {pageSettings.map((pageSetting, index) => {
            return <PageWrapper key={index}>{pageSetting.body}</PageWrapper>;
          })}
        </Block>
      </ScrollView>
      <Block style={styles.footer}>
        <RoundButton
          style={styles.bottomButton}
          label={geneBottomButtonLabel()}
          onPress={onPressBottom}
        />
      </Block>
    </Block>
  );
};

const HEADER_HEIGHT = 104;
const FOOTER_HEIGHT = 120;
const BODY_HEIGHT = height - (HEADER_HEIGHT + FOOTER_HEIGHT);
const PROGRESS_BAR_CONTAINER = 56;
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  signupScrollView: {
    width: width,
    backgroundColor: COLORS.BEIGE,
  },
  pageWrapper: { flex: 1, width: width, height: BODY_HEIGHT },
  header: {
    height: HEADER_HEIGHT,
    width: width,
    backgroundColor: COLORS.BEIGE,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  progressBarContainer: {
    alignItems: "center",
    height: PROGRESS_BAR_CONTAINER,
  },
  footer: {
    height: FOOTER_HEIGHT,
    backgroundColor: COLORS.BEIGE,
    alignItems: "center",
  },
  bottomButton: {
    marginTop: 0,
  },
});

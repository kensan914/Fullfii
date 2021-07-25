import React, { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Block, Text } from "galio-framework";

import { useIntroSlide } from "src/components/templates/intro/organisms/useIntroSlide";
import { RoundButton } from "src/components/atoms/RoundButton";
import { height, width } from "src/constants";
import { COLORS } from "src/constants/colors";
import { ProgressBar } from "src/components/templates/intro/organisms/ProgressBar";
import { BackButton } from "src/components/atoms/BackButton";
import { IntroPageSettings } from "src/types/Types";

type Props = {
  pageSettings: IntroPageSettings;
};
export const IntroSlide: React.FC<Props> = (props) => {
  const { pageSettings } = props;

  const { initPage, currentPage, scrollViewRef, goToPage } = useIntroSlide();
  const pageLength = pageSettings.length;
  const currentPageSetting = pageSettings[currentPage];

  const onPressBottom = () => {
    const additionalOnPressBottom = pageSettings[currentPage].onPressBottom;
    additionalOnPressBottom && additionalOnPressBottom();
    goToPage();
  };

  const geneBottomButtonLabel = (): string => {
    const bottomButtonLabel = pageSettings[currentPage].bottomButtonLabel;
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
          <BackButton
            onPress={() => void 0}
            color={COLORS.LIGHT_BROWN}
            style={styles.backButton}
          />
          <ProgressBar
            step={currentPage}
            steps={pageLength}
            isShowPopAnimation
            height={12}
            style={{
              flex: 1,
            }}
          />
        </Block>
        <Text size={width * 0.04} bold color={COLORS.BLACK}>
          {pageSettings[currentPage].title}
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
        <RoundButton label={geneBottomButtonLabel()} onPress={onPressBottom} />
      </Block>
    </Block>
  );
};

const HEADER_HEIGHT = 96;
const FOOTER_HEIGHT = 96;
const BODY_HEIGHT = height - (HEADER_HEIGHT + FOOTER_HEIGHT);
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  signupScrollView: {
    width: width,
  },
  pageWrapper: { flex: 1, width: width, height: BODY_HEIGHT },
  header: {
    height: 96,
    width: width,
    backgroundColor: COLORS.BEIGE,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
  },
  progressBarContainer: {
    alignItems: "center",
  },
  backButton: {
    paddingRight: 16,
  },
  footer: { height: 96, backgroundColor: COLORS.BEIGE, alignItems: "center" },
});

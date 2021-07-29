import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Block } from "galio-framework";

import { useIntroSlide } from "src/components/templates/intro/organisms/useIntroSlide";
import {
  BOTTOM_SPACE_HEIGHT,
  height,
  STATUS_BAR_HEIGHT,
  width,
} from "src/constants";
import { COLORS } from "src/constants/colors";
import { ProgressBar } from "src/components/templates/intro/organisms/ProgressBar";
import { IntroPageSettings } from "src/types/Types";
import { IntroHeaderLeft } from "src/components/templates/intro/organisms/IntroHeaderLeft";
import { AnimatedText } from "src/components/templates/intro/organisms/AnimatedText";
import { useIntroSlideHeader } from "src/components/templates/intro/organisms/useIntroSlideHeader";
import { useIntroSlideBody } from "src/components/templates/intro/organisms/useIntroSlideBody";
import { IntroBottomButton } from "src/components/templates/intro/molecules/IntroBottomButton";

type Props = {
  pageSettings: IntroPageSettings;
  onComplete: () => void;
};
export const IntroSlide: React.FC<Props> = (props) => {
  const { pageSettings, onComplete } = props;

  const pageLength = pageSettings.length;
  const {
    initPage,
    currentPage,
    bodyScrollViewRef,
    footerScrollViewRef,
    goToPage,
  } = useIntroSlide(pageLength);
  const currentPageSetting = pageSettings[currentPage - 1];

  const {
    headerTitleRef,
    onPressBodyForHeader,
    isReadyBodyCollection,
    currentIsReadyBody,
  } = useIntroSlideHeader(currentPage, pageLength);

  const { onPressBodyForBody, isReadyFooterCollection } = useIntroSlideBody(
    currentPage,
    pageLength,
    currentPageSetting,
    currentIsReadyBody,
    isReadyBodyCollection
  );

  return (
    <Block style={styles.container}>
      {/* ヘッダー */}
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
            height={18}
            style={{
              flex: 1,
            }}
          />
        </Block>
        <AnimatedText
          ref={headerTitleRef}
          size={width * 0.045}
          bold
          color={COLORS.BLACK}
          durationMs={60}
          delayStartIntervalMs={600}
        >
          {currentPageSetting.title}
        </AnimatedText>
      </Block>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          onPressBodyForHeader();
          onPressBodyForBody();
        }}
      >
        {/* ボディ */}
        <ScrollView
          ref={bodyScrollViewRef}
          style={styles.bodyScrollView}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
        >
          <Block row>
            {pageSettings.map((pageSetting, index) => {
              return (
                <ScrollView
                  key={index}
                  style={styles.pageWrapper}
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled
                >
                  <TouchableWithoutFeedback>
                    {pageSetting.body}
                  </TouchableWithoutFeedback>
                </ScrollView>
              );
            })}
          </Block>
        </ScrollView>

        {/* フッター */}
        <ScrollView
          ref={footerScrollViewRef}
          style={styles.bodyScrollView}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
        >
          <Block flex row>
            {pageSettings.map((pageSetting, index) => {
              const _page = index + 1;
              return (
                <Block key={index} style={styles.footer}>
                  <IntroBottomButton
                    page={_page}
                    currentPage={currentPage}
                    pageLength={pageLength}
                    pageSetting={pageSetting}
                    isReadyFooter={isReadyFooterCollection[_page - 1]}
                    onComplete={onComplete}
                    goToPage={goToPage}
                  />
                </Block>
              );
            })}
          </Block>
        </ScrollView>
      </TouchableOpacity>
    </Block>
  );
};

const HEADER_HEIGHT = 104;
const FOOTER_HEIGHT = 120;
export const INTRO_BODY_HEIGHT =
  height - (HEADER_HEIGHT + STATUS_BAR_HEIGHT + FOOTER_HEIGHT);
const PROGRESS_BAR_CONTAINER = 56;
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  bodyScrollView: {
    width: width,
    backgroundColor: COLORS.BEIGE,
  },
  pageWrapper: {
    width: width,
    height: INTRO_BODY_HEIGHT,
  },
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
    width: width,
    backgroundColor: COLORS.BEIGE,
    alignItems: "center",
  },
});

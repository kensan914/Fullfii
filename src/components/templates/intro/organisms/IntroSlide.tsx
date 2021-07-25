import React, { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Block, Text } from "galio-framework";

import { useIntroSlide } from "src/components/templates/intro/organisms/useIntroSlide";
import { RoundButton } from "src/components/atoms/RoundButton";
import { height, width } from "src/constants";
import { COLORS } from "src/constants/colors";

type Props = {
  pageStack: ReactNode[];
};
export const IntroSlide: React.FC<Props> = (props) => {
  const { pageStack } = props;

  const { initPage, currentPage, scrollViewRef, goToPage } = useIntroSlide();

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
    <>
      <Block style={styles.header}>
        <Block row center style={styles.headerTopContainer}>
          <Block style={styles.headerIcon}/>
          <Block style={styles.headerProgressbar}/>
        </Block>
        <Block style={styles.title}>
          <Text bold size={16} color={COLORS.BLACK}>あなたの悩みを話すためのルームを作ろう</Text>
        </Block>
      </Block>
      <ScrollView
        ref={scrollViewRef}
        style={styles.signupScrollView}
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        <Block flex row>
          {pageStack.map((page, index) => {
            return <PageWrapper key={index}>{page}</PageWrapper>;
          })}
        </Block>
      </ScrollView>
      <Block style={styles.footer}>
        <RoundButton
          style={styles.roundButton}
          label="次へ"
          onPress={() => {
            goToPage();
          }}
        />
      </Block>
    </>
  );
};

const HEADER_HEIGHT = 104;
const FOOTER_HEIGHT = 120;
const BODY_HEIGHT = height - (HEADER_HEIGHT + FOOTER_HEIGHT);
const styles = StyleSheet.create({
  signupScrollView: {
    backgroundColor: COLORS.BEIGE
  },
  pageWrapper: {
    flex: 1,
    width: width,
    height: BODY_HEIGHT
  },
  header: {
    height: 104,
    backgroundColor: COLORS.BEIGE
  },
  headerTopContainer: {
    paddingTop: 32
  },
  headerIcon: {
    width: 32,
    height:32,
    backgroundColor: COLORS.GRAY
  },
  headerProgressbar: {
    width: width-32-32-16,
    height: 12,
    backgroundColor: COLORS.PINK,
    marginLeft: 16,
    borderRadius: 4
  },
  title: {
    paddingTop: 22,
    paddingLeft: 20
  },
  footer: {
    height: 120,
    backgroundColor: COLORS.BEIGE,
    alignItems: "center"
  },
  roundButton: {
    marginTop: 0
  }
});

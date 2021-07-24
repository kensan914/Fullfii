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
        <Text>ヘッダー</Text>
        <Text>戻るボタン・プログレスバー・タイトルが入ります</Text>
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
          label="次へ"
          onPress={() => {
            goToPage();
          }}
        />
      </Block>
    </>
  );
};

const HEADER_HEIGHT = 96;
const FOOTER_HEIGHT = 96;
const BODY_HEIGHT = height - (HEADER_HEIGHT + FOOTER_HEIGHT);
const styles = StyleSheet.create({
  signupScrollView: {},
  pageWrapper: { flex: 1, width: width, height: BODY_HEIGHT },
  header: { height: 96, backgroundColor: COLORS.BEIGE },
  footer: { height: 96, backgroundColor: COLORS.BEIGE, alignItems: "center" },
});

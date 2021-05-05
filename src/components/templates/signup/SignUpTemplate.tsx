import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, ScrollView } from "react-native";
import { Block, theme } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";

import useSlideView from "src/components/templates/signup/useSlideView";
import SignUpPageFirst from "src/components/templates/signup/signupPages/SignUpPageFirst";
import SignUpPageInputProfile from "src/components/templates/signup/signupPages/SignUpPageInputProfile";
import { useAuthState } from "src/contexts/AuthContext";
import SignUpPageShuffleExplain from "src/components/templates/signup/signupPages/SignUpPageShuffleExplain";
import SignUpPagePushNotification from "src/components/templates/signup/signupPages/SignUpPagePushNotification";
import { COLORS } from "src/constants/theme";

const { width } = Dimensions.get("window");

const SignUpTemplate: React.FC = () => {
  const authState = useAuthState();
  const [initPage] = useState(
    // didProgressNumは完了済みのページ番号なのでその次のページから(+1)
    authState.signupBuffer.didProgressNum
      ? authState.signupBuffer.didProgressNum + 1
      : 1
  );
  const [, scrollViewRef, goToPage] = useSlideView(initPage);

  const [pageStack, setPageStack] = useState([
    <SignUpPageFirst goToPage={goToPage} key={1} progressNum={1} />,
    <SignUpPageShuffleExplain goToPage={goToPage} key={2} progressNum={2} />,
    // <SignUpPageSelectWorry goToPage={goToPage} key={3} progressNum={3} />,
    <SignUpPageInputProfile goToPage={goToPage} key={3} progressNum={3} />,
    <SignUpPagePushNotification key={4} progressNum={4} />,
  ]);

  useEffect(() => {
    // 既に完了しているページは省略(ex. didProgressNum===2 --> ThirdPageから)
    const _pageStack = pageStack.slice(authState.signupBuffer.didProgressNum);
    setPageStack(_pageStack);
  }, []);

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0.25, y: 1.1 }}
      locations={[0.2, 1]}
      colors={[COLORS.BEIGE, COLORS.BEIGE]}
      style={[styles.container, { flex: 1, paddingTop: theme.SIZES.BASE * 4 }]}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.signupScrollView}
        horizontal
        scrollEnabled={false}
      >
        <Block flex row>
          {pageStack}
        </Block>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignUpTemplate;

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  input: {
    width: width * 0.9,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#F69896",
  },
  inputActive: {
    borderBottomWidth: 2,
  },
  signupScrollView: {
    marginTop: 10,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  signupContainer: {
    width: width,
    padding: 22,
    paddingBottom: 40,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  secondPageButton: {
    width: width / 2.4,
    marginHorizontal: 10,
    height: 48,
    borderRadius: 24,
    marginTop: 0,
    marginBottom: 0,
  },
});

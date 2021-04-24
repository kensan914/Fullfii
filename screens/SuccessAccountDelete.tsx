import React, { useEffect, useRef, useState } from "react";
import { Block, Text, Button } from "galio-framework";
import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

import { width } from "../constants";
import { COLORS } from "../constants/Theme";
import { LottieSource } from "../components/types/Types";
import useAllContext from "../components/contexts/ContextUtils";
import { dangerouslyDelete } from "../components/modules/auth/crud";

const SuccessAccountDelete: React.FC = () => {
  const [
    lottieSuccessSource,
    setLottieSuccessSource,
  ] = useState<LottieSource>();

  useEffect(() => {
    (async () => {
      import("../assets/animations/success.json").then((source) => {
        setLottieSuccessSource(source.default);
      });
    })();
  }, []);

  const animationSuccess = useRef<LottieView>(null);

  const isAnimated = useRef(false);
  useEffect(() => {
    // まだアニメーションしていない時
    if (
      !isAnimated.current &&
      lottieSuccessSource &&
      animationSuccess.current !== null
    ) {
      playSuccessAnimation();
    }
  }, [lottieSuccessSource]);

  const playSuccessAnimation = () => {
    const timeStartTapAnimation = 500;

    setTimeout(() => {
      animationSuccess.current !== null && animationSuccess.current.play();
    }, timeStartTapAnimation);

    isAnimated.current = true;
  };

  const [, dispatches] = useAllContext();
  const onPressToTop = () => {
    dangerouslyDelete(dispatches);
  };

  return (
    <Block flex middle style={styles.container}>
      <Block flex={0.3} style={styles.titleContainer}>
        <Text size={26} bold color={COLORS.PINK} style={styles.title}>
          無事アカウントが{"\n"}削除されました
        </Text>
        <Text size={16} bold style={styles.subTitle}>
          サービス改善に努めて参りますので、再度ご利用いただける日を心からお待ちしています
        </Text>
      </Block>

      <Block flex={0.55} style={styles.contentsContainer}>
        {lottieSuccessSource && (
          <LottieView
            ref={animationSuccess}
            style={{
              width: width * 0.7,
            }}
            loop={false}
            source={lottieSuccessSource}
          />
        )}
      </Block>

      <Block flex={0.15} style={styles.buttonContainer}>
        <Button
          round
          color={COLORS.PINK}
          shadowColor={COLORS.PINK}
          style={[styles.goNextButton]}
          onPress={onPressToTop}
        >
          <Text bold color="white" size={16}>
            トップに戻る
          </Text>
        </Button>
      </Block>
    </Block>
  );
};

export default SuccessAccountDelete;

const styles = StyleSheet.create({
  container: {
    width: width,
    padding: 22,
    paddingBottom: 40,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  buttonContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  contentsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  subTitle: {
    lineHeight: 20,
    paddingHorizontal: 2,
    textAlign: "center",
    color: "pink",
  },
  goNextButton: {
    alignSelf: "center",
  },
});

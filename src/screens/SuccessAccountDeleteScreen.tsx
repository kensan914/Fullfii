import React, { useEffect, useRef, useState } from "react";
import { Block, Text } from "galio-framework";
import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

import { width } from "src/constants";
import { LottieSource } from "src/types/Types";
import useAllContext from "src/contexts/ContextUtils";
import { dangerouslyDelete } from "src/utils/auth/crud";
import { RoundButton } from "src/components/atoms/RoundButton";

export const SuccessAccountDeleteScreen: React.FC = () => {
  const [lottieSuccessSource, setLottieSuccessSource] =
    useState<LottieSource>();

  useEffect(() => {
    (async () => {
      import("src/assets/animations/success.json").then((source) => {
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
  const onPressToTop = async () => {
    await dangerouslyDelete(dispatches);
  };

  return (
    <Block flex middle style={styles.container}>
      <Block flex={0.3} style={styles.titleContainer}>
        <Text size={26} bold color="#6a6a6a" style={styles.title}>
          無事アカウントが{"\n"}削除されました
        </Text>
        <Text size={16} bold color="gray" style={styles.subTitle}>
          サービス改善に努めて参りますので、再度ご利用いただける日を心からお待ちしています！
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
            resizeMode="cover"
          />
        )}
      </Block>

      <Block flex={0.15} style={styles.buttonContainer}>
        <RoundButton
          label={"トップに戻る"}
          onPress={onPressToTop}
          style={styles.goNextButton}
        />
      </Block>
    </Block>
  );
};

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
  },
  goNextButton: {
    alignSelf: "center",
  },
});

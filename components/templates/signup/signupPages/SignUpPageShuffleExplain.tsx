import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import { Block, Text } from "galio-framework";
import { Dimensions } from "react-native";

import { useAuthDispatch, useAuthState } from "../../../contexts/AuthContext";
import { GoToPage } from "../../../types/Types";
import SignUpPageTemplate from "./SignUpPageTemplate";
import { LottieSource } from "../../../types/Types";

const { width } = Dimensions.get("window");

type Props = {
  goToPage: GoToPage;
};
const SignUpPageShuffleExplain: React.FC<Props> = (props) => {
  const { goToPage } = props;
  const authDispatch = useAuthDispatch();
  const authState = useAuthState();
  const progressNum = 2;

  const [
    lottieShuffleSource,
    setLottieShuffleSource,
  ] = useState<LottieSource>();
  const animationShuffle = useRef<LottieView>(null);

  const [lottieTapSource, setLottieTapSource] = useState<LottieSource>();
  const animationTap = useRef<LottieView>(null);

  useEffect(() => {
    (async () => {
      import("../../../../assets/animations/shuffle.json").then((source) => {
        setLottieShuffleSource(source.default);
      });
      import(
        "../../../../assets/animations/50357-touch-and-hold-gesture.json"
      ).then((source) => {
        setLottieTapSource(source.default);
      });
    })();
  }, []);

  const playShuffleExplainAnimation = () => {
    animationTap.current !== null && animationTap.current.play();
    const timeShuffleFromTap = 500;
    setTimeout(() => {
      animationShuffle.current !== null && animationShuffle.current.play();
    }, timeShuffleFromTap);
    isAnimated.current = true;
  };

  const isAnimated = useRef(false);
  useEffect(() => {
    // 本スライドに切り替わった時
    if (authState.signupBuffer.didProgressNum === progressNum - 1) {
      // まだアニメーションしていない時
      if (
        !isAnimated.current &&
        animationShuffle.current !== null &&
        animationTap.current !== null
      ) {
        playShuffleExplainAnimation();
      }
    }
  }, [
    authState.signupBuffer.didProgressNum,
    animationShuffle.current,
    animationTap.current,
  ]);

  const pressButton = () => {
    authDispatch({
      type: "TO_PROGRESS_SIGNUP",
      didProgressNum: progressNum,
      isFinished: false,
    });
    goToPage(progressNum + 1);
  };

  const renderContents = () => {
    // 端末によってShuffleLottieView・TapLottieViewの位置に違いが出ないように絶対指定
    const ContainerWidth = 380;
    const ShuffleLottieViewWidth = 200;
    const TapLottieViewWidth = 160;
    const TapLottieViewRight = 6; // 指先がちょうど円周と重なるように
    const TapLottieViewBottom = -22;

    return (
      <Block>
        <Block flex={0.9} style={{ justifyContent: "center" }}>
          <Block
            style={{
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
              // backgroundColor: "pink",
              // width: ContainerWidth,
              width: width,
            }}
          >
            {lottieShuffleSource && (
              <LottieView
                ref={animationShuffle}
                style={{
                  width: ShuffleLottieViewWidth,
                  // backgroundColor: "red",
                }}
                loop={false}
                source={lottieShuffleSource}
              />
            )}
            {lottieTapSource && (
              <LottieView
                ref={animationTap}
                style={{
                  right: TapLottieViewRight,
                  bottom: TapLottieViewBottom,
                  width: TapLottieViewWidth,
                  position: "absolute",
                  // backgroundColor: "blue",
                }}
                resizeMode="cover"
                loop={false}
                source={lottieTapSource}
              />
            )}
          </Block>
        </Block>
        <Block
          flex={0.1}
          style={{
            // backgroundColor: "red",
            justifyContent: "flex-end",
            alignItems: "center",
            alignSelf: "center",
            width: width,
          }}
        >
          <Text bold size={20} color="dimgray">
            一期一会のチャット相談アプリです。
          </Text>
        </Block>
      </Block>
    );
  };

  return (
    <SignUpPageTemplate
      title={"好きな条件でシャッフルして話し相手を見つけましょう"}
      subTitle=""
      contents={renderContents()}
      isLoading={false}
      pressCallback={pressButton}
      buttonTitle="次へ"
    />
  );
};

export default SignUpPageShuffleExplain;

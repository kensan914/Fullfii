import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Text } from "galio-framework";

import { COLORS } from "src/constants/colors";

export type AnimatedTextMethods = {
  startAnimation: (
    animationId: string,
    onCompleteAnimation: () => void
  ) => void;
  skipAnimation: (animationId: string) => void;
  disableAnimation: () => void;
};
type Props = {
  bold?: boolean;
  color?: string;
  size?: number;
  children: string;
  durationMs?: number;
  delayStartIntervalMs?: number;
};
export const AnimatedText = React.forwardRef<AnimatedTextMethods, Props>(
  (props, ref) => {
    const {
      bold = false,
      color = COLORS.BLACK,
      size = 16,
      children: text,
      durationMs = 60,
      delayStartIntervalMs = 600,
    } = props;

    const [displayTextLength, _setDisplayTextLength] = useState(0);
    const displayTextLengthRef = useRef(displayTextLength); // インターバルコールバック内で使用 (stateは使えないため).
    const setDisplayTextLength = (newDisplayTextLength: number): void => {
      displayTextLengthRef.current = newDisplayTextLength;
      _setDisplayTextLength(newDisplayTextLength);
    };
    // アニメーション無効 (startAnimation実行時falseに)
    const [isDisableAnimation, setIsDisableAnimation] = useState(false);

    // onCompleteAnimationをアニメーションごとに管理する
    const onCompleteAnimationCollection = useRef<{
      [animationId: string]: () => void;
    }>({});
    const exeOnCompleteAnimation = (animationId: string) => {
      if (animationId in onCompleteAnimationCollection.current) {
        onCompleteAnimationCollection.current[animationId]();
      }
    };

    const intervalId = useRef<NodeJS.Timeout>();
    const clearIntervalAnimation = () => {
      intervalId.current && clearInterval(intervalId.current);
    };

    useImperativeHandle(
      ref,
      () => ({
        startAnimation: (
          animationId: string,
          onCompleteAnimation: () => void
        ) => {
          clearIntervalAnimation();
          setDisplayTextLength(0);
          setIsDisableAnimation(false);
          onCompleteAnimationCollection.current[animationId] =
            onCompleteAnimation;
          setTimeout(() => {
            intervalId.current = setInterval(() => {
              if (displayTextLengthRef.current >= text.length) {
                clearIntervalAnimation();
                exeOnCompleteAnimation(animationId);
                return;
              }
              setDisplayTextLength(displayTextLengthRef.current + 1);
            }, durationMs);
          }, delayStartIntervalMs);
        },
        skipAnimation: (animationId: string) => {
          setDisplayTextLength(text.length);
          clearIntervalAnimation();
          exeOnCompleteAnimation(animationId);
        },
        disableAnimation: () => {
          setIsDisableAnimation(true);
        },
      }),
      [text, displayTextLength]
    );

    useEffect(() => {
      return () => {
        clearIntervalAnimation();
      };
    }, []);

    return (
      <Text size={size} bold={bold} color={color}>
        {!isDisableAnimation ? text.slice(0, displayTextLength) : text}
      </Text>
    );
  }
);

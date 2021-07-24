import React, { useCallback, useState } from "react";
import { Block } from "galio-framework";
import {
  ImageURISource,
  LayoutAnimation,
  Pressable,
  StyleSheet,
} from "react-native";

import { SvgUri } from "src/components/atoms/SvgUri";

type Props = {
  source: ImageURISource;
  onPress: () => void;
  style?: { [styleName: string]: string };
  diameter?: number;
  reductionRate?: number;
  shadowColor?: string;
};
const SvgButton: React.FC<Props> = (props) => {
  const {
    source,
    style,
    onPress,
    diameter = 150,
    reductionRate = 0.95,
    shadowColor = "#f08080",
  } = props;

  const [isPressed, setIsPressed] = useState(false);

  const onAnimationPress = (isPressed: boolean) => {
    LayoutAnimation.spring();
    setIsPressed(isPressed);
  };

  const onPressIn = useCallback((e) => {
    e.persist();
    onAnimationPress(true);
  }, []);

  const onPressHandler = () => {
    // e.persist();
    onAnimationPress(false);
    onPress();
  };

  return (
    <Pressable
      onPressIn={onPressIn}
      onPress={onPressHandler}
      onPressOut={() => onAnimationPress(false)} // onPressが発火しないときのため
      style={styles.pressable}
    >
      <Block
        style={[
          styles.buttonContainer,
          style,
          {
            width: diameter,
            height: diameter,
          },
        ]}
      >
        <Block style={[styles.svgContainer]}>
          <SvgUri
            width={diameter * 0.5}
            height={diameter * 0.5}
            source={source}
          />
        </Block>
        <Block
          style={[
            styles.button,
            {
              width: isPressed ? diameter * reductionRate : diameter,
              height: isPressed ? diameter * reductionRate : diameter,
              borderRadius:
                (isPressed ? diameter * reductionRate : diameter) / 2,

              shadowColor: shadowColor,
              shadowOffset: {
                width: 0,
                height: isPressed ? 1 : 3,
              },
              shadowOpacity: isPressed ? 0.4 : 0.85,
              shadowRadius: isPressed ? 6 : 8,
              elevation: 1,
            },
          ]}
        />
      </Block>
    </Pressable>
  );
};

export default SvgButton;

const styles = StyleSheet.create({
  pressable: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    position: "absolute",
    backgroundColor: "white",
  },
  svgContainer: {
    zIndex: 100,
  },
});

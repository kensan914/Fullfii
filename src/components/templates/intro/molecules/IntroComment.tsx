import React, { useState } from "react";
import { Text, Block } from "galio-framework";
import { Image, StyleProp, StyleSheet, ViewStyle } from "react-native";

import { COLORS } from "src/constants/colors";
import { width } from "src/constants";
import { fmtfromDateToStr } from "src/utils";
import { LECTURE_WOMAN_IMG } from "src/constants/imagePath";

type Props = {
  isLocateRight?: boolean;
  children: string;
  style?: StyleProp<ViewStyle>;
};
export const IntroComment: React.FC<Props> = (props) => {
  const { isLocateRight = false, children, style } = props;

  const [dateTime] = useState(new Date());

  return (
    <Block
      style={[
        isLocateRight ? styles.rightContainer : styles.leftContainer,
        style,
      ]}
    >
      {!isLocateRight && (
        <Image style={styles.avatar} source={LECTURE_WOMAN_IMG} />
      )}
      <Block
        style={
          isLocateRight
            ? styles.rightMessageContainer
            : styles.leftMessageContainer
        }
      >
        <Block style={isLocateRight ? styles.rightMessage : styles.leftMessage}>
          <Text
            size={14}
            color={isLocateRight ? COLORS.WHITE : COLORS.LIGHT_GRAY}
          >
            {children}
          </Text>
        </Block>
        <Text size={12} color={COLORS.LIGHT_GRAY} style={styles.textLineHeight}>
          {fmtfromDateToStr(dateTime, "hh:mm")}
        </Text>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  rightContainer: {
    alignItems: "flex-end",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightMessageContainer: {
    alignItems: "flex-end",
  },
  leftMessageContainer: {},
  rightMessage: {
    backgroundColor: COLORS.BROWN,
    height: "auto",
    padding: 8,
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  leftMessage: {
    backgroundColor: COLORS.WHITE,
    height: "auto",
    maxWidth: width * 0.7,
    padding: 8,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  textLineHeight: {
    lineHeight: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 8,
  },
});

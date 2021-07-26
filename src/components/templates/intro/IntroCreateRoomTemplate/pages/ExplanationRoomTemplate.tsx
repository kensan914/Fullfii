import React from "react";
import { Text, Button, Block } from "galio-framework";
import {
  StyleSheet,
  Image
} from "react-native";
import { COLORS } from "src/constants/colors";
import { width, height } from "src/constants";
import { LECTURE_WOMAN_IMG } from "src/constants/imagePath";

export const ExplanationRoomTemplate: React.FC = () => {
  return (
    <Block flex style={styles.container}>
      {/* {new Array(2).fill(null).map((_, index) => {
        return (
          <Text key={index}>
            あなたの悩みを話すためのルームを作ろう({index})
          </Text>
        );
      })} */}
      <Block bottom >
        <Block style={styles.rightMessage}>
          <Text size={14} color={COLORS.WHITE}>ルームってなに？？</Text>
        </Block>
        <Text size={12} color={COLORS.LIGHT_GRAY} style={styles.textLineHeight}>21:23</Text>
      </Block>
      <Block  row style={styles.leftMessageContainer}>
        <Image
          style={styles.avater}
          source={ LECTURE_WOMAN_IMG }
        />
        <Block>
          <Block style={styles.leftMessage}>
            <Text size={14} color={COLORS.BLACK} numberOfLines={2} ellipsizeMode="tail">"ルーム"は悩みを話すためのトークルームのことだよ！</Text>
          </Block>
          <Text size={12} color={COLORS.LIGHT_GRAY} style={styles.textLineHeight}>21:23</Text>
        </Block>
      </Block>
      <Block  row style={styles.leftMessageContainer}>
        <Image
          style={styles.avater}
          source={ LECTURE_WOMAN_IMG }
        />
        <Block>
          <Block  center style={styles.leftMessage}>
            <Text size={14} color={COLORS.BLACK} numberOfLines={2} ellipsizeMode="tail">悩みを話したい時は、まずはあなた専用のルームを作ろう！</Text>
          </Block>
          <Text size={12} color={COLORS.LIGHT_GRAY} style={styles.textLineHeight}>21:23</Text>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    justifyContent: "center",
    height: height-120-104-48
  },
  rightMessageContainer: {
    marginBottom: 20
  },
  rightMessage: {
    backgroundColor: COLORS.BROWN,
    height: "auto",
    width: 138,
    padding: 8,
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  textLineHeight: {
    lineHeight: 20
  },
  avater: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 8,
  },
  leftMessageContainer: {
    marginTop: 20
  },
  leftMessage: {
    backgroundColor: COLORS.WHITE,
    height: "auto",
    width: 270,
    padding: 8,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  }
})
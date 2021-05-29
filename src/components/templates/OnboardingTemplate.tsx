import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import { StyleSheet, Image, ImageSourcePropType } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

import { COLORS } from "src/constants/theme";
import { width } from "src/constants";
import { Request } from "src/types/Types";

type Props = {
  requestPostSignup: Request;
  isLoadingPostSignup: boolean;
};
export const OnboardingTemplate: React.FC<Props> = (props) => {
  const { requestPostSignup, isLoadingPostSignup } = props;

  type slideItem = {
    key: string;
    title: string;
    text: string;
    image: ImageSourcePropType;
    backgroundColor: string;
    textColor: string;
  };
  const slideItems: slideItem[] = [
    {
      key: "one",
      title: "Fullfiiとは",
      text: "Fullfiiはチャットで\n話せる悩み相談アプリです",
      image: require("../../assets/images/intro/49.png"),
      backgroundColor: COLORS.BEIGE,
      textColor: COLORS.BLACK,
    },
    {
      key: "two",
      title: "みんなに見られない",
      text:
        "ルームにはあなたと相手しかいないので、\n他の人に会話が見られることはありません",
      image: require("../../assets/images/intro/46.png"),
      backgroundColor: "#C7ACDA",
      textColor: COLORS.WHITE,
    },
    {
      key: "three",
      title: "繋がりすぎない",
      text: "フォロー・フォロワーは存在しません\n相手とは話す時だけの関係です",
      image: require("../../assets/images/intro/48.png"),
      backgroundColor: "#74C4C0",
      textColor: COLORS.WHITE,
    },
    {
      key: "four",
      title: "はなそう\nきいてあげよう",
      text:
        "ルームを作って悩みを話したり、\nルームに入って悩みを聞いてあげましょう",
      image: require("../../assets/images/intro/47.png"),
      backgroundColor: "#7BBD9F",
      textColor: COLORS.WHITE,
    },
  ];

  const renderItem: React.FC<{ item: slideItem }> = (props) => {
    const { item } = props;
    return (
      <Block
        flex
        style={[styles.container, { backgroundColor: item.backgroundColor }]}
      >
        <Block center style={styles.imageContainer}>
          <Image style={styles.image} source={item.image} />
        </Block>
        <Block style={styles.subContainer}>
          <Block center style={styles.titleContainer}>
            <Text size={32} bold color={item.textColor} center>
              {item.title}
            </Text>
          </Block>
          <Block center style={styles.textContainer}>
            <Text size={18} color={item.textColor} center>
              {item.text}
            </Text>
          </Block>
        </Block>
      </Block>
    );
  };

  const onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    requestPostSignup();
  };
  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slideItems}
      onDone={onDone}
      bottomButton={true}
      doneLabel="はじめる"
      nextLabel="次へ"
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  imageContainer: {
    marginTop: "18%",
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 200,
    backgroundColor: "#fff",
  },
  subContainer: {
    marginTop: "9%",
    marginBottom: "60%",
  },
  titleContainer: {},
  title: {},
  textContainer: {
    marginTop: "9%",
  },
  text: {},
});

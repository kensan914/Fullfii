import React from "react";
import { StyleSheet, Image } from "react-native";
import { Block, Text } from "galio-framework";

import { COLORS } from "src/constants/colors";
import { MAINTENANCE_IMG, ERROR_5XX_IMG } from "src/constants/imagePath";

type Props = {
  isMaintenance: boolean;
  openTwitterFullfii: () => void;
};
export const Alert5xxTemplate: React.FC<Props> = (props) => {
  const { isMaintenance, openTwitterFullfii } = props;

  return (
    <Block flex style={styles.container}>
      <Block flex={0.2} center style={styles.title}>
        <Text size={20} bold color={COLORS.BLACK}>
          {isMaintenance
            ? "ただいまメンテナンス中です🚧"
            : "ごめんなさい...\nあなたは何も悪くないです😢"}
        </Text>
      </Block>
      <Block flex={0.6} center style={styles.imageContainer}>
        <Image
          source={isMaintenance ? MAINTENANCE_IMG : ERROR_5XX_IMG}
          style={styles.image}
        />
      </Block>
      <Block flex={0.2} center style={styles.explanation}>
        {isMaintenance ? (
          <Block>
            <Text size={16} color={COLORS.BLACK} style={styles.lineHeight}>
              ただいま内部メンテナンス中のため、ご利用できません
            </Text>
            <Block row style={styles.bottomExplanation}>
              <Text size={16} color={COLORS.BLACK} style={styles.lineHeight}>
                詳しくは
              </Text>
              <Text
                size={16}
                color="#007aff"
                style={styles.lineHeight}
                onPress={openTwitterFullfii}
              >
                twitter
              </Text>
              <Text size={16} color={COLORS.BLACK} style={styles.lineHeight}>
                よりご確認ください
              </Text>
            </Block>
          </Block>
        ) : (
          <Block>
            <Text size={16} color={COLORS.BLACK} style={styles.lineHeight}>
              内部サーバーに問題が発生しました
            </Text>
            <Text size={16} color={COLORS.BLACK} style={styles.lineHeight}>
              時間をおいて再度アプリを開き直すか
            </Text>
            <Block row style={styles.bottomExplanation}>
              <Text
                size={16}
                color="#007aff"
                style={styles.lineHeight}
                onPress={openTwitterFullfii}
              >
                twitter
              </Text>
              <Text size={16} color={COLORS.BLACK} style={styles.lineHeight}>
                よりお問い合わせください
              </Text>
            </Block>
          </Block>
        )}
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    backgroundColor: COLORS.BEIGE,
  },
  title: {
    justifyContent: "flex-end",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 250,
    width: 250,
  },
  explanation: {},
  bottomExplanation: {
    alignItems: "center",
  },
  lineHeight: {
    lineHeight: 20,
  },
});

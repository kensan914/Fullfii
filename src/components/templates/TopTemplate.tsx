import React, {useState} from "react";
import { Block, Button, Text } from "galio-framework";
import { StyleSheet, Dimensions, FlatList } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { BASE_URL, USER_POLICY_URL } from "src/constants/env";


import { COLORS } from "src/constants/theme";

const { width, height } = Dimensions.get("screen");

export const TopTemplate: React.FC = () => {
  return (
    <Block style={styles.container}>
      <Block center style={styles.tilte}>
        <Text size={64} bold color={COLORS.BLACK}>Fullfii</Text>
      </Block>
      <Block center style={styles.textContainer}>
        <Block style={styles.textTop}>
          <Text size={16} color={COLORS.BLACK}>
          「承諾」をタップすると、
          </Text>
        </Block>
        <Block row>
          <Text
            bold
            size={16}
            color={COLORS.BROWN}
            onPress={() => WebBrowser.openBrowserAsync(USER_POLICY_URL)}
            style={{ textDecorationLine: "underline" }}
          >
            サービス利用規約
          </Text>
          <Text size={16} >
          に同意します
          </Text>
        </Block>
      </Block>
      <Block center>
      <Button style={styles.button}>
        <Text size={20} bold color={COLORS.WHITE}
        >承諾</Text>
      </Button>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  tilte: {
    marginTop: 184
  },
  textContainer: {
    marginTop: "100%"
  },
  textTop: {
    marginBottom: 8
  },
  button: {
    backgroundColor: COLORS.BROWN,
    marginTop: 64,
    width: 335,
    height: 64,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
  }
});
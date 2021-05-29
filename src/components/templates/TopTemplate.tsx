import React from "react";
import { Block, Button, Text } from "galio-framework";
import { StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { USER_POLICY_URL } from "src/constants/env";

import { COLORS } from "src/constants/theme";

type Props = {
  onPressConsent: () => void;
};
export const TopTemplate: React.FC<Props> = (props) => {
  const { onPressConsent } = props;

  return (
    <Block flex style={styles.container}>
      <Block flex={0.4} center style={styles.title}>
        <Text size={64} bold color={COLORS.BLACK}>
          Fullfii
        </Text>
      </Block>
      <Block flex={0.45} center style={styles.textContainer}>
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
          <Text size={16}>に同意します</Text>
        </Block>
      </Block>
      <Block flex={0.15} center style={{}}>
        <Button style={styles.button} onPress={onPressConsent}>
          <Text size={20} bold color={COLORS.WHITE}>
            承諾
          </Text>
        </Button>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: COLORS.BEIGE,
  },
  title: {
    // marginTop: 184,
    // marginTop: 120,
    justifyContent: "center",
  },
  textContainer: {
    // marginTop: "100%",
    justifyContent: "flex-end",
    paddingBottom: 32,
  },
  textTop: {
    // marginBottom: 8,
  },
  button: {
    backgroundColor: COLORS.BROWN,
    // marginTop: 64,
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
  },
});

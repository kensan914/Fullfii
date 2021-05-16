import React, {useState} from "react";
import { Block, Button, Text } from "galio-framework";
import { StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { BASE_URL, USER_POLICY_URL } from "src/constants/env";
import { COLORS } from "src/constants/theme";
import IconExtra from "src/components/atoms/Icon";
const { width } = Dimensions.get("screen");

export const ProfileTemplate: React.FC = (props) => {
  const [close, setClose] = useState(false)
  // const {close, setClose} = props
  return (
    <Block flex style={styles.container}>
      {
        !close ?
          <Block center>
            <Block style={styles.alret}>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => {
                  setClose(true);
                }}
              >
                <IconExtra
                  name="close"
                  family="Ionicons"
                  size={32}
                  color={COLORS.HILIGHT_GRAY}
                />
              </TouchableOpacity>
              <Block style={styles.messageContainer}>
                <Text size={16} color={COLORS.BLACK}>
                  プロフィールを入力すると他のユーザーがあなたのルームに入りやすくなります
                </Text>
              </Block>
              <Block center style={styles.notification}>
                <Text bold size={15} color={COLORS.WHITE}>
                  1{/* 100以上は99表示 */}
                </Text>
              </Block>
            </Block>
          </Block>
      : <></>
      }

      <Block center style={styles.iconContainer}>
      <IconExtra
        name="user"
        family="AntDesign"
        size={80}
        color={COLORS.LIGHT_GRAY}
      />
      </Block>
      <Block center style={styles.textContainer}>
        <Text size={16} color={COLORS.BLACK}>プロフィールを作成しましょう</Text>
      </Block>
      <Block center>
      <Button style={styles.button}>
        <Text size={20} bold color={COLORS.WHITE}
        >作成</Text>
      </Button>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,
  },
  alret: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: "relative",
    width: width - 40,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.26,
    shadowRadius: 0,
    elevation: 1,
  },
  closeIcon: {
    marginBottom: 8,
    width: 32,
  },
  messageContainer: {
    marginRight: 32,
  },
  notification: {
    position: "absolute",
    justifyContent: "center",
    right: 16,
    top: 16,
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: COLORS.RED,
  },
  iconContainer: {
    marginTop: "25%",
    marginBottom: 40
  },
  textContainer: {
    marginBottom: 40
  },
  button: {
    backgroundColor: COLORS.BROWN,
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

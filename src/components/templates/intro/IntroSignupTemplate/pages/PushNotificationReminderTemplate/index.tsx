import React, {useState} from "react";
import { Text, Button, Block } from "galio-framework";
import {
  StyleSheet,
  Image,
  TextInput,
  Keyboard,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { COLORS } from "src/constants/colors";
import { width, height } from "src/constants";
import { MAN_AND_WOMAN_IMG, MEN_IMG } from "src/constants/imagePath";
import { ALERT_MESSAGES } from "src/constants/alertMessages";
import { NOTIFICATION_IMG } from "src/constants/imagePath";
import { LECTURE_WOMAN_IMG } from "src/constants/imagePath";

export const PushNotificationReminderTemplate: React.FC = () => {
  return (
    <Block flex style={styles.container}>
      <Block flex={0.3} style={styles.notificationImgContainer} >
        <Image
            style={styles.notificationImg}
            source={ NOTIFICATION_IMG }
          />
      </Block>
      <Block flex={0.7} row style={styles.leftMessageContainer}>
        <Image
          style={styles.avater}
          source={ LECTURE_WOMAN_IMG }
        />
        <Block>
          <Block style={styles.leftMessage}>
            <Text size={14} color={COLORS.BLACK} numberOfLines={2} ellipsizeMode="tail">話し相手のメッセージにすぐ気づけるよ！</Text>
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
    height: height -120-104-48
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
    alignItems: "center",
  },
  leftMessage: {
    backgroundColor: COLORS.WHITE,
    height: "auto",
    width: 250,
    padding: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  notificationImgContainer: {
    alignItems: "center",
    marginTop: 40
  },
  notificationImg: {
    height: 147,
    width: 200
  }
})
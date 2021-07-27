import React from "react";
import { StyleSheet, Image, Platform } from "react-native";
import { Block } from "galio-framework";

import { NOTIFICATION_PERMISSION_DIALOG_IMG } from "src/constants/imagePath";
import { BodyAnimSettings_pushNotificationReminder } from "src/types/Types";
import { AnimatedView } from "src/components/templates/intro/organisms/AnimatedView";
import { IntroComment } from "src/components/templates/intro/molecules/IntroComment";
import { width } from "src/constants";

type Props = {
  bodyAnimSettings: BodyAnimSettings_pushNotificationReminder;
};
export const PushNotificationReminderTemplate: React.FC<Props> = (props) => {
  const { bodyAnimSettings } = props;

  return (
    <Block flex style={styles.container}>
      {Platform.OS === "ios" ? (
        <>
          <AnimatedView {...bodyAnimSettings[0]}>
            <Block style={styles.notificationImgContainer}>
              <Image
                style={styles.notificationImg}
                source={NOTIFICATION_PERMISSION_DIALOG_IMG}
                resizeMode="contain"
              />
            </Block>
          </AnimatedView>
          <AnimatedView {...bodyAnimSettings[1]}>
            <IntroComment style={{ marginTop: 40 }}>
              話し相手のメッセージにすぐ気づけるよ！
            </IntroComment>
          </AnimatedView>
        </>
      ) : (
        <AnimatedView {...bodyAnimSettings[0]}>
          <IntroComment style={{ marginTop: 56 }}>
            これで準備完了！ケントニックさん、下のボタンを押してみんなが作ったルームを見てみよう！
          </IntroComment>
        </AnimatedView>
      )}
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  notificationImgContainer: {
    alignItems: "center",
    marginTop: 32,
  },
  notificationImg: {
    width: width * 0.64,
  },
});

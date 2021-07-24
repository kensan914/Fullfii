import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Block, theme, Text, Button } from "galio-framework";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/core";

import { Icon } from "src/components/atoms/Icon";
import { Hr } from "src/components/atoms/Hr";
import {
  USER_POLICY_URL,
  VERSION,
  CONTACT_US_URL,
  PRIVACY_POLICY_URL,
  ADMOB_BANNER_HEIGHT,
  ADMOB_BANNER_WIDTH,
} from "src/constants/env";
import { OnPress } from "src/types/Types";
import { COLORS } from "src/constants/theme";
import { width } from "src/constants";
import {logEvent} from "src/utils/firebase/logEvent"

export const SettingsScreen: React.FC = () => {
  const _handleOpenWithWebBrowser = () => {
    WebBrowser.openBrowserAsync(USER_POLICY_URL);
  };

  const _handleOpenWithWebBrowserPrivacyPolicy = () => {
    WebBrowser.openBrowserAsync(PRIVACY_POLICY_URL);
  };

  const _handleOpenWithWebBrowserContactUsForm = () => {
    WebBrowser.openBrowserAsync(CONTACT_US_URL);
  };

  const navigation = useNavigation();
  const [openFirstContent, setOpenFirstContent] = useState(false);
  const [openSecondContent, setOpenSecondContent] = useState(false);
  const [openThirdContent, setOpenThirdContent] = useState(false);
  const [openFourthContent, setOpenFourthContent] = useState(false);

  return (
    <Block flex center style={{ backgroundColor: COLORS.BEIGE, width: width }}>
      <ScrollView>
        <SettingsTitle title="Fullfiiについて" />
        <SettingsLabel title="バージョン" content={VERSION} />
        <SettingsCard
          title="利用規約"
          titleColor={COLORS.GRAY}
          iconName={"chevron-right"}
          onPress={_handleOpenWithWebBrowser}
        />
        <SettingsCard
          title="プライバシーポリシー"
          titleColor={COLORS.GRAY}
          iconName={"chevron-right"}
          onPress={_handleOpenWithWebBrowserPrivacyPolicy}
        />
        <SettingsCard
          title="お問い合わせ"
          titleColor={COLORS.GRAY}
          iconName={"chevron-right"}
          onPress={_handleOpenWithWebBrowserContactUsForm}
        />
        <SettingsCard
          title="アカウント削除"
          titleColor="#f44336"
          iconName={"chevron-right"}
          onPress={() => {
            navigation.navigate("AccountDelete");
          }}
        />
        <SettingsTitle title="使い方ヘルプ" />
        <>
          <SettingsCard
            title="どういうアプリ？"
            titleColor={COLORS.GRAY}
            iconName={openFirstContent ? "chevron-up" : "chevron-down"}
            onPress={() => {
              if (openFirstContent) {
              logEvent("press_what_is_this_app")
              }
              setOpenFirstContent(!openFirstContent);
            }}
          />
          {openFirstContent ? (
            <Block style={styles.hiddenContent}>
              <Text
                size={14}
                color={COLORS.GRAY}
                style={styles.hiddenContentText}
              >
                ルームを通じて自分の悩みを話したり、相手の悩みを聞くことができるアプリです
              </Text>
            </Block>
          ) : null}
        </>
        <>
          <SettingsCard
            title="ルームとは？"
            titleColor={COLORS.GRAY}
            iconName={openSecondContent ? "chevron-up" : "chevron-down"}
            onPress={() => {
              if (openSecondContent) {
              logEvent("press_what_is_room")
              }
              setOpenSecondContent(!openSecondContent);
            }}
          />
          {openSecondContent ? (
            <Block style={styles.hiddenContent}>
              <Text
                size={14}
                color={COLORS.GRAY}
                style={styles.hiddenContentText}
              >
                悩み相談を行うトークルームをルームと呼びます{"\n"}
                ルーム内で話した内容は他の人には表示されません
              </Text>
            </Block>
          ) : null}
        </>
        <>
          <SettingsCard
            title="悩みを話すには？"
            titleColor={COLORS.GRAY}
            iconName={openThirdContent ? "chevron-up" : "chevron-down"}
            onPress={() => {
              if (openThirdContent) {
              logEvent("press_how_to_speak")
              }
              setOpenThirdContent(!openThirdContent);
            }}
          />
          {openThirdContent ? (
            <Block style={styles.hiddenContent}>
              <Text
                size={14}
                color={COLORS.GRAY}
                style={styles.hiddenContentText}
              >
                ①ホーム画面またはマイトーク画面下部の「悩みを話すボタン」を押し、相談したいことを記載してルームを作成します
                {"\n"}
                ②他の人があなたのルームに入ってメッセージを送信すると、あなたに通知が届きます
                {"\n"}
                ③悩みを話し終えたら、トークの右上から「終了」ボタンを押して悩み相談を終了しましょう
              </Text>
            </Block>
          ) : null}
        </>
        <Block style={{ marginBottom: 40 }}>
          <SettingsCard
            title="悩みを聞くには？"
            titleColor={COLORS.GRAY}
            iconName={openFourthContent ? "chevron-up" : "chevron-down"}
            onPress={() => {
              if (openFourthContent) {
              logEvent("press_how_to_listen_to")
              }
              setOpenFourthContent(!openFourthContent);
            }}
          />
          {openFourthContent ? (
            <Block style={styles.hiddenContent}>
              <Text
                size={14}
                color={COLORS.GRAY}
                style={styles.hiddenContentText}
              >
                ①ホーム画面に一覧で表示されているルームの中から、悩みに共感できそうなルームを選んで「聞いてみる！」ボタンを押します
                {"\n"}
                ②ルームに入室したら相手の悩みを聞いてあげます{"\n"}
                ③相談が終了したらトーク画面右上の「退室」ボタンを押して退室しましょう
              </Text>
            </Block>
          ) : null}
        </Block>
      </ScrollView>
    </Block>
  );
};

const SettingsTitle: React.FC<{ title: string }> = (props) => {
  const { title } = props;
  return (
    <Block
      flex
      style={{ paddingHorizontal: 16, paddingVertical: 10, marginTop: 5 }}
    >
      <Text size={18} bold color={COLORS.GRAY}>
        {title}
      </Text>
    </Block>
  );
};

const SettingsCard: React.FC<{
  title: string;
  titleColor: string;
  iconName: string;
  onPress: OnPress;
}> = (props) => {
  const { title, titleColor, iconName, onPress } = props;
  return (
    <Button shadowless={true} onPress={onPress} style={styles.settingsInner}>
      <Block row space="between" style={styles.settingsCard}>
        <Block center>
          <Text bold size={14} color={titleColor}>
            {title}
          </Text>
        </Block>
        <Block center>
          <Icon
            name={iconName}
            family="Feather"
            color={COLORS.GRAY}
            size={24}
          />
        </Block>
      </Block>
      <Hr h={1} color="whitesmoke" />
    </Button>
  );
};

const SettingsLabel: React.FC<{ title: string; content: string }> = (props) => {
  const { title, content } = props;
  return (
    <>
      <Block flex row space="between" style={styles.settingsCard}>
        <Block center>
          <Text bold size={14} color={COLORS.GRAY}>
            {title}
          </Text>
        </Block>
        <Block style={{ alignItems: "center", justifyContent: "center" }}>
          <Text size={14} color={COLORS.GRAY}>
            {content}
          </Text>
        </Block>
      </Block>
      <Hr h={1} color="whitesmoke" />
    </>
  );
};

const styles = StyleSheet.create({
  settingsInner: {
    width: width,
    height: 48,
    backgroundColor: COLORS.WHITE,
  },
  settingsCard: {
    width: width,
    paddingHorizontal: 16,
    backgroundColor: COLORS.WHITE,
    height: 48,
  },
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE,
  },
  submitButton: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "lightcoral",
  },
  adMobBanner: {
    width: ADMOB_BANNER_WIDTH,
    height: ADMOB_BANNER_HEIGHT,
    zIndex: 2,
    position: "absolute",
    bottom: 0,
  },
  hiddenContent: {
    width: width,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.WHITE,
    height: "auto",
  },
  hiddenContentText: {
    lineHeight: 20,
  },
});

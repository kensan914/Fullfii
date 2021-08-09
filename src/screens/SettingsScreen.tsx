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
import { COLORS } from "src/constants/colors";
import { width } from "src/constants";
import { logEvent } from "src/utils/firebase/logEvent";

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
  const [openProhibitedMatters, setOpenProhibitedMatters] = useState(false);
  const [openFifthCorntent, setOpenFifthCorntent] = useState(false);
  const [openSixthCorntent, setOpenSixthCorntent] = useState(false);


  return (
    <Block flex center style={{ backgroundColor: COLORS.BEIGE, width: width }}>
      <ScrollView>
        <SettingsTitle title="Fullfiiについて" />
        <>
          <SettingsCard
            title="禁止事項について"
            titleColor={COLORS.GRAY}
            iconName={openProhibitedMatters ? "chevron-up" : "chevron-down"}
            onPress={() => {
              if (openProhibitedMatters) {
                logEvent("press_prohibited_matters");
              }
              setOpenProhibitedMatters(!openProhibitedMatters);
            }}
          />
          {openProhibitedMatters ? (
            <Block style={styles.hiddenContent}>
              <Text
                size={14}
                color={COLORS.GRAY}
                style={styles.hiddenContentText}
              >
                以下の行為は禁止となっています。発覚した場合、最悪アカウント凍結となります。{"\n"}{"\n"}
                ①相手が不快と感じるような性的、暴力的な表現に該当する行為{"\n"}
                ②出会い目的での他メッセージアプリへの誘導や引き抜きに該当する、またそれに近い行為{"\n"}
                ③その他利用規約第5条（禁止事項）に該当する行為{"\n"}{"\n"}
                相手が嫌な気分になることは最低限言わないようにご利用ください！（運営より）
              </Text>
            </Block>
          ) : null}
        </>
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
        <SettingsTitle title="使い方Q&A" />
        <>
          <SettingsCard
            title="どういうアプリ？"
            titleColor={COLORS.GRAY}
            iconName={openFirstContent ? "chevron-up" : "chevron-down"}
            onPress={() => {
              if (openFirstContent) {
                logEvent("press_what_is_this_app");
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
                logEvent("press_what_is_room");
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
                logEvent("press_how_to_speak");
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
                悩みを話す用のルームを作成するか、悩みを聞く用のルームに参加しましょう
                {"\n"}
                ・ 自分で「悩みを話したい」ルームを作成する
                {"\n"}
                ・ 他の人が作成した「聞きたい」ルームに参加する
              </Text>
            </Block>
          ) : null}
        </>
        <Block >
          <SettingsCard
            title="悩みを聞くには？"
            titleColor={COLORS.GRAY}
            iconName={openFourthContent ? "chevron-up" : "chevron-down"}
            onPress={() => {
              if (openFourthContent) {
                logEvent("press_how_to_listen_to");
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
                悩みを聞く用のルームを作成するか、悩みを話す用のルームに参加しましょう
                {"\n"}
                ・ 自分で「悩みを聞きたい」ルームを作成する
                {"\n"}
                ・ 他の人が作成した「話したい」ルームに参加する
              </Text>
            </Block>
          ) : null}
        </Block>
        <Block >
          <SettingsCard
            title="プライベートルームとは？"
            titleColor={COLORS.GRAY}
            iconName={openFifthCorntent ? "chevron-up" : "chevron-down"}
            onPress={() => {
              if (openFifthCorntent) {
                logEvent("press_what_is_private_room");
              }
              setOpenFifthCorntent(!openFifthCorntent);
            }}
          />
          {openFifthCorntent ? (
            <Block style={styles.hiddenContent}>
              <Text
                size={14}
                color={COLORS.GRAY}
                style={styles.hiddenContentText}
              >
                「また話したい人リスト」に追加したユーザーのみに公開されるルームです
                {"\n"}
                あなたを「また話したい人リスト」に追加したユーザーがプライベートルームを作成すると、あなたのホーム画面のプライベートタブに表示されます
              </Text>
            </Block>
          ) : null}
        </Block>
        <Block style={{ marginBottom: 40 }}>
          <SettingsCard
            title="また話したい人リストとは？"
            titleColor={COLORS.GRAY}
            iconName={openSixthCorntent ? "chevron-up" : "chevron-down"}
            onPress={() => {
              if (openSixthCorntent) {
                logEvent("press_want_to_talk_list");
              }
              setOpenSixthCorntent(!openSixthCorntent);
            }}
          />
          {openSixthCorntent ? (
            <Block style={styles.hiddenContent}>
              <Text
                size={14}
                color={COLORS.GRAY}
                style={styles.hiddenContentText}
              >
                プライベートルーム公開時に使用されるユーザーリストです
                {"\n"}
                トーク時の上部のアイコンから、また話したい人リストに追加できます
                {"\n"}
                追加のタイミングで相手に通知はいきません
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

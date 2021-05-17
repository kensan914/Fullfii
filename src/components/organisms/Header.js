import React, { useState, useEffect } from "react";
import { withNavigation } from "@react-navigation/compat";
import { TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Block, NavBar, theme } from "galio-framework";

import Icon from "src/components/atoms/Icon";
import materialTheme from "src/constants/theme";
import { TalkMenuButton } from "src/components/organisms/Chat";
import Avatar from "src/components/atoms/Avatar";
import { useChatDispatch, useChatState } from "src/contexts/ChatContext";
import { ProfileMenuButton } from "src/components/organisms/ProfileMenuButton";
import { useProfileState } from "src/contexts/ProfileContext";
import ProfileModal from "src/components/molecules/ProfileModal";
import { useAuthState } from "src/contexts/AuthContext";
import { COLORS } from "src/constants/theme";
import { useDomDispatch } from "src/contexts/DomContext";

const { width } = Dimensions.get("window");

import { useNavigation, useRoute } from "@react-navigation/native";

const SettingsButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity
    style={[style]}
    onPress={() => navigation.navigate("Settings")}
  >
    <Icon family="AntDesign" size={32} name="setting" color={COLORS.BROWN} />
    {/* <Block middle style={styles.notify} /> */}
  </TouchableOpacity>
);

const Header = (props) => {
  const {
    back,
    title,
    name,
    white,
    transparent,
    navigation,
    talkTicketKey,
  } = props;
  const profileState = useProfileState();
  const chatDispatch = useChatDispatch();
  const domDispatch = useDomDispatch();
  const authState = useAuthState();
  const chatState = useChatState();
  const route = useRoute();

  const renderRight = () => {
    const routeName = route.name;

    const talkStatusKey =
      talkTicketKey && chatState.talkTicketCollection[talkTicketKey].status.key;
    if (routeName === "Chat" && talkTicketKey)
      return (
        <TalkMenuButton
          disable={["stopping", "approving", "waiting"].includes(talkStatusKey)}
          key="TalkMenuButton"
          navigation={navigation}
          talkTicketKey={talkTicketKey}
        />
      );
    switch (name) {
      case "Profile":
      case "Home":
      case "Rooms":
      case "MyRooms":
      case "WorryList":
      case "Talk":
      case "Notification":
        return (
          <SettingsButton
            key="Settings"
            navigation={navigation}
            isWhite={white}
          />
        );
      default:
        break;
    }
  };

  const renderLeft = (setIsOpenProfile) => {
    if (back) {
      return (
        <TouchableOpacity
          onPress={() => handleLeftPress(setIsOpenProfile)}
          style={styles.backIconContainer}
        >
          <Icon
            family="font-awesome"
            size={30}
            name="angle-left"
            color={COLORS.GRAY}
          />
        </TouchableOpacity>
      );
    } else {
      const routeName = route.name;
      switch (routeName) {
        case "Rooms":
          return (
            <TouchableOpacity
              onPress={() => {
                domDispatch({ type: "SCHEDULE_TASK", taskKey: "refreshRooms" });
              }}
            >
              <Icon
                family="AntDesign"
                size={32}
                name="reload1"
                color={COLORS.BROWN}
              />
            </TouchableOpacity>
          );
      }
    }
  };

  const handleLeftPress = (setIsOpenProfile) => {
    if (back) navigation.goBack();
    // navigation.navigate("Profile", { item: profileState.profile });
    else setIsOpenProfile(true);
  };

  const [currentScreenName, setCurrentScreenName] = useState(name);
  if (currentScreenName !== name) setCurrentScreenName(name);

  // 画面遷移するたびに呼ばれる
  useEffect(() => {
    if (currentScreenName === "Chat") {
      authState.token &&
        chatDispatch({
          type: "READ_BY_ROOM",
          talkTicketKey: route.params.talkTicketKey,
          token: authState.token,
        });
    }
  }, [currentScreenName]);

  const convertNameToTitle = (name) => {
    switch (name) {
      case "Home":
      case "Rooms":
        return "ホーム";
      case "MyRooms":
        return "作成したルーム";
      case "Talk":
        return "トーク";
      case "Notification":
        return "通知";
      case "Profile":
        return "プロフィール";
      case "ProfileEditor":
        return "プロフィール編集";
      case "InputName":
        return "ユーザネーム";
      case "InputGender":
        return "性別";
      case "InputIntroduction":
        return "今悩んでいること";
      case "InputFeature":
        return "特徴";
      case "InputGenreOfWorries":
        return "話したい悩みのジャンル";
      case "InputScaleOfWorries":
        return "話せる悩みの大きさ";
      case "InputPrivacyName":
        return "プライバシーネーム";
      case "InputEmail":
        return "メールアドレス";
      case "InputPassword":
        return "パスワード";
      case "Chat":
        return title;
      case "Plan":
        return "プラン";
      case "Settings":
      case "SettingsInput":
        return "設定";
      case "WorryList":
        return "つぶやき";
      case "Worry":
        return "つぶやき";
      case "WorryPost":
        return "つぶやく";
      case "WorrySelect":
        return "悩み選択";
      case "AccountDelete":
        return "アカウント削除";
      default:
        return name;
    }
  };

  const hasShadow = !["Home", "Profile", "Worry"].includes(name);
  const hasBorder = ["Worry"].includes(name);
  const headerStyles = [
    // hasShadow ? styles.shadow : null,
    transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
    hasBorder ? { borderBottomColor: "silver", borderBottomWidth: 0.5 } : null,
  ];
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  return (
    <Block style={headerStyles}>
      <NavBar
        style={[styles.navbar]}
        transparent={transparent}
        title={convertNameToTitle(name)}
        titleStyle={[styles.title, { color: COLORS.GRAY }]}
        right={renderRight()}
        rightStyle={{ flex: 0.3 }}
        left={renderLeft(setIsOpenProfile)}
        leftStyle={styles.leftStyle}
        leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
        onLeftPress={() => handleLeftPress(setIsOpenProfile)}
      />
      <ProfileModal
        isOpen={isOpenProfile}
        setIsOpen={setIsOpenProfile}
        profile={profileState.profile}
      />
    </Block>
  );
};

export default withNavigation(Header);

const styles = StyleSheet.create({
  button: {},
  title: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  navbar: {
    zIndex: 5,
    height: 54,
    backgroundColor: COLORS.BEIGE,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    backgroundColor: materialTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: "absolute",
    top: 8,
    right: 8,
  },
  header: {
    backgroundColor: theme.COLORS.BEIGE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  leftStyle: {
    flex: 0.3,
  },
  backIconContainer: {
    height: "100%",
    justifyContent: "center",
  },
});

import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Block, NavBar, theme } from "galio-framework";
import { useNavigation, useRoute } from "@react-navigation/native";

import { COLORS } from "src/constants/colors";
import { HEADER_HEIGHT } from "src/constants";
import { RouteName } from "src/types/Types";
import { SettingsHeaderMenu } from "src/navigations/Header/organisms/SettingsHeaderMenu";
import { ChatHeaderMenu } from "src/navigations/Header/organisms/ChatHeaderMenu";
import { BackButton } from "src/components/atoms/BackButton";
import { ReloadHeaderMenu } from "src/navigations/Header/organisms/ReloadHeaderMenu";

type Props = {
  name: RouteName;
  back?: boolean;
  title?: string;
  white?: boolean;
  transparent?: boolean;
  roomId?: string;
  isLeftTitle?: boolean;
  renderRight?: () => React.ReactNode;
};
export const Header: React.FC<Props> = (props) => {
  const {
    back,
    title,
    name,
    white,
    transparent,
    roomId,
    isLeftTitle = false,
    renderRight: renderRightPriority,
  } = props;

  const navigation = useNavigation();
  const route = useRoute();

  const renderRight = () => {
    const routeName = route.name;

    if (typeof renderRightPriority !== "undefined") {
      return (
        <React.Fragment key={routeName}>{renderRightPriority()}</React.Fragment>
      );
    }

    if (routeName === "Chat" && roomId)
      return <ChatHeaderMenu key="Chat" roomId={roomId} />;
    switch (name) {
      case "MeProfile":
      case "Rooms":
      case "MyRooms":
        return <SettingsHeaderMenu key="Settings" />;
      default:
        break;
    }
  };

  const renderLeft = () => {
    if (back) {
      return (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      );
    } else {
      const routeName = route.name;
      switch (routeName) {
        case "Recommend":
          return <ReloadHeaderMenu />;
      }
    }
  };

  const [currentScreenName, setCurrentScreenName] = useState(name);
  if (currentScreenName !== name) setCurrentScreenName(name);

  // 画面遷移するたびに呼ばれる
  useEffect(() => {
    if (currentScreenName === "Chat") {
      //
    }
  }, [currentScreenName]);

  const convertNameToTitle = (name: RouteName): string => {
    switch (name) {
      case "Recommend":
        return "レコメンド";
      case "Rooms":
        return "ルーム";
      case "MyRooms":
        return "トーク";
      case "MeProfile":
      case "Profile":
        return "プロフィール";
      case "ProfileEditor":
        return "プロフィール編集";
      case "InputName":
        return "ユーザネーム";
      case "InputGender":
        return "性別";
      case "InputIsPrivateProfile":
        return "公開範囲";
      case "Chat":
        if (title) return title;
        else return "トーク";
      case "Settings":
        return "設定";
      case "AccountDelete":
        return "アカウント削除";
      case "MessageHistory":
        return "トーク履歴";
      default:
        if (title) return title;
        else return name;
    }
  };

  const hasBorder = ["Worry"].includes(name);
  const headerStyles = [
    transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
    hasBorder ? { borderBottomColor: "silver", borderBottomWidth: 0.5 } : null,
  ];

  return (
    <Block style={headerStyles}>
      <NavBar
        style={[styles.navbar]}
        transparent={transparent}
        title={convertNameToTitle(name)}
        titleStyle={[styles.title, isLeftTitle ? {} : { textAlign: "center" }]}
        right={renderRight()}
        rightStyle={{ flex: isLeftTitle ? 0.6 : 0.3 }}
        left={renderLeft()}
        leftStyle={styles.leftStyle}
        leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
        // onLeftPress={() => handleLeftPress()}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  button: {},
  title: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.GRAY,
  },
  navbar: {
    zIndex: 5,
    height: HEADER_HEIGHT,
    backgroundColor: COLORS.BEIGE,
  },
  leftStyle: {
    flex: 0.3,
  },
});

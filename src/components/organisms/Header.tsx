import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Block, NavBar, theme } from "galio-framework";
import { useNavigation, useRoute } from "@react-navigation/native";

import Icon from "src/components/atoms/Icon";
import materialTheme from "src/constants/theme";
import { ByeByeMenu } from "src/components/organisms/ByeByeMenu";
import { COLORS } from "src/constants/theme";
import { useDomDispatch } from "src/contexts/DomContext";
import { width } from "src/constants";
import { RouteName } from "src/types/Types";

const SettingsButton: React.FC<{ style?: ViewStyle }> = (props) => {
  const { style } = props;

  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[style]}
      onPress={() => navigation.navigate("Settings")}
    >
      <Icon family="AntDesign" size={32} name="setting" color={COLORS.BROWN} />
      {/* <Block middle style={styles.notify} /> */}
    </TouchableOpacity>
  );
};

type Props = {
  name: RouteName;
  back?: boolean;
  title?: string;
  white?: boolean;
  transparent?: boolean;
  roomId?: string;
};
export const Header: React.FC<Props> = (props) => {
  const { back, title, name, white, transparent, roomId } = props;

  const navigation = useNavigation();
  const domDispatch = useDomDispatch();
  const route = useRoute();

  const renderRight = () => {
    const routeName = route.name;

    if (routeName === "Chat" && roomId)
      return <ByeByeMenu key="TalkMenuButton" roomId={roomId} />;
    switch (name) {
      case "Profile":
      case "Rooms":
      case "MyRooms":
        return <SettingsButton key="Settings" />;
      default:
        break;
    }
  };

  const renderLeft = () => {
    if (back) {
      return (
        <TouchableOpacity
          onPress={handleLeftPress}
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

  const handleLeftPress = () => {
    if (back) navigation.goBack();
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
      case "Rooms":
        return "ホーム";
      case "MyRooms":
        return "相談中のルーム";
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
      case "Chat":
        if (title) return title;
        else return "トーク";
      case "Settings":
        return "設定";
      case "AccountDelete":
        return "アカウント削除";
      default:
        return name;
    }
  };

  const hasBorder = ["Worry"].includes(name);
  const headerStyles = [
    // hasShadow ? styles.shadow : null,
    transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
    hasBorder ? { borderBottomColor: "silver", borderBottomWidth: 0.5 } : null,
  ];

  return (
    <Block style={headerStyles}>
      <NavBar
        style={[styles.navbar]}
        transparent={transparent}
        title={convertNameToTitle(name)}
        titleStyle={[styles.title, { color: COLORS.GRAY }]}
        right={renderRight()}
        rightStyle={{ flex: 0.3 }}
        left={renderLeft()}
        leftStyle={styles.leftStyle}
        leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
        onLeftPress={() => handleLeftPress()}
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

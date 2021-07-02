import React, { Dispatch } from "react";
import { Block, Button, Text } from "galio-framework";
import { StyleSheet } from "react-native";

import { COLORS } from "src/constants/theme";
import { Icon } from "src/components/atoms/Icon";
import { ProfileEditor } from "./organisms/ProfileEditor";

type Props = {
  isInit: boolean;
  isShowProfileEditor: boolean;
  setIsShowProfileEditor: Dispatch<boolean>;
  close: boolean;
  onPressCloseProfileEditReminder: () => void;
};
export const ProfileTemplate: React.FC<Props> = (props) => {
  const {
    isInit,
    isShowProfileEditor,
    setIsShowProfileEditor,
    close,
    onPressCloseProfileEditReminder,
  } = props;

  return (
    <Block flex style={styles.container}>
      {!isInit || isShowProfileEditor ? (
        <ProfileEditor />
      ) : (
        <>
          {/* {!close ? (
            <Block center style={styles.profileEditReminderContainer}>
              <ProfileEditReminder
                onPressClose={onPressCloseProfileEditReminder}
              />
            </Block>
          ) : (
            <></>
          )} */}
          <Block center style={styles.iconContainer}>
            <Icon
              name="user"
              family="AntDesign"
              size={80}
              color={COLORS.LIGHT_GRAY}
            />
          </Block>
          <Block center style={styles.textContainer}>
            <Text size={16} color={COLORS.BLACK}>
              プロフィールを作成しましょう
            </Text>
          </Block>
          <Block center>
            <Button
              style={styles.button}
              onPress={() => {
                setIsShowProfileEditor(true);
              }}
            >
              <Text size={20} bold color={COLORS.WHITE}>
                作成
              </Text>
            </Button>
          </Block>
        </>
      )}
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,
  },
  profileEditReminderContainer: {
    marginTop: 24,
  },
  iconContainer: {
    marginTop: "25%",
    marginBottom: 40,
  },
  textContainer: {
    marginBottom: 40,
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
  },
});

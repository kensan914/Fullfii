import React, { Dispatch } from "react";
import { Text, Block } from "galio-framework";
import {
  StyleSheet,
  Keyboard,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "src/constants/colors";
import { width } from "src/constants";
import { Icon } from "src/components/atoms/Icon";
import { RoundButton } from "src/components/atoms/RoundButton";
import { GenderInputButtonList } from "src/components/molecules/GenderInputButtonList";
import { FormattedGenderKey, NotSetGenderKey } from "src/types/Types";
import { MenuModal } from "src/components/molecules/Menu";
import { Job } from "src/types/Types.context";

type Props = {
  username: string;
  setUsername: Dispatch<string>;
  maxUsernameLength: number;
  isFocusInputUsername: boolean;
  setIsFocusInputUsername: Dispatch<boolean>;
  genderKeys: FormattedGenderKey[];
  genderKey: FormattedGenderKey | NotSetGenderKey | undefined;
  setGenderKey: Dispatch<FormattedGenderKey | NotSetGenderKey | undefined>;
  isOpenJobModal: boolean;
  setIsOpenJobModal: Dispatch<boolean>;
  job: Job | undefined;
  jobModalItems: {
    label: string;
    onPress: () => void;
  }[];
  canSignup: boolean;
  onPressNext: () => void;
};
export const SignupTemplate: React.FC<Props> = (props) => {
  const {
    username,
    setUsername,
    maxUsernameLength,
    isFocusInputUsername,
    setIsFocusInputUsername,
    genderKeys,
    genderKey,
    setGenderKey,
    isOpenJobModal,
    setIsOpenJobModal,
    job,
    jobModalItems,
    canSignup,
    onPressNext,
  } = props;

  return (
    <>
      <Block style={styles.container}>
        <TouchableWithoutFeedback
          style={styles.container}
          onPress={() => {
            setIsFocusInputUsername(false);
            Keyboard.dismiss();
          }}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: bottomButtonHeight + 48 }}
          >
            <Text
              center
              size={24}
              bold
              color={COLORS.BLACK}
              style={styles.title}
            >
              ユーザー登録
            </Text>
            <Block row center style={styles.progressContainer}>
              <Block
                style={[
                  styles.progressCircle,
                  { backgroundColor: COLORS.PINK },
                ]}
                center
              >
                <Text size={28} color={COLORS.WHITE}>
                  1
                </Text>
                <Text
                  size={14}
                  color={COLORS.LIGHT_GRAY}
                  style={styles.progressLabelProfile}
                >
                  プロフィール入力
                </Text>
              </Block>
              <Block
                style={[
                  styles.progressBar,
                  { backgroundColor: COLORS.HIGHLIGHT_GRAY },
                ]}
              />
              <Block
                style={[
                  styles.progressCircle,
                  { backgroundColor: COLORS.HIGHLIGHT_GRAY },
                ]}
                center
              >
                <Text size={28} color={COLORS.LIGHT_GRAY}>
                  2
                </Text>
                <Text
                  size={14}
                  color={COLORS.LIGHT_GRAY}
                  style={styles.progressLabelRoom}
                >
                  悩みを投稿する
                </Text>
              </Block>
            </Block>
            <Block center style={styles.progressLabelContainer}>
              {/* <Text
          size={14}
          color={COLORS.LIGHT_GRAY}
          style={styles.progressLabelProfile}
        >
          プロフィール入力
        </Text> */}
              {/* <Text
          size={14}
          color={COLORS.LIGHT_GRAY}
          style={styles.progressLabelRoom}
        >
          悩みを投稿する
        </Text> */}
            </Block>
            <Block style={styles.userNameContainer}>
              <Block row space="between" style={styles.userNameLabels}>
                <Text size={16} color={COLORS.BLACK}>
                  ユーザーネーム
                </Text>
                <Text size={12} color={COLORS.LIGHT_GRAY}>
                  {username.length}/{maxUsernameLength}
                </Text>
              </Block>
              <TextInput
                multiline
                numberOfLines={4}
                editable
                maxLength={maxUsernameLength}
                value={username}
                onChangeText={setUsername}
                returnKeyType="done"
                blurOnSubmit
                // textContentType="username"
                style={[
                  styles.textArea,
                  {
                    borderColor: isFocusInputUsername
                      ? COLORS.BROWN
                      : COLORS.WHITE,
                  },
                ]}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                onFocus={() => {
                  setIsFocusInputUsername(true);
                }}
              />
            </Block>
            <Block style={styles.genderContainer}>
              <Block space="between" style={styles.userNameLabels}>
                <Text size={16} color={COLORS.BLACK}>
                  性別
                </Text>
              </Block>
              <Block row space="between" style={[styles.genderButtons]}>
                <GenderInputButtonList
                  genderKeys={genderKeys}
                  genderKey={genderKey}
                  setGenderKey={setGenderKey}
                  style={{ height: 48 }}
                  renderItem={(label, isSelected) => {
                    return (
                      <Block
                        style={[
                          styles.genderSelectButton,
                          {
                            backgroundColor: isSelected
                              ? COLORS.BROWN
                              : COLORS.WHITE,
                          },
                        ]}
                      >
                        <Text
                          size={16}
                          bold
                          color={isSelected ? COLORS.WHITE : COLORS.BLACK}
                        >
                          {label}
                        </Text>
                      </Block>
                    );
                  }}
                />
              </Block>
            </Block>

            <Block style={styles.jobContainer}>
              <Block space="between" style={styles.userNameLabels}>
                <Text size={16} color={COLORS.BLACK}>
                  職業
                </Text>
              </Block>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setIsOpenJobModal(true);
                }}
              >
                <Block row center space="between" style={styles.selectJob}>
                  <Text size={16} color={COLORS.BLACK}>
                    {job ? job.label : "選択してください"}
                  </Text>
                  <Icon
                    name="chevron-right"
                    family="Feather"
                    size={32}
                    color={COLORS.LIGHT_GRAY}
                  />
                </Block>
              </TouchableOpacity>

              <MenuModal
                isOpen={isOpenJobModal}
                setIsOpen={setIsOpenJobModal}
                items={jobModalItems}
              />
            </Block>
          </ScrollView>
        </TouchableWithoutFeedback>
      </Block>

      <Block center style={styles.footer}>
        <LinearGradient
          colors={[COLORS.BEIGE_TRANSPARENT, COLORS.BEIGE]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Block
            style={{
              height: 32,
              width: width - 14, // スクロールバー分のスペース
            }}
          />
        </LinearGradient>
        <Block style={styles.buttonContainer}>
          <RoundButton
            buttonColor={COLORS.BROWN}
            iconName={""}
            iconFamily={""}
            label="次へ"
            onPress={onPressNext}
            disabled={!canSignup}
          />
          <Block style={styles.buttonAnnotation}>
            <Text size={14} color={COLORS.GRAY}>
              後でプロフィールは修正できます
            </Text>
          </Block>
        </Block>
      </Block>
    </>
  );
};

const bottomButtonHeight = 128;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BEIGE,
    position: "relative",
  },
  title: {
    paddingTop: 72,
  },
  progressContainer: {
    position: "relative",
    marginTop: 32,
  },
  progressCircle: {
    width: 48,
    height: 48,
    borderRadius: 50,
    position: "relative",
    justifyContent: "center",
  },
  progressBar: {
    width: 96,
    height: 4,
  },
  progressLabelContainer: {
    width: width,
    position: "relative",
  },
  progressLabelProfile: {
    position: "absolute",
    marginTop: 8,
    top: 48,
    width: 105,
  },
  progressLabelRoom: {
    position: "absolute",
    marginTop: 8,
    top: 48,
    width: 92,
  },
  userNameContainer: {
    marginTop: 72,
  },
  userNameLabels: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  textArea: {
    alignSelf: "center",
    textAlignVertical: "top",
    height: 40,
    width: width - 40,
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingTop: 9,
  },
  genderContainer: {
    marginTop: 32,
  },
  genderButtons: {
    paddingHorizontal: 20,
  },
  genderSelectButton: {
    width: 104,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  jobContainer: {
    marginTop: 32,
  },
  selectJob: {
    width: width - 64,
    height: 40,
  },
  // buttonContainer: {
  //   width: width - 40,
  //   position: "absolute",
  //   bottom: 48,
  // },
  button: {
    paddingTop: 24,
  },
  footer: {
    bottom: 0,
    width: width,
    alignItems: "center",
    position: "absolute",
  },
  buttonContainer: {
    paddingBottom: 48,
    backgroundColor: COLORS.BEIGE,
    alignItems: "center",
  },
  buttonAnnotation: {
    paddingTop: 24,
  },
});

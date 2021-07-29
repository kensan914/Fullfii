import React, { Dispatch } from "react";
import { Text, Block } from "galio-framework";
import {
  StyleSheet,
  Keyboard,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "src/constants/colors";
import { Icon } from "src/components/atoms/Icon";
import { width } from "src/constants";
import { GenderInputButtonList } from "src/components/molecules/GenderInputButtonList";
import {
  BodyAnimSettings_inputProfile,
  FormattedGenderKey,
  NotSetGenderKey,
} from "src/types/Types";
import { MenuModal } from "src/components/molecules/Menu";
import { Job } from "src/types/Types.context";
import { AnimatedView } from "src/components/templates/intro/organisms/AnimatedView";
import { IntroComment } from "src/components/templates/intro/molecules/IntroComment";

export type SignupProps = {
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
};
type Props = {
  bodyAnimSettings: BodyAnimSettings_inputProfile;
} & SignupProps;
export const InputProfileTemplate: React.FC<Props> = (props) => {
  const {
    bodyAnimSettings,
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
  } = props;

  return (
    <Block flex style={styles.container}>
      {/* <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setIsFocusInputUsername(false);
          Keyboard.dismiss();
        }}
      > */}
      <>
        <AnimatedView {...bodyAnimSettings[0]}>
          <Block style={styles.userNameContainer}>
            <Block row space="between" style={styles.inputTitleContainer}>
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
              onBlur={() => {
                setIsFocusInputUsername(false);
                Keyboard.dismiss();
              }}
            />
          </Block>
          <Block style={styles.genderContainer}>
            <Block space="between" style={styles.inputTitleContainer}>
              <Text size={16} color={COLORS.BLACK}>
                性別
              </Text>
            </Block>
            <Block
              row
              space="between"
              style={[styles.genderInputButtonContainer]}
            >
              <GenderInputButtonList
                genderKeys={genderKeys}
                genderKey={genderKey}
                setGenderKey={setGenderKey}
                style={{ height: 48 }}
                renderItem={(label, isSelected) => {
                  return (
                    <Block
                      // flex
                      style={[
                        styles.genderInputButton,
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
            <Block space="between" style={styles.inputTitleContainer}>
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
        </AnimatedView>

        {/* <AnimatedView {...bodyAnimSettings[1]}>
          <IntroComment style={{ marginTop: 56 }}>
            後でプロフィールは編集できるよ！
          </IntroComment>
        </AnimatedView> */}
      </>
      {/* </TouchableOpacity> */}
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  userNameContainer: {
    // marginTop: 64,
    marginTop: 32,
    paddingHorizontal: 8,
  },
  inputTitleContainer: {
    paddingBottom: 8,
  },
  textArea: {
    alignSelf: "center",
    textAlignVertical: "top",
    height: 40,
    width: "100%",
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    paddingHorizontal: 8,
    // paddingTop: 9,
  },
  genderContainer: {
    marginTop: 32,
    paddingHorizontal: 8,
  },
  genderInputButtonContainer: {},
  genderInputButton: {
    width: width * 0.26,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  jobContainer: {
    marginTop: 32,
    paddingHorizontal: 8,
  },
  selectJob: {
    width: width - 64,
    height: 40,
  },
});

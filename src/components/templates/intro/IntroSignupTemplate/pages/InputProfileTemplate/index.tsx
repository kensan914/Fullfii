import React, { Dispatch, useState } from "react";
import { Text, Block } from "galio-framework";
import {
  StyleSheet,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "src/constants/colors";
import { Icon } from "src/components/atoms/Icon";
import { width, height } from "src/constants";
import { RoundButton } from "src/components/atoms/RoundButton";
import { GenderInputButtonList } from "src/components/molecules/GenderInputButtonList";
import { FormattedGenderKey, NotSetGenderKey } from "src/types/Types";
import { MenuModal } from "src/components/molecules/Menu";
import { Job } from "src/types/Types.context";
import { LECTURE_WOMAN_IMG } from "src/constants/imagePath";


export const InputProfileTemplate: React.FC = () => {
  const maxUsernameLength=60
  const [username, setUsername] = useState("ジントニック")
  const [isFocusInputUsername, setIsFocusInputUsername] = useState(false)
  const [isOpenJobModal, setIsOpenJobModal] = useState(false)
  const job = {label: "看護師"}

  return (
    <Block flex style={styles.container}>
      <Block >
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
              // genderKeys={genderKeys}
              // genderKey={genderKey}
              // setGenderKey={setGenderKey}
              genderKeys={[]}
              genderKey={undefined}
              setGenderKey={"notset"}
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
            items={[]}
            // items={jobModalItems}
          />
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
  tainer: {
    marginTop: 32
  },
  textAreaLabel: {
    marginBottom: 8
  },
  textAreaSubLabel: {
    marginTop: 8
  },
  userNameContainer: {
    marginTop: 64,
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
})
import React from "react";

import { Text, Block } from "galio-framework";
import { StyleSheet, Keyboard, TextInput,TouchableOpacity,} from "react-native";
import { COLORS } from "src/constants/theme";
import { width } from "src/constants";
import IconExtra from "src/components/atoms/Icon";
import { RoundButton } from "src/components/atoms/RoundButton";

export const SignupTemplate: React.FC = (props) => {
  const {userName,
          setUserName,
          pressed,
          setPressed,
          genderButtonColors,
          setGenderButtonColors} = props

  return (
    <Block style={styles.container}>
      <Text center size={24} bold color={COLORS.BLACK} style={styles.title}>ユーザー登録</Text>
      <Block row center style={styles.progressContainer}>
        <Block style={[styles.progressCircle, {backgroundColor: COLORS.PINK}]} center>
          <Text size={28} color={COLORS.WHITE}>1</Text>
        </Block>
        <Block style={[styles.progressBar, {backgroundColor: COLORS.HIGHLIGHT_GRAY}]}/>
        <Block style={[styles.progressCircle, {backgroundColor: COLORS.HIGHLIGHT_GRAY}]} center>
          <Text size={28} color={COLORS.LIGHT_GRAY}>2</Text>
        </Block>
      </Block>
      <Block center style={styles.progressLabelContainer}>
        <Text size={14} color={COLORS.LIGHT_GRAY} style={styles.progressLabelProfile}>プロフィール入力</Text>
        <Text size={14} color={COLORS.LIGHT_GRAY} style={styles.progressLabelRoom}>悩みを投稿する</Text>
      </Block>
      <Block style={styles.userNameContainer}>
        <Block row space="between" style={styles.userNameLabels}>
          <Text size={16} color={COLORS.BLACK}>ユーザーネーム</Text>
          <Text size={12} color={COLORS.LIGHT_GRAY}>2/15</Text>
        </Block>
        <TextInput
          multiline
          numberOfLines={4}
          editable
          maxLength={15}
          value={userName}
          onChangeText={setUserName}
          returnKeyType="done"
          blurOnSubmit
          textContentType="username"
          style={[styles.textArea, {borderColor: pressed ? COLORS.BROWN : COLORS.WHITE}]}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
        />
      </Block>
      <Block style={styles.genderContainer}>
        <Block space="between" style={styles.userNameLabels}>
          <Text size={16} color={COLORS.BLACK}>性別</Text>
        </Block>
        <Block row space="between" style={styles.genderButtons}>
          {["女性", "男性", "内緒"].map((gender) => {
              return(
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.genderSelectButton, {backgroundColor: genderButtonColors[0]}]}
                  onPress={() => {
                    setGenderButtonColors([COLORS.BROWN, COLORS.WHITE])
                  }}
                  >
                    <Text size={16} bold color={genderButtonColors[1]}>{gender}</Text>
                </TouchableOpacity>
              )
            })
          }
        </Block>
      </Block>
      <Block style={styles.jobContainer}>
        <Block space="between" style={styles.userNameLabels}>
          <Text size={16} color={COLORS.BLACK}>職業</Text>
        </Block>
        <TouchableOpacity
          activeOpacity={0.5}
        >
          <Block row center space="between" style={styles.selectJob}>
            <Text size={16} color={COLORS.BLACK}>
              選択してください
            </Text>
            <IconExtra
              name="chevron-right"
              family="Feather"
              size={32}
              color={COLORS.LIGHT_GRAY}
            />
          </Block>
        </TouchableOpacity>
      </Block>
      <Block center style={styles.buttonContainer}>
        <RoundButton
        buttonColor={COLORS.BROWN}
        iconName={""}
        iconFamily={""}
        label="次へ"
        onPress={()=>{console.log("k")}}
        isLoading={false}
        disabled/>
        <Block style={styles.button}>
          <Text size={14} color={COLORS.GRAY}>後でプロフィールは修正できます</Text>
        </Block>
      </Block>
    </Block>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BEIGE,
    position: "relative"
  },
  title: {
    paddingTop: 72
  },
  progressContainer: {
    position: "relative",
    marginTop: 32
  },
  progressCircle: {
    width: 48,
    height: 48,
    borderRadius: 50,
    justifyContent: "center"
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
    left: 72
  },
  progressLabelRoom: {
    position: "absolute",
    marginTop: 8,
    right: 72
  },
  userNameContainer: {
    marginTop: 72
  },
  userNameLabels: {
    paddingHorizontal: 20,
    paddingBottom: 8
  },
  textArea: {
    alignSelf: "center",
    height: 40,
    width: width - 40,
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingTop: 9
  },
  genderContainer: {
    marginTop: 32
  },
  genderButtons: {
    paddingHorizontal: 20,
  },
  genderSelectButton: {
    width: 104,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8
  },
  jobContainer: {
    marginTop: 32
  },
  selectJob: {
    width: width - 64,
    height: 40,
  },
  buttonContainer: {
    width: width-40,
    position: "absolute",
    bottom:48
  },
  button: {
    paddingTop: 24
  }
});
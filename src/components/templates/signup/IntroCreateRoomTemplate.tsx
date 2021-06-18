import React from "react";

import { Text, Block } from "galio-framework";
import { StyleSheet, Keyboard, TextInput,TouchableOpacity, ImageBackground,
} from "react-native";

import {InformationModal} from "src/components/templates/signup/organisms/InformationModal"
import { COLORS } from "src/constants/theme";
import { width } from "src/constants";
import IconExtra from "src/components/atoms/Icon";
import { RoundButton } from "src/components/atoms/RoundButton";
import { MAN_AND_WOMAN_IMG, MEN_IMG } from "src/constants/imagePath";


export const IntroCreateRoomTemplate: React.FC = (props) => {
  const {
    content,
    setContent,
    pressed,
    setPressed,
    openInformationModal,
    setOpenInformationModal
  } = props
  return (
    <>
    <Block style={styles.container}>
        <TouchableOpacity style={styles.goBack} onPress={() => console.log("k")}>
          <Block row center>
            <IconExtra
              name="chevron-left"
              family="Feather"
              size={32}
              color={COLORS.BROWN}
            />
            <Text size={16} bold color={COLORS.BROWN}>
              戻る
            </Text>
          </Block>
        </TouchableOpacity>
        <TouchableOpacity style={styles.goNext} onPress={() => console.log("k")}>
          <Block row center>
            <Text size={16} bold color={COLORS.BROWN}>
              後で作成する
            </Text>
            <IconExtra
              name="chevron-right"
              family="Feather"
              size={32}
              color={COLORS.BROWN}
            />
          </Block>
        </TouchableOpacity>
      <Text center size={24} bold color={COLORS.BLACK} style={styles.title}>悩み相談ルーム作成</Text>
      <Block row center style={styles.progressContainer}>
        <Block style={[styles.progressCircle, {backgroundColor: COLORS.PINK}]} center>
          <Text size={28} color={COLORS.WHITE}>1</Text>
        </Block>
        <Block style={[styles.progressBar, {backgroundColor: COLORS.PINK}]}/>
        <Block style={[styles.progressCircle, {backgroundColor: COLORS.PINK}]} center>
          <Text size={28} color={COLORS.WHITE}>2</Text>
        </Block>
      </Block>
      <Block center style={styles.progressLabelContainer}>
        <Text size={14} color={COLORS.LIGHT_GRAY} style={styles.progressLabelProfile}>プロフィール入力</Text>
        <Text size={14} color={COLORS.LIGHT_GRAY} style={styles.progressLabelRoom}>悩みを投稿する</Text>
      </Block>
      <Block style={styles.informationContainer}>
        <TouchableOpacity onPress={()=>{setOpenInformationModal(true)}}>
          <Text size={14} bold color={COLORS.BROWN}>悩み相談ルームって何？</Text>
        </TouchableOpacity>
      </Block>
      <Block style={styles.textInputContainer}>
        <Block row space="between" style={styles.textInputLabels}>
          <Text size={16} color={COLORS.BLACK}>話したい悩みについて</Text>
          <Text size={12} color={COLORS.LIGHT_GRAY}>20/60</Text>
        </Block>
        <TextInput
          multiline
          numberOfLines={4}
          editable
          maxLength={60}
          value={content}
          onChangeText={setContent}
          returnKeyType="done"
          blurOnSubmit
          textContentType="username"
          style={[styles.textArea, {borderColor: pressed ? COLORS.BROWN : COLORS.WHITE}]}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
        />
        <Block space="between" style={styles.textInputSubLabel}>
          <Text size={12} color={COLORS.LIGHT_GRAY}>誰かを傷つけるような表現は避けましょう</Text>
        </Block>
      </Block>
      <Block style={styles.disclosureRangeContainer}>
        <Block row space="between" style={styles.textInputLabels}>
          <Text size={16} color={COLORS.BLACK}>作成した悩みの公開範囲</Text>
        </Block>
        <Block row space="between" style={styles.circleButtons}>
          <TouchableOpacity
            style={[
              styles.circleButton,
              // isExcludeDifferentGender !== null && !isExcludeDifferentGender
              //   ? { borderColor: COLORS.GREEN }
              //   : { borderColor: "#f4f8f7" },
            ]}
            onPress={() => {
              // setIsExcludeDifferentGender(false);
              console.log("f")
            }}
          >
            <ImageBackground
              source={MAN_AND_WOMAN_IMG}
              style={styles.disclosureRangeImage}
            >
              <Block style={styles.disclosureRangeText}>
                <Text size={10} bold>
                  異性にも表示
                </Text>
              </Block>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.circleButton,
              // isExcludeDifferentGender !== null && isExcludeDifferentGender
              //   ? { borderColor: COLORS.GREEN }
              //   : { borderColor: "#f4f8f7" },
            ]}
            onPress={() => {
              // if (!canSetIsExcludeDifferentGender) {
              //   Alert.alert(
              //     ...ALERT_MESSAGES["CANNOT_SET_IS_EXCLUDE_DEFERENT_GENDER"]
              //   );
              // } else {
              //   setIsExcludeDifferentGender(true);
              // }
              console.log("d")
            }}
          >
            <ImageBackground
              source={MEN_IMG}
              style={styles.disclosureRangeImage}
            >
              <Block style={styles.disclosureRangeText}>
                <Text size={10} bold>
                  同性のみ表示
                </Text>
              </Block>
            </ImageBackground>
          </TouchableOpacity>
        </Block>
      </Block>
      <Block center style={styles.buttonContainer}>
        <RoundButton
        buttonColor={COLORS.BROWN}
        iconName={""}
        iconFamily={""}
        label="作成して始める"
        onPress={()=>{console.log("k")}}
        isLoading={false}
        disabled/>
        <Block style={styles.button}>
          <Text size={14} color={COLORS.GRAY}>後で作成したルームは修正できます</Text>
        </Block>
      </Block>
    </Block>
    <InformationModal openInformationModal={openInformationModal} setOpenInformationModal={setOpenInformationModal}/>
    </>
  );;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BEIGE,
    position: "relative"
  },
  goBack: {
    position: "absolute",
    left: 20,
    top: 24,
    zIndex: 2
  },
  goNext: {
    position: "absolute",
    right: 20,
    top: 24,
    zIndex: 2
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
    marginTop: 56
  },
  informationContainer: {
    marginTop: 76,
    marginRight: 20,
    marginLeft: "auto"
  },
  textInputContainer: {
    marginTop: 32
  },
  textInputLabels: {
    paddingHorizontal: 20,
    paddingBottom: 8
  },
  textArea: {
    alignSelf: "center",
    height: 80,
    width: width - 40,
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingTop: 9
  },
  textInputSubLabel: {
    marginTop: 8,
    paddingHorizontal: 20
  },
  disclosureRangeContainer: {
    marginTop: 32
  },
  circleButtons: {
    paddingHorizontal: 64,
    marginBottom: 32,
    marginTop: 8
  },
  circleButton: {
    height: 84,
    width: 84,
    backgroundColor: "#f4f8f7",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 8,
  },
  disclosureRangeImage: {
    height: 80,
    width: 80,
    alignItems: "center",
  },
  disclosureRangeText: {
    paddingTop: 12,
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
import React, { Dispatch } from "react";
import { Text, Block } from "galio-framework";
import {
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "src/constants/colors";
import { width, height } from "src/constants";
import { BodyAnimSettings_inputRoomName } from "src/types/Types";
import { AnimatedView } from "src/components/templates/intro/organisms/AnimatedView";
import { IntroComment } from "src/components/templates/intro/molecules/IntroComment";

export type CreateRoomProps = {
  roomName: string;
  setRoomName: Dispatch<string>;
  maxRoomNameLength: number;
  isFocusInputRoomName: boolean;
  setIsFocusInputRoomName: Dispatch<boolean>;
};
type Props = {
  bodyAnimSettings: BodyAnimSettings_inputRoomName;
} & CreateRoomProps;
export const InputRoomNameTemplate: React.FC<Props> = (props) => {
  const {
    bodyAnimSettings,
    roomName,
    setRoomName,
    maxRoomNameLength,
    isFocusInputRoomName,
    setIsFocusInputRoomName,
  } = props;

  return (
    <Block flex style={styles.container}>
      {/* <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setIsFocusInputRoomName(false);
          Keyboard.dismiss();
        }}
      > */}
      <>
        <Block style={styles.textAreaContainer}>
          <AnimatedView {...bodyAnimSettings[0]}>
            <Block bottom style={styles.textAreaLabel}>
              <Text size={12} color={COLORS.LIGHT_GRAY}>
                {roomName.length}/{maxRoomNameLength}
              </Text>
            </Block>
            <TextInput
              multiline
              numberOfLines={4}
              editable
              placeholder="恋愛相談に乗って欲しい、ただ話しを聞いて欲しい、どんな悩みでも大丈夫です。"
              maxLength={maxRoomNameLength}
              value={roomName}
              onChangeText={setRoomName}
              returnKeyType="done"
              blurOnSubmit
              style={[
                styles.textArea,
                {
                  borderColor: isFocusInputRoomName
                    ? COLORS.BROWN
                    : COLORS.WHITE,
                },
              ]}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              onFocus={() => {
                setIsFocusInputRoomName(true);
              }}
              onBlur={() => {
                setIsFocusInputRoomName(false);
                Keyboard.dismiss();
              }}
            />
            <Block style={styles.textAreaSubLabel}>
              <Text size={12} color={COLORS.LIGHT_GRAY}>
                誰かを傷つけるような表現は避けましょう
              </Text>
            </Block>
          </AnimatedView>
        </Block>
        <AnimatedView {...bodyAnimSettings[1]}>
          <IntroComment style={{ marginTop: height * 0.1 }}>
            後でルームの詳細は編集できるよ！
          </IntroComment>
        </AnimatedView>
      </>
      {/* </TouchableOpacity> */}
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  textArea: {
    alignSelf: "center",
    textAlignVertical: "top",
    height: 80,
    width: width - 32,
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingTop: 9,
  },
  textAreaContainer: {
    marginTop: 32,
  },
  textAreaLabel: {
    marginBottom: 8,
  },
  textAreaSubLabel: {
    marginTop: 8,
  },
});

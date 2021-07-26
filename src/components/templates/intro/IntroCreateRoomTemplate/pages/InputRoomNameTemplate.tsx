import React, {useState} from "react";
import { Text, Button, Block } from "galio-framework";
import {
  StyleSheet,
  Image,
  TextInput,
  Keyboard,
} from "react-native";
import { COLORS } from "src/constants/colors";
import { width, height } from "src/constants";
import { LECTURE_WOMAN_IMG } from "src/constants/imagePath";


export const InputRoomNameTemplate: React.FC = () => {
  const [text, setText] = useState(false)
  const [string, setString] = useState("")
  return (
    <Block flex style={styles.container}>
      <Block flex={0.25} style={styles.textContainer}>
        <Block bottom style={styles.textAreaLabel}>
          <Text size={12} color={COLORS.LIGHT_GRAY}>
            12/60
          </Text>
        </Block>
        <TextInput
          multiline
          numberOfLines={4}
          editable
          placeholder="恋愛相談に乗って欲しい、ただ話しを聞いて欲しい、どんな悩みでも大丈夫です。"
          maxLength={60}
          value={"k"}
          onChangeText={setString}
          returnKeyType="done"
          blurOnSubmit
          // textContentType="username"
          style={[
            styles.textArea,
            {
              borderColor: text
                ? COLORS.BROWN
                : COLORS.WHITE,
            },
          ]}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          onFocus={() => {
            setText(true);
          }}
        />
        <Block style={styles.textAreaSubLabel}>
          <Text size={12} color={COLORS.LIGHT_GRAY}>
          誰かを傷つけるような表現は避けましょう
          </Text>
        </Block>
      </Block>
      <Block flex={0.75} row style={styles.leftMessageContainer}>
        <Image
          style={styles.avater}
          source={ LECTURE_WOMAN_IMG }
        />
        <Block>
          <Block style={styles.leftMessage}>
            <Text size={14} color={COLORS.BLACK} numberOfLines={2} ellipsizeMode="tail">後でルームの詳細は編集できるよ！</Text>
          </Block>
          <Text size={12} color={COLORS.LIGHT_GRAY} style={styles.textLineHeight}>21:23</Text>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    height: height-120-104-48
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
  textContainer: {
    marginTop: 32
  },
  textAreaLabel: {
    marginBottom: 8
  },
  textAreaSubLabel: {
    marginTop: 8
  }
})
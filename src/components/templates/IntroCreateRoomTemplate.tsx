import React, { Dispatch } from "react";
import { Block, Text } from "galio-framework";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "src/constants/theme";
import Icon from "src/components/atoms/Icon";
import { RoundButton } from "src/components/atoms/RoundButton";
import { width } from "src/constants";

type Props = {
  roomName: string;
  setRoomName: Dispatch<string>;
  maxRoomNameLength: number;
  canPost: boolean;
  isLoadingPostRoom: boolean;
  skipCreateRoomWhenIntro: () => void;
  createRoomWhenIntro: () => void;
};
export const IntroCreateRoomTemplate: React.FC<Props> = (props) => {
  const {
    roomName,
    setRoomName,
    maxRoomNameLength,
    canPost,
    isLoadingPostRoom,
    skipCreateRoomWhenIntro,
    createRoomWhenIntro,
  } = props;

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Block flex={0.1} style={styles.header}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={skipCreateRoomWhenIntro}
        >
          <Text size={20} bold color="#D29D89">
            {"スキップ"}
          </Text>
          <Icon
            family="font-awesome"
            size={30}
            name="angle-right"
            color={"#D29D89"}
            style={{ marginLeft: 14.32, marginRight: 10 }}
          />
        </TouchableOpacity>
      </Block>

      <Block flex={0.7} style={styles.body}>
        <Block flex={0.3}>
          <Text size={32} bold color="#333333" style={styles.title}>
            話したい{"\n"}悩みはなんですか？
          </Text>
        </Block>

        <KeyboardAvoidingView
          style={{ flex: 0.7 }}
          behavior="position"
          keyboardVerticalOffset={0}
        >
          <Block style={styles.roomNameInputContainer}>
            <Block row space="between" style={styles.inputSubTitle}>
              <Block>
                <Text size={12} color={COLORS.LIGHT_GRAY}>
                  ルーム名
                </Text>
              </Block>
              <Block>
                <Text size={12} color={COLORS.LIGHT_GRAY}>
                  {roomName === null ? 0 : roomName.length}/{maxRoomNameLength}
                </Text>
              </Block>
            </Block>
            <TextInput
              multiline
              numberOfLines={4}
              editable
              placeholder="恋愛相談に乗って欲しい、ただ話しを聞いて欲しい、どんな悩みでも大丈夫です。"
              maxLength={maxRoomNameLength}
              value={roomName === null ? "" : roomName}
              onChangeText={setRoomName}
              returnKeyType="done"
              blurOnSubmit
              style={styles.textArea}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
          </Block>
        </KeyboardAvoidingView>
      </Block>

      <Block flex={0.2} style={styles.footer}>
        <RoundButton
          label="悩み相談のルームを作成する"
          style={styles.createButton}
          isLoading={isLoadingPostRoom}
          disabled={!canPost}
          onPress={createRoomWhenIntro}
        />
        <Text size={14} color={COLORS.GRAY} style={styles.annotation}>
          作成したルームは後で修正できます
        </Text>
      </Block>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BEIGE,
    paddingHorizontal: 20,
    paddingTop: 34,
  },
  header: {
    alignItems: "flex-end",
  },
  body: {
    alignItems: "center",
  },
  footer: {
    justifyContent: "flex-end",
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
  },
  inputSubTitle: {
    marginBottom: 32,
    marginRight: 16,
  },
  textArea: {
    alignSelf: "center",
    height: 96,
    width: width * 0.8,
    borderColor: COLORS.LIGHT_GRAY,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.WHITE,
    marginBottom: 40,
    marginHorizontal: 16,
  },
  roomNameInputContainer: {
    justifyContent: "center",
  },
  createButton: {
    marginBottom: 24,
    height: 64,
  },
  annotation: {
    textAlign: "center",
    marginBottom: 97,
  },
});

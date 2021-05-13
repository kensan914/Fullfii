import React from "react";
import { Block, Button, Text } from "galio-framework";
import {
  StyleSheet,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
} from "react-native";
import Modal from "react-native-modal";

import { COLORS } from "src/constants/theme";
import IconExtra from "src/components/atoms/Icon";
import { DISCLOSURE_RANGE_IMAGE } from "src/constants/imagePath";
import { getPermissionAsync, pickImage } from "src/utils/imagePicker";

const { width } = Dimensions.get("screen");

const CreateRoomModal = (props) => {
  const {
    openFirst,
    setOpenFirst,
    openSecond,
    setOpenSecond,
    topic,
    setTopic,
    roomImage,
    setRoomImage,
  } = props;

  const [
    isExcludeDifferentGender,
    setIsExcludeDifferentGender,
  ] = React.useState(null);

  return (
    <Modal
      isVisible={openFirst}
      deviceWidth={width}
      onBackdropPress={() => {
        setOpenFirst(false);
      }}
      style={styles.firstModal}
    >
      <Block column style={styles.firstModalContent}>
        <Block row>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              setOpenFirst(false);
            }}
          >
            <IconExtra
              name="close"
              family="Ionicons"
              size={32}
              color={COLORS.HILIGHT_GRAY}
            />
          </TouchableOpacity>
        </Block>
        <TouchableOpacity
          style={styles.addMore}
          onPress={() => {
            setOpenSecond(true);
          }}
        >
          <Block column>
            <Block row center>
              <IconExtra
                name="plus"
                family="AntDesign"
                size={16}
                color={COLORS.BROWN}
              />
              <Block>
                <Text size={14} color={COLORS.BROWN} bold>
                  悩みを追加する
                </Text>
              </Block>
            </Block>
          </Block>
        </TouchableOpacity>
        {topic ? (
          <Block row center style={styles.checkRoomTopic}>
            <IconExtra
              name="check-circle"
              family="Feather"
              size={14}
              color={COLORS.GREEN}
            />
            <Block>
              <Text size={12} color={COLORS.LIGHT_GRAY} bold>
                ルーム名
              </Text>
            </Block>
          </Block>
        ) : null}
        {roomImage ? (
          <Block row center style={styles.checkRoomImage}>
            <IconExtra
              name="check-circle"
              family="Feather"
              size={14}
              color={COLORS.GREEN}
            />
            <Block>
              <Text size={12} color={COLORS.LIGHT_GRAY} bold>
                ルーム画像
              </Text>
            </Block>
          </Block>
        ) : null}
        <Block style={styles.choiceRangeTitle}>
          <Text size={12} color={COLORS.GRAY}>
            異性への表示
          </Text>
        </Block>
        <Block row space="between" style={styles.circleButtons}>
          <TouchableOpacity
            style={[
              styles.circleButton,
              isExcludeDifferentGender !== null && !isExcludeDifferentGender
                ? { borderColor: COLORS.GREEN }
                : { borderColor: "#f4f8f7" },
            ]}
            onPress={() => {
              setIsExcludeDifferentGender(false);
            }}
          >
            <ImageBackground
              source={DISCLOSURE_RANGE_IMAGE.a}
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
              isExcludeDifferentGender !== null && isExcludeDifferentGender
                ? { borderColor: COLORS.GREEN }
                : { borderColor: "#f4f8f7" },
            ]}
            onPress={() => {
              setIsExcludeDifferentGender(true);
            }}
          >
            <ImageBackground
              source={DISCLOSURE_RANGE_IMAGE.b}
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
        <Block center style={styles.submitButtonContainer}>
          <Button
            style={styles.submitButton}
            color={COLORS.BROWN}
            shadowless
            onPress={() => {
              alert(`悩みは${topic}です`);
            }}
          >
            <Block row center space="between" style={styles.submitButtonInner}>
              <IconExtra
                name="pluscircleo"
                family="AntDesign"
                size={40}
                color={COLORS.WHITE}
                style={styles.submitButtonIcon}
              />
              <Block style={styles.submitButtonText}>
                <Text size={20} color={COLORS.WHITE} bold>
                  ルームを作成する
                </Text>
              </Block>
            </Block>
          </Button>
        </Block>
      </Block>

      <Modal
        isVisible={openSecond}
        deviceWidth={width}
        onBackdropPress={() => {
          setOpenSecond(false);
        }}
      >
        <Block style={styles.secondModal}>
          <Block column style={styles.secondModalContent}>
            <KeyboardAvoidingView behavior="padding" style={{}}>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => {
                  setOpenSecond(false);
                }}
              >
                <IconExtra
                  name="close"
                  family="Ionicons"
                  size={32}
                  color={COLORS.HILIGHT_GRAY}
                />
              </TouchableOpacity>
              <Block row space="between" style={styles.subTitleTextInput}>
                <Block>
                  <Text size={12} color={COLORS.GRAY}>
                    ルーム名
                  </Text>
                </Block>
                <Block>
                  <Text size={12} color={COLORS.GRAY}>
                    0/60
                  </Text>
                </Block>
              </Block>
              <TextInput
                multiline
                numberOfLines={4}
                editable
                placeholder="恋愛相談に乗って欲しい、ただ話しを聞いて欲しい、どんな悩みでも大丈夫です。"
                maxLength={60}
                value={topic}
                onChangeText={setTopic}
                returnKeyType="done"
                blurOnSubmit
                style={styles.textArea}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
              <Block style={styles.subTitleTextInput}>
                <Text size={12} color={COLORS.GRAY}>
                  ルーム画像
                </Text>
              </Block>
              <Block center>
                <TouchableOpacity
                  activeOpacity={0.7}
                  underlayColor="#DDDDDD"
                  style={styles.roomImage}
                >
                  <IconExtra
                    name="image"
                    family="Feather"
                    size={48}
                    color={COLORS.HILIGHT_GRAY}
                  />
                </TouchableOpacity>
              </Block>
              <Block center>
                <Button
                  style={styles.addTopicButton}
                  color={COLORS.BROWN}
                  shadowless
                  onPress={() => {
                    setOpenSecond(false);
                  }}
                >
                  <Text size={20} color={COLORS.WHITE} bold>
                    追加する
                  </Text>
                </Button>
              </Block>
            </KeyboardAvoidingView>
          </Block>
        </Block>
      </Modal>
    </Modal>
  );
};
const styles = StyleSheet.create({
  firstModal: {
    justifyContent: "flex-end",
    marginHorizontal: 0,
    marginBottom: 0,
  },
  firstModalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 16,
    position: "relative",
  },
  closeIcon: {
    marginBottom: 32,
    width: 32,
  },
  addMore: {
    position: "absolute",
    top: 24,
    right: 16,
  },
  checkRoomTopic: {
    position: "absolute",
    top: 48,
    right: 16,
  },
  checkRoomImage: {
    position: "absolute",
    top: 64,
    right: 16,
  },
  choiceRangeTitle: {
    marginBottom: 24,
  },
  circleButtons: {
    paddingHorizontal: 64,
    marginBottom: 24,
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
  submitButtonContainer: {
    marginBottom: 16,
  },
  submitButtonInner: {
    width: 335,
    height: 48,
    borderRadius: 30,
  },
  submitButton: {
    width: 335,
    height: 48,
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
  submitButtonIcon: {
    paddingLeft: 64,
  },
  submitButtonText: {
    paddingRight: 64,
  },
  secondModal: {
    width: width - 40,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  secondModalContent: {
    position: "relative",
  },
  subTitleTextInput: {
    marginBottom: 16,
  },
  textArea: {
    width: width * 0.8,
    alignSelf: "center",
    height: 70,
    borderColor: "silver",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.WHITE,
    marginBottom: 24,
  },
  roomImageContainer: {},
  roomImage: {
    marginBottom: 32,
    height: 80,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 1,
  },
  addTopicButton: {
    width: 303,
    height: 48,
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

export default CreateRoomModal;

import React, { Dispatch, useEffect, useRef, useState } from "react";
import { Block, Button, Text } from "galio-framework";
import {
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import Modal from "react-native-modal";

import { COLORS } from "src/constants/theme";
import IconExtra from "src/components/atoms/Icon";
import { MAN_AND_WOMAN_IMG, MEN_IMG } from "src/constants/imagePath";
import { getPermissionAsync, pickImage } from "src/utils/imagePicker";
import { width } from "src/constants";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import {
  useRequestPatchRoom,
  useRequestPostRoom,
} from "src/hooks/requests/useRequestRooms";
import { TalkingRoom } from "src/types/Types.context";
import { showToast } from "src/utils/customModules";
import { ALERT_MESSAGES, TOAST_SETTINGS } from "src/constants/alertMessages";
import { useProfileState } from "src/contexts/ProfileContext";
import { formatGender } from "src/utils";

type PropsDependsOnMode =
  | {
      mode: "CREATE";
      setIsOpenRoomCreatedModal: Dispatch<boolean>;
    }
  | {
      mode: "FIX";
      talkingRoom: TalkingRoom;
    };
type Props = {
  isOpenRoomEditorModal: boolean;
  setIsOpenRoomEditorModal: Dispatch<boolean>;
  propsDependsOnMode: PropsDependsOnMode;
};
const RoomEditorModal: React.FC<Props> = (props) => {
  const {
    isOpenRoomEditorModal,
    setIsOpenRoomEditorModal,
    propsDependsOnMode,
  } = props;

  const [isOpenOptionModal, setIsOpenOptionModal] = useState(false);
  const profileState = useProfileState();

  // ====== init post or patch data ======
  const [initRoomName] = useState(
    propsDependsOnMode.mode === "CREATE"
      ? null
      : propsDependsOnMode.talkingRoom.name
  );
  const [initDraftRoomName] = useState(null);
  const [initRoomImage] = useState(null);
  const [initDraftRoomImage] = useState(null);
  const [initIsExcludeDifferentGender] = useState(
    propsDependsOnMode.mode === "CREATE"
      ? null
      : propsDependsOnMode.talkingRoom.isExcludeDifferentGender
  );
  // ====== init post or patch data ======

  // ====== post or patch data ======
  const [roomName, setRoomName] = useState<string | null>(initRoomName);
  const [draftRoomName, setDraftRoomName] = useState<string | null>(
    initDraftRoomName
  );
  const [roomImage, setRoomImage] = useState<ImageInfo | null>(initRoomImage);
  const [draftRoomImage, setDraftRoomImage] = useState<ImageInfo | null>(
    initDraftRoomImage
  );
  const [isExcludeDifferentGender, setIsExcludeDifferentGender] = useState<
    boolean | null
  >(initIsExcludeDifferentGender);
  // ====== post or patch data ======

  const maxTopicLength = 60;

  /** この値がtrueの状態でモーダルを閉じるとルーム作成モーダルが表示される(作成時のみ) */
  const willOpenRoomCreatedModalRef = useRef(false);

  // canPostは作成時のみ。修正時は常にpatchできる
  const canPost =
    propsDependsOnMode.mode === "CREATE"
      ? isExcludeDifferentGender !== null
      : true;

  const resetDraftOption = () => {
    setDraftRoomName(initDraftRoomName);
    setDraftRoomImage(initDraftRoomImage);
  };
  /** ルーム作成後、全てのstateをリセット */
  const resetState = () => {
    resetDraftOption();
    setRoomName(initRoomName);
    setRoomImage(initRoomImage);
    setIsExcludeDifferentGender(initIsExcludeDifferentGender);
  };
  const addRoomOption = () => {
    resetDraftOption();
    setRoomName(draftRoomName);
    setRoomImage(draftRoomImage);
  };
  const openOptionModal = () => {
    setDraftRoomName(roomName);
    setDraftRoomImage(roomImage);
    setIsOpenOptionModal(true);
  };

  // ルーム作成用
  const { requestPostRoom, isLoadingPostRoom } = useRequestPostRoom(
    roomName,
    isExcludeDifferentGender,
    roomImage,
    () => {
      // then時、実行
      if (willOpenRoomCreatedModalRef) {
        willOpenRoomCreatedModalRef.current = true;
      }
      resetState();
      setIsOpenRoomEditorModal(false);
    }
  );

  // ルーム修正用
  const { requestPatchRoom, isLoadingPatchRoom } = useRequestPatchRoom(
    propsDependsOnMode.mode === "FIX" ? propsDependsOnMode.talkingRoom.id : "",
    roomName,
    isExcludeDifferentGender,
    roomImage,
    () => {
      // then時、実行
      resetState();
      setIsOpenRoomEditorModal(false);
      showToast(TOAST_SETTINGS["FIX_ROOM"]);
    }
  );

  const renderRoomImage = () => {
    const emptyRoomImage = (
      <IconExtra
        name="image"
        family="Feather"
        size={48}
        color={COLORS.HIGHLIGHT_GRAY}
      />
    );

    if (propsDependsOnMode.mode === "FIX") {
      if (draftRoomImage !== null) {
        return <Image style={styles.roomImage} source={draftRoomImage} />;
      } else {
        if (propsDependsOnMode.talkingRoom.image) {
          return (
            <Image
              style={styles.roomImage}
              source={{ uri: propsDependsOnMode.talkingRoom.image }}
            />
          );
        } else {
          return emptyRoomImage;
        }
      }
    } else if (propsDependsOnMode.mode === "CREATE") {
      if (draftRoomImage !== null) {
        return <Image style={styles.roomImage} source={draftRoomImage} />;
      } else {
        return emptyRoomImage;
      }
    }
    return null;
  };

  const formattedGender = formatGender(
    profileState.profile.gender,
    profileState.profile.isSecretGender
  );
  const canSetIsExcludeDifferentGender = !(
    formattedGender.isNotSet || formattedGender.key === "secret"
  );

  return (
    <Modal
      isVisible={isOpenRoomEditorModal}
      deviceWidth={width}
      onBackdropPress={() => {
        setIsOpenRoomEditorModal(false);
      }}
      style={styles.firstModal}
      onModalHide={() => {
        if (willOpenRoomCreatedModalRef.current) {
          propsDependsOnMode.mode === "CREATE" &&
            propsDependsOnMode.setIsOpenRoomCreatedModal(true);
          willOpenRoomCreatedModalRef.current = false;
        }
      }}
      onModalWillShow={() => {
        // 男性でisExcludeDifferentGender設定 => 内緒にして再度開くとisExcludeDifferentGenderがtrueでPOST可能になってしまうため対処
        if (!canSetIsExcludeDifferentGender && isExcludeDifferentGender) {
          setIsExcludeDifferentGender(null);
        }
      }}
    >
      <Block column style={styles.firstModalContent}>
        <Block row>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              setIsOpenRoomEditorModal(false);
            }}
          >
            <IconExtra
              name="close"
              family="Ionicons"
              size={32}
              color={COLORS.HIGHLIGHT_GRAY}
            />
          </TouchableOpacity>
        </Block>
        <TouchableOpacity
          style={styles.addMore}
          onPress={() => {
            openOptionModal();
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
        {roomName ? (
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
        {roomImage ||
        (propsDependsOnMode.mode === "FIX" &&
          propsDependsOnMode.talkingRoom.image) ? (
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
              isExcludeDifferentGender !== null && isExcludeDifferentGender
                ? { borderColor: COLORS.GREEN }
                : { borderColor: "#f4f8f7" },
            ]}
            onPress={() => {
              if (!canSetIsExcludeDifferentGender) {
                Alert.alert(
                  ...ALERT_MESSAGES["CANNOT_SET_IS_EXCLUDE_DEFERENT_GENDER"]
                );
              } else {
                setIsExcludeDifferentGender(true);
              }
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
        <Block center style={styles.submitButtonContainer}>
          <Button
            shadowless
            onPress={() => {
              if (propsDependsOnMode.mode === "CREATE") {
                requestPostRoom();
              } else if (propsDependsOnMode.mode === "FIX") {
                requestPatchRoom();
              }
            }}
            color={canPost ? COLORS.BROWN : "lightgray"}
            style={[
              styles.submitButton,
              canPost
                ? {
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowColor: "#000",
                    shadowOpacity: 0.4,
                    shadowRadius: 4,
                  }
                : {},
            ]}
            disabled={!canPost}
            loading={
              propsDependsOnMode.mode === "CREATE"
                ? isLoadingPostRoom
                : isLoadingPatchRoom
            }
          >
            <Block row center space="between" style={styles.submitButtonInner}>
              <IconExtra
                name={
                  propsDependsOnMode.mode === "CREATE" ? "pluscircleo" : "save"
                }
                family="AntDesign"
                size={40}
                color={COLORS.WHITE}
                style={styles.submitButtonIcon}
              />
              <Block style={styles.submitButtonText}>
                <Text size={20} color={COLORS.WHITE} bold>
                  {propsDependsOnMode.mode === "CREATE"
                    ? "ルームを作成する"
                    : "修正を反映する"}
                </Text>
              </Block>
            </Block>
          </Button>
        </Block>
      </Block>

      <Modal
        isVisible={isOpenOptionModal}
        deviceWidth={width}
        // onBackdropPress={() => {
        //   // setIsOpenOptionModal(false);
        // }}
      >
        <Block style={styles.secondModal}>
          <Block column style={styles.secondModalContent}>
            <KeyboardAvoidingView behavior="padding" style={{}}>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => {
                  resetDraftOption();
                  setIsOpenOptionModal(false);
                }}
              >
                <IconExtra
                  name="close"
                  family="Ionicons"
                  size={32}
                  color={COLORS.HIGHLIGHT_GRAY}
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
                    {draftRoomName === null ? 0 : draftRoomName.length}/
                    {maxTopicLength}
                  </Text>
                </Block>
              </Block>
              <TextInput
                multiline
                numberOfLines={4}
                editable
                placeholder="恋愛相談に乗って欲しい、ただ話しを聞いて欲しい、どんな悩みでも大丈夫です。"
                maxLength={maxTopicLength}
                value={draftRoomName === null ? "" : draftRoomName}
                onChangeText={setDraftRoomName}
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
                  // underlayColor="#DDDDDD"
                  style={styles.roomImageContainer}
                  onPress={async () => {
                    const result = await getPermissionAsync();
                    if (result) {
                      pickImage().then((image) => {
                        if (image) {
                          setDraftRoomImage(image);
                        }
                      });
                    }
                  }}
                >
                  {renderRoomImage()}
                </TouchableOpacity>
              </Block>

              <Block center>
                <Button
                  style={styles.addTopicButton}
                  color={COLORS.BROWN}
                  shadowless
                  onPress={() => {
                    addRoomOption();
                    setIsOpenOptionModal(false);
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
    marginBottom: 32,
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
    height: "auto",
    borderColor: "silver",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.WHITE,
    marginBottom: 24,
  },
  roomImageContainer: {
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
  roomImage: {
    height: 72,
    width: 72,
    borderRadius: 8,
  },
  addTopicButton: {
    marginBottom: 16,
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

export default RoomEditorModal;

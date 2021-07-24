import React, { Dispatch, useRef, useState } from "react";
import { Block, Button, Text } from "galio-framework";
import {
  StyleSheet,
  Keyboard,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/core";

import { COLORS } from "src/constants/theme";
import {
  MAN_AND_WOMAN_IMG,
  MEN_IMG,
  PRIVATE_IMG,
} from "src/constants/imagePath";
import { Icon } from "src/components/atoms/Icon";
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
import { formatGender, generateUuid4 } from "src/utils";

type PropsDependsOnMode =
  | {
      mode: "CREATE_FROM_MY_ROOMS";
      setIsOpenRoomCreatedModal: Dispatch<boolean>;
    }
  | {
      mode: "CREATE_FROM_ROOMS";
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
export const RoomEditorModal: React.FC<Props> = (props) => {
  const {
    isOpenRoomEditorModal,
    setIsOpenRoomEditorModal,
    propsDependsOnMode,
  } = props;

  const [isOpenOptionModal, setIsOpenOptionModal] = useState(false);
  const profileState = useProfileState();
  const navigation = useNavigation();

  const formattedGender = formatGender(
    profileState.profile.gender,
    profileState.profile.isSecretGender
  );
  // 性別内緒or未設定は「同性のみ表示」禁止
  const canSetIsExcludeDifferentGender = !(
    formattedGender.isNotSet || formattedGender.key === "secret"
  );

  // ====== init post or patch data ======
  const [initRoomName] = useState(
    propsDependsOnMode.mode === "FIX"
      ? propsDependsOnMode.talkingRoom.name
      : null
  );
  const [initRoomImage] = useState(null);
  const [initDraftRoomImage] = useState(null);

  // initIsExcludeDifferentGender初期値のコード量が長いので関数に抽出
  const geneInitIsExcludeDifferentGender = () => {
    let _initIsExcludeDifferentGender = null;
    if (propsDependsOnMode.mode === "FIX") {
      if (propsDependsOnMode.talkingRoom.isPrivate) return false;
      if (canSetIsExcludeDifferentGender) {
        _initIsExcludeDifferentGender =
          propsDependsOnMode.talkingRoom.isExcludeDifferentGender;
      } else {
        _initIsExcludeDifferentGender = false; // HACK:(気味) 性別内緒or未設定は強制的に「異性にも表示」
      }
    }
    return _initIsExcludeDifferentGender;
  };
  const [initIsExcludeDifferentGender] = useState(
    geneInitIsExcludeDifferentGender()
  );
  const [initIsPrivate] = useState(
    propsDependsOnMode.mode === "FIX"
      ? propsDependsOnMode.talkingRoom.isPrivate
      : null
  );
  // ====== init post or patch data ======

  // ====== post or patch data ======
  const [roomName, setRoomName] = useState<string | null>(initRoomName);
  const [roomImage, setRoomImage] = useState<ImageInfo | null>(initRoomImage);
  const [draftRoomImage, setDraftRoomImage] = useState<ImageInfo | null>(
    initDraftRoomImage
  );
  const [isExcludeDifferentGender, setIsExcludeDifferentGender] = useState<
    boolean | null
  >(initIsExcludeDifferentGender);
  const [isPrivate, setIsPrivate] = useState<boolean | null>(initIsPrivate);
  // ====== post or patch data ======

  const maxRoomNameLength = 60;

  // canPostは作成時 & 修正時
  const canPost =
    (propsDependsOnMode.mode === "FIX"
      ? true
      : isExcludeDifferentGender !== null || isPrivate !== null) &&
    roomName &&
    roomName.length > 0;

  const resetDraftOption = () => {
    setDraftRoomImage(initDraftRoomImage);
  };
  /** ルーム作成後、全てのstateをリセット */
  const resetState = () => {
    resetDraftOption();
    setRoomName(initRoomName);
    setRoomImage(initRoomImage);
    setIsExcludeDifferentGender(initIsExcludeDifferentGender);
    setIsPrivate(initIsPrivate);
  };
  const addRoomOption = () => {
    resetDraftOption();
    setRoomImage(draftRoomImage);
  };
  const openOptionModal = () => {
    setDraftRoomImage(roomImage);
    setIsOpenOptionModal(true);
  };

  /** この値がtrueの状態でモーダルを閉じるとMyRoomsへ遷移し, ルーム作成モーダルが表示される(作成時のみ) */
  const isCreatedRef = useRef(false);
  const closeModalAfterCreate = () => {
    isCreatedRef.current = true;
    setIsOpenRoomEditorModal(false);
  };

  // ルーム作成用 (プライベート含)
  const { requestPostRoom, isLoadingPostRoom } = useRequestPostRoom(
    roomName,
    isExcludeDifferentGender,
    isPrivate,
    roomImage,
    () => {
      // then時、実行
      resetState();
      closeModalAfterCreate();
    }
  );

  // ルーム修正用
  const { requestPatchRoom, isLoadingPatchRoom } = useRequestPatchRoom(
    propsDependsOnMode.mode === "FIX" ? propsDependsOnMode.talkingRoom.id : "",
    roomName,
    isExcludeDifferentGender,
    isPrivate,
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
      <Icon
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
    } else if (
      propsDependsOnMode.mode === "CREATE_FROM_MY_ROOMS" ||
      propsDependsOnMode.mode === "CREATE_FROM_ROOMS"
    ) {
      if (draftRoomImage !== null) {
        return <Image style={styles.roomImage} source={draftRoomImage} />;
      } else {
        return emptyRoomImage;
      }
    }
    return null;
  };

  return (
    <Modal
      isVisible={isOpenRoomEditorModal}
      deviceWidth={width}
      onBackdropPress={() => {
        setIsOpenRoomEditorModal(false);
      }}
      style={styles.firstModal}
      onModalHide={() => {
        if (isCreatedRef.current) {
          if (propsDependsOnMode.mode === "CREATE_FROM_ROOMS") {
            // MyRoomsに遷移してcreatedModalを表示
            navigation.navigate("MyRooms", {
              navigateState: {
                willOpenRoomCreatedModal: true,
                id: generateUuid4(),
              },
            });
          }
          // createdModalの表示のみ
          else if (propsDependsOnMode.mode === "CREATE_FROM_MY_ROOMS") {
            propsDependsOnMode.setIsOpenRoomCreatedModal(true);
          }

          isCreatedRef.current = false;
        }
      }}
      onModalWillShow={() => {
        // 男性でisExcludeDifferentGender設定 => 内緒にして再度開くとisExcludeDifferentGenderがtrueでPOST可能になってしまうため対処
        if (!canSetIsExcludeDifferentGender && isExcludeDifferentGender) {
          setIsExcludeDifferentGender(null);
        }
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <>
          <Block column style={styles.firstModalContent}>
            <Block row>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => {
                  setIsOpenRoomEditorModal(false);
                }}
              >
                <Icon
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
                  <Icon
                    name="plus"
                    family="AntDesign"
                    size={16}
                    color={COLORS.BROWN}
                  />
                  <Block>
                    <Text size={14} color={COLORS.BROWN} bold>
                      ルーム画像を追加
                    </Text>
                  </Block>
                </Block>
              </Block>
            </TouchableOpacity>
            {roomImage ||
            (propsDependsOnMode.mode === "FIX" &&
              propsDependsOnMode.talkingRoom.image) ? (
              <Block row center style={styles.checkRoomImage}>
                <Icon
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
            <Block row space="between" style={styles.subTitleTextInput}>
              <Block>
                <Text size={14} color={COLORS.BLACK}>
                  話したい悩みについて
                </Text>
              </Block>
              <Block>
                <Text size={12} color={COLORS.GRAY}>
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
            <Block style={styles.subText}>
              <Text size={12} color={COLORS.LIGHT_GRAY}>
                見た人が不快になるような表現は避けましょう
              </Text>
            </Block>
            <Block style={styles.choiceRangeTitle}>
              <Text size={14} color={COLORS.BLACK}>
                表示範囲
              </Text>
            </Block>
            <Block row space="between" style={styles.circleButtons}>
              <TouchableOpacity
                style={[
                  styles.circleButton,
                  isExcludeDifferentGender !== null &&
                  !isExcludeDifferentGender &&
                  !isPrivate
                    ? { borderColor: COLORS.GREEN }
                    : { borderColor: "#f4f8f7" },
                ]}
                onPress={() => {
                  setIsExcludeDifferentGender(false);
                  setIsPrivate(false);
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
                  isExcludeDifferentGender !== null &&
                  isExcludeDifferentGender &&
                  !isPrivate
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
                    setIsPrivate(false);
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
              <TouchableOpacity
                style={[
                  styles.circleButton,
                  isPrivate !== null && isPrivate
                    ? { borderColor: COLORS.GREEN }
                    : { borderColor: "#f4f8f7" },
                ]}
                onPress={() => {
                  setIsPrivate(true);
                }}
              >
                <ImageBackground
                  source={PRIVATE_IMG}
                  style={styles.disclosureRangeImage}
                >
                  <Block style={styles.disclosureRangeText}>
                    <Text size={10} bold>
                      プライベート
                    </Text>
                  </Block>
                </ImageBackground>
              </TouchableOpacity>
            </Block>
            <Block center style={styles.submitButtonContainer}>
              <Button
                shadowless
                onPress={() => {
                  if (
                    propsDependsOnMode.mode === "CREATE_FROM_ROOMS" ||
                    propsDependsOnMode.mode === "CREATE_FROM_MY_ROOMS"
                  ) {
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
                  propsDependsOnMode.mode === "FIX"
                    ? isLoadingPatchRoom
                    : isLoadingPostRoom
                }
              >
                <Block row center style={styles.submitButtonInner}>
                  <Icon
                    name={propsDependsOnMode.mode === "FIX" ? "save" : ""}
                    family="AntDesign"
                    size={32}
                    color={COLORS.WHITE}
                    style={styles.submitButtonIcon}
                  />
                  <Block style={styles.submitButtonText}>
                    <Text size={20} color={COLORS.WHITE} bold>
                      {propsDependsOnMode.mode === "FIX"
                        ? "修正を反映する"
                        : "悩み相談のルームを作成する"}
                    </Text>
                  </Block>
                </Block>
              </Button>
            </Block>
          </Block>

          <Modal isVisible={isOpenOptionModal} deviceWidth={width}>
            <Block style={styles.secondModal}>
              <Block column style={styles.secondModalContent}>
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => {
                    resetDraftOption();
                    setIsOpenOptionModal(false);
                  }}
                >
                  <Icon
                    name="close"
                    family="Ionicons"
                    size={32}
                    color={COLORS.HIGHLIGHT_GRAY}
                  />
                </TouchableOpacity>
                <Block style={styles.subTitleTextInput}>
                  <Text size={12} color={COLORS.GRAY}>
                    ルーム画像
                  </Text>
                </Block>
                <Block center>
                  <TouchableOpacity
                    activeOpacity={0.7}
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
              </Block>
            </Block>
          </Modal>
          {Platform.OS === "ios" && (
            <KeyboardAvoidingView
              behavior="padding"
              keyboardVerticalOffset={0}
            />
          )}
        </>
      </TouchableWithoutFeedback>
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
    padding: 20,
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
    paddingHorizontal: 16,
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
    justifyContent: "center",
  },
  submitButton: {
    width: 335,
    height: 48,
    borderRadius: 30,
    elevation: 1,
  },
  submitButtonIcon: {
    paddingRight: 4,
  },
  submitButtonText: {
    paddingLeft: 4,
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
    width: width - 40,
    alignSelf: "center",
    textAlignVertical: "top",
    height: "auto",
    borderColor: "silver",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.WHITE,
    marginBottom: 8,
  },
  subText: {
    marginBottom: 40,
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

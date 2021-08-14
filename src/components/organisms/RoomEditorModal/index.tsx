import React, { Dispatch, useRef, useState } from "react";
import { Block, Button, Text } from "galio-framework";
import {
  StyleSheet,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableHighlight,
} from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/core";

import { COLORS } from "src/constants/colors";
import { Icon } from "src/components/atoms/Icon";
import { width } from "src/constants";
import {
  useRequestPatchRoom,
  useRequestPostRoom,
} from "src/hooks/requests/useRequestRooms";
import { TalkingRoom } from "src/types/Types.context";
import { showToast } from "src/utils/customModules";
import { ALERT_MESSAGES, TOAST_SETTINGS } from "src/constants/alertMessages";
import { useProfileState } from "src/contexts/ProfileContext";
import { formatGender, generateUuid4 } from "src/utils";
import { useChatState } from "src/contexts/ChatContext";
import { RoomImageEditorModal } from "src/components/organisms/RoomEditorModal/RoomImageEditorModal";
import { TagEditorModal } from "src/components/organisms/RoomEditorModal/TagEditorModal";
import {
  isExcludeDifferentGenderState,
  isPrivateState,
  IsSpeakerState,
  RoomImageState,
  RoomNameState,
  TagsState,
  useInitStateInRoomEditor,
} from "src/components/organisms/RoomEditorModal/useRoomEditor";

export type PropsDependsOnMode =
  | {
      mode: "CREATE_FROM_MY_ROOMS";
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

  const profileState = useProfileState();
  const chatState = useChatState();
  const navigation = useNavigation();

  // for オプションモーダル (ルーム画像Editor, タグEditor)
  const [isOpenRoomImageEditorModal, setIsOpenRoomImageEditorModal] =
    useState(false);
  const openRoomImageEditorModal = () => {
    setDraftRoomImage(roomImage);
    setIsOpenRoomImageEditorModal(true);
  };
  const [isOpenTagEditorModal, setIsOpenTagEditorModal] = useState(false);
  const openTagEditorModal = () => {
    setIsOpenTagEditorModal(true);
  };

  const formattedGender = formatGender(
    profileState.profile.gender,
    profileState.profile.isSecretGender
  );
  // 性別内緒or未設定は「同性のみ表示」禁止
  const canSetIsExcludeDifferentGender = !(
    formattedGender.isNotSet || formattedGender.key === "secret"
  );

  const {
    initIsSpeaker,
    initRoomName,
    initRoomImage,
    initDraftRoomImage,
    initTags,
    initDraftTags,
    initIsExcludeDifferentGender,
    initIsPrivate,
  } = useInitStateInRoomEditor(
    propsDependsOnMode,
    canSetIsExcludeDifferentGender
  );

  // ====== post or patch data ======
  const [isSpeaker, setIsSpeaker] = useState<IsSpeakerState>(initIsSpeaker);
  const [roomName, setRoomName] = useState<RoomNameState>(initRoomName);
  const [roomImage, setRoomImage] = useState<RoomImageState>(initRoomImage);
  const [draftRoomImage, setDraftRoomImage] =
    useState<RoomImageState>(initDraftRoomImage);
  const [tags, setTags] = useState<TagsState>(initTags);
  const [draftTags, setDraftTags] = useState<TagsState>(initDraftTags);
  const [isExcludeDifferentGender, setIsExcludeDifferentGender] =
    useState<isExcludeDifferentGenderState>(initIsExcludeDifferentGender);
  const [isPrivate, setIsPrivate] = useState<isPrivateState>(initIsPrivate);
  // ====== post or patch data ======

  const maxRoomNameLength = 60;

  // canPostは作成時 & 修正時
  const canPost =
    (propsDependsOnMode.mode === "FIX"
      ? true
      : isExcludeDifferentGender !== null || isPrivate !== null) &&
    roomName &&
    roomName.length > 0;

  const resetDraftRoomImage = () => {
    setDraftRoomImage(initDraftRoomImage);
  };
  const resetDraftTags = () => {
    setDraftTags(initDraftTags);
  };
  /** ルーム作成後、全てのstateをリセット */
  const resetState = () => {
    resetDraftRoomImage();
    resetDraftTags();
    setRoomName(initRoomName);
    setRoomImage(initRoomImage);
    setIsExcludeDifferentGender(initIsExcludeDifferentGender);
    setIsPrivate(initIsPrivate);
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
    tags,
    () => {
      // then時、実行
      resetState();
      closeModalAfterCreate();
    },
    isSpeaker
  );

  // ルーム修正用
  const { requestPatchRoom, isLoadingPatchRoom } = useRequestPatchRoom(
    propsDependsOnMode.mode === "FIX" ? propsDependsOnMode.talkingRoom.id : "",
    roomName,
    isExcludeDifferentGender,
    isPrivate,
    roomImage,
    tags,
    () => {
      // then時、実行
      resetState();
      setIsOpenRoomEditorModal(false);
      showToast(TOAST_SETTINGS["FIX_ROOM"]);
    },
    isSpeaker
  );

  return (
    <Modal
      isVisible={isOpenRoomEditorModal}
      deviceWidth={width}
      onBackdropPress={() => {
        setIsOpenRoomEditorModal(false);
      }}
      style={styles.modal}
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
            // propsDependsOnMode.setIsOpenRoomCreatedModal(true);
          }

          showToast(TOAST_SETTINGS["CREATE_ROOM"]);
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
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <>
          <Block column style={styles.modalContent}>
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
              style={styles.roomImageEditorModalOpener}
              onPress={() => {
                openRoomImageEditorModal();
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

            <Block style={styles.subTitle}>
              <Text size={14} color={COLORS.BLACK}>
                私は
              </Text>
            </Block>
            <Block row space="between" style={styles.statusButtonContainer}>
              <Button
                shadowless={true}
                opacity={0.8}
                onPress={() => {
                  setIsSpeaker(true);
                }}
                style={[
                  styles.statusButton,
                  isSpeaker
                    ? { borderColor: COLORS.BROWN }
                    : { borderColor: COLORS.HIGHLIGHT_GRAY, borderWidth: 1 },
                ]}
              >
                <Text size={14} color={COLORS.BLACK}>
                  悩みを話したい
                </Text>
              </Button>
              <Button
                shadowless={true}
                opacity={0.8}
                onPress={() => {
                  setIsSpeaker(false);
                }}
                style={[
                  styles.statusButton,
                  !isSpeaker
                    ? { borderColor: COLORS.BROWN }
                    : { borderColor: COLORS.HIGHLIGHT_GRAY, borderWidth: 1 },
                ]}
              >
                <Text size={14} color={COLORS.BLACK}>
                  悩みを聞きたい
                </Text>
              </Button>
            </Block>

            <Block row space="between" style={styles.subTitle}>
              <Block>
                <Text size={14} color={COLORS.BLACK}>
                  {isSpeaker ? "話したい悩みについて" : "聞きたい悩みについて"}
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
              placeholder={
                isSpeaker
                  ? "恋愛相談に乗って欲しい、ただ話しを聞いて欲しい、どんな悩みでも大丈夫です。"
                  : "恋愛の悩み聞きます、相談に乗ります、なんでも大丈夫です。"
              }
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
            <TouchableHighlight
              style={styles.tagAreaContainer}
              activeOpacity={0.5}
              underlayColor={COLORS.WHITE}
              onPress={() => {
                openTagEditorModal();
              }}
            >
              <Block row space="between" style={styles.tagArea}>
                <Block flex={1}>
                  <Text
                    size={14}
                    color={
                      tags !== null && tags.length > 0
                        ? COLORS.BROWN
                        : COLORS.HIGHLIGHT_GRAY
                    }
                  >
                    {profileState.profileParams !== null &&
                    tags !== null &&
                    tags.length > 0
                      ? tags
                          .map((tagKey) => {
                            return `#${
                              profileState.profileParams !== null &&
                              profileState.profileParams.tags[tagKey].label
                            }`;
                          })
                          .join(" ")
                      : "タグ（任意）"}
                  </Text>
                </Block>

                <Icon
                  name="chevron-right"
                  family="Feather"
                  size={24}
                  color={COLORS.HIGHLIGHT_GRAY}
                />
              </Block>
            </TouchableHighlight>
            <Block style={styles.subTitle}>
              <Text size={14} color={COLORS.BLACK}>
                表示範囲
              </Text>
            </Block>
            <Block row space="between" style={styles.rangeButtonContainer}>
              <Button
                shadowless={true}
                opacity={0.6}
                style={[
                  styles.rangeButton,
                  isExcludeDifferentGender !== null &&
                  !isExcludeDifferentGender &&
                  !isPrivate
                    ? { borderColor: COLORS.BROWN }
                    : { borderColor: COLORS.HIGHLIGHT_GRAY, borderWidth: 1 },
                ]}
                onPress={() => {
                  setIsExcludeDifferentGender(false);
                  setIsPrivate(false);
                }}
              >
                <Text size={14} color={COLORS.BLACK}>
                  全員
                </Text>
              </Button>
              <Button
                shadowless={true}
                opacity={0.6}
                style={[
                  styles.rangeButton,
                  isExcludeDifferentGender !== null &&
                  isExcludeDifferentGender &&
                  !isPrivate
                    ? { borderColor: COLORS.BROWN }
                    : { borderColor: COLORS.HIGHLIGHT_GRAY, borderWidth: 1 },
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
                <Text size={14} color={COLORS.BLACK}>
                  同性のみ
                </Text>
              </Button>
              <Button
                shadowless={true}
                opacity={0.6}
                style={[
                  styles.rangeButton,
                  isPrivate !== null && isPrivate
                    ? { borderColor: COLORS.BROWN }
                    : { borderColor: COLORS.HIGHLIGHT_GRAY, borderWidth: 1 },
                ]}
                onPress={() => {
                  if (!chatState.hasFavoriteUser) {
                    Alert.alert(...ALERT_MESSAGES["CANNOT_SET_IS_PRIVATE"]);
                  } else {
                    setIsPrivate(true);
                  }
                }}
              >
                <Text size={14} color={COLORS.BLACK}>
                  プライベート
                </Text>
              </Button>
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

          <RoomImageEditorModal
            isOpen={isOpenRoomImageEditorModal}
            setIsOpen={setIsOpenRoomImageEditorModal}
            resetDraftRoomImage={resetDraftRoomImage}
            propsDependsOnMode={propsDependsOnMode}
            roomImage={roomImage}
            setRoomImage={setRoomImage}
            draftRoomImage={draftRoomImage}
            setDraftRoomImage={setDraftRoomImage}
          />
          <TagEditorModal
            isOpen={isOpenTagEditorModal}
            setIsOpen={setIsOpenTagEditorModal}
            resetDraftTags={resetDraftTags}
            tags={tags}
            setTags={setTags}
            draftTags={draftTags}
            setDraftTags={setDraftTags}
          />
        </>
      </TouchableOpacity>
      {Platform.OS === "ios" && (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={0} />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    marginHorizontal: 0,
    marginBottom: 0,
  },
  modalContent: {
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
  roomImageEditorModalOpener: {
    position: "absolute",
    top: 24,
    right: 16,
  },
  checkRoomImage: {
    position: "absolute",
    top: 64,
    right: 16,
  },
  subTitle: {
    marginBottom: 8,
  },
  submitButtonContainer: {
    marginBottom: 16,
  },
  submitButtonInner: {
    justifyContent: "center",
  },
  submitButton: {
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
  textArea: {
    alignSelf: "center",
    textAlignVertical: "top",
    borderColor: "silver",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.WHITE,
    marginBottom: 8,
    height: 80,
    width: "100%",
  },
  tagAreaContainer: {
    height: 40,
    borderColor: "silver",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: COLORS.WHITE,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  tagArea: {
    alignItems: "center",
    width: "100%",
  },
  rangeButtonContainer: {
    marginBottom: 32,
  },
  rangeButton: {
    width: width / 4,
    borderRadius: 8,
    backgroundColor: COLORS.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 3,
  },
  statusButtonContainer: {
    marginBottom: 24,
  },
  statusButton: {
    width: width / 2.5,
    borderRadius: 8,
    backgroundColor: COLORS.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 3,
  },
});

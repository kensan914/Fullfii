import React, { Dispatch, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import { Block, Text, Button } from "galio-framework";
import Rate, { AndroidMarket } from "react-native-rate";

import { COLORS } from "src/constants/colors";
import { APP_ID, APP_ID_ANDROID } from "src/constants/env";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  onEnd?: () => void;
};
export const ReviewModal: React.FC<Props> = (props) => {
  const {
    isOpen: isOpenReviewModal,
    setIsOpen: setIsOpenReviewModal,
    onEnd: onAdditionalEnd = () => void 0,
  } = props;

  const onEnd = () => {
    onAdditionalEnd();
    shouldOpenDissatisfactionModalRef.current = false;
    console.log("終了");
  };

  // レビューモーダル
  const shouldOpenDissatisfactionModalRef = useRef(false);
  const onPressDissatisfaction = () => {
    shouldOpenDissatisfactionModalRef.current = true;
    setIsOpenReviewModal(false);
  };
  const onPressReview = () => {
    const options = {
      AppleAppID: APP_ID,
      GooglePackageName: APP_ID_ANDROID,
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: true, // app内レビューを有効
      openAppStoreIfInAppFails: true, // app内レビュー失敗時, storeに遷移
    };
    Rate.rate(options, (isSuccess) => {
      if (isSuccess) {
        //
      }
      setIsOpenReviewModal(false);
    });
  };
  const onCancelReview = () => {
    setIsOpenReviewModal(false);
  };
  const onHideReviewModal = () => {
    if (shouldOpenDissatisfactionModalRef.current) {
      setIsOpenDissatisfactionModal(true);
    } else {
      onEnd();
    }
  };

  // 不満モーダル
  const [isOpenDissatisfactionModal, setIsOpenDissatisfactionModal] =
    useState(false);
  const [dissatisfactionText, setDissatisfactionText] = useState("");
  const onSubmitDissatisfaction = () => {
    // POST
    // finally ⇓
    setIsOpenDissatisfactionModal(false);
  };
  const onCancelDissatisfaction = () => {
    setIsOpenDissatisfactionModal(false);
  };
  const onHideDissatisfactionModal = () => {
    onEnd();
  };
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <>
      <Modal
        backdropOpacity={0.3}
        isVisible={isOpenReviewModal}
        style={styles.modal}
        onModalHide={onHideReviewModal}
      >
        <Block style={styles.modalInnerContainer}>
          <Text bold>Fullfiiを応援する</Text>
          <Button onPress={onPressDissatisfaction}>不満がある</Button>
          <Button onPress={onPressReview}>レビューする</Button>
          <Button onPress={onCancelReview}>キャンセル</Button>
        </Block>
      </Modal>
      <Modal
        backdropOpacity={0.3}
        isVisible={isOpenDissatisfactionModal}
        style={styles.modal}
        onModalHide={onHideDissatisfactionModal}
        onBackdropPress={dismissKeyboard}
      >
        <TouchableOpacity activeOpacity={1} onPress={dismissKeyboard}>
          <Block style={styles.modalInnerContainer}>
            <Text bold>不満点を聞かせてください</Text>
            <TextInput
              multiline
              numberOfLines={4}
              editable
              maxLength={500}
              value={dissatisfactionText}
              onChangeText={setDissatisfactionText}
              placeholder=""
              returnKeyType="done"
              blurOnSubmit
              style={styles.textArea}
              onSubmitEditing={dismissKeyboard}
            />
            <Button onPress={onSubmitDissatisfaction}>送信</Button>
            <Button onPress={onCancelDissatisfaction}>キャンセル</Button>
          </Block>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 20,
  },
  modalInnerContainer: {
    backgroundColor: COLORS.WHITE,
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  textArea: {
    width: "100%",
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
});

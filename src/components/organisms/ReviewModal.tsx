import React, { Dispatch, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { Block, Text, Button } from "galio-framework";
import Rate, { AndroidMarket } from "react-native-rate";

import { COLORS } from "src/constants/colors";
import { APP_ID, APP_ID_ANDROID } from "src/constants/env";
import { STAR_IMG, REVIEW_ICON_IMG } from "src/constants/imagePath";
import { useRequestSurveyDissatisfaction } from "src/hooks/requests/useRequestSurvey";

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
    setDissatisfactionText("");
    setIsLoadingPostSurveyDissatisfaction(false);
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
  const [
    isLoadingPostSurveyDissatisfaction,
    setIsLoadingPostSurveyDissatisfaction,
  ] = useState(false);
  const { requestPostSurveyDissatisfaction } = useRequestSurveyDissatisfaction(
    dissatisfactionText,
    () => void 0,
    () => {
      setIsOpenDissatisfactionModal(false);
    }
  );
  const onSubmitDissatisfaction = () => {
    requestPostSurveyDissatisfaction();
    setIsLoadingPostSurveyDissatisfaction(true);
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
          <Block style={styles.titleContainer}>
            <Text bold size={20} color={COLORS.BLACK}>
              Fullfiiを応援する
            </Text>
          </Block>
          <Image source={REVIEW_ICON_IMG} style={styles.iconImage} />
          <Image source={STAR_IMG} style={styles.starImage} />
          <Block style={styles.descriptionContainer}>
            <Text size={13} color={COLORS.BLACK} style={styles.lineHeight}>
              いつもご利用ありがとうございます！Fullfiiを気に入っていただけましたらぜひ5つ星評価をお願いします！
            </Text>
          </Block>
          <Button
            color="transparent"
            shadowless={true}
            opacity={0.6}
            style={styles.dissatisfactionButton}
            onPress={onPressDissatisfaction}
          >
            <Text size={16} color={COLORS.BROWN}>
              不満がある
            </Text>
          </Button>
          <Block row>
            <Button
              color={COLORS.WHITE}
              shadowless={true}
              opacity={0.4}
              style={styles.cancelButton}
              onPress={onCancelReview}
            >
              <Text size={16} bold color={COLORS.BLACK}>
                キャンセル
              </Text>
            </Button>
            <Button
              color="transparent"
              shadowless={true}
              opacity={0.4}
              style={styles.reviewButton}
              onPress={onPressReview}
            >
              <Text size={16} bold color={COLORS.BLACK}>
                レビューする
              </Text>
            </Button>
          </Block>
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
            <Block style={styles.titleContainer}>
              <Text bold size={20} color={COLORS.BLACK}>
                不満点を聞かせてください
              </Text>
            </Block>
            <Block style={styles.descriptionDissatisfactionContainer}>
              <Text size={13} color={COLORS.BLACK} style={styles.lineHeight}>
                サービスの体験向上のために使いづらい点を教えていただきたいです！
              </Text>
            </Block>
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
            <Block row>
              <Button
                color={COLORS.WHITE}
                shadowless={true}
                opacity={0.4}
                style={styles.cancelButton}
                onPress={onCancelDissatisfaction}
                disabled={isLoadingPostSurveyDissatisfaction}
              >
                <Text size={16} bold color={COLORS.BLACK}>
                  キャンセル
                </Text>
              </Button>
              <Button
                color="transparent"
                shadowless={true}
                opacity={0.4}
                style={styles.reviewButton}
                onPress={onSubmitDissatisfaction}
                disabled={isLoadingPostSurveyDissatisfaction}
              >
                {isLoadingPostSurveyDissatisfaction ? (
                  <ActivityIndicator color={COLORS.BLACK} />
                ) : (
                  <Text size={16} bold color={COLORS.BLACK}>
                    送信
                  </Text>
                )}
              </Button>
            </Block>
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
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  titleContainer: {
    paddingTop: 32,
  },
  iconImage: {
    height: 64,
    width: 64,
    marginTop: 32,
  },
  starImage: {
    height: 27,
    width: 131,
    marginTop: 8,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  lineHeight: {
    lineHeight: 16,
  },
  dissatisfactionButton: {
    height: 40,
    width: "auto",
    marginTop: 8,
    marginBottom: 8,
  },
  descriptionDissatisfactionContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },

  textArea: {
    width: "90%",
    alignSelf: "center",
    textAlignVertical: "top",
    height: "auto",
    borderColor: "silver",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.WHITE,
    marginTop: 16,
    marginBottom: 24,
  },
  reviewButton: {
    borderTopWidth: 1,
    borderTopColor: COLORS.HIGHLIGHT_GRAY,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.HIGHLIGHT_GRAY,
    flex: 1,
    height: 48,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  cancelButton: {
    borderTopWidth: 1,
    borderTopColor: COLORS.HIGHLIGHT_GRAY,
    borderRightWidth: 1,
    borderRightColor: COLORS.HIGHLIGHT_GRAY,
    flex: 1,
    height: 48,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
});

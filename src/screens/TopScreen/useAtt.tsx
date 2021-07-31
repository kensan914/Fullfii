import React, { ReactNode, useRef, useState } from "react";
import Modal from "react-native-modal";
import { StyleSheet } from "react-native";
import { Block, Text, Button } from "galio-framework";

import { COLORS } from "src/constants/colors";
import {
  checkPermissionATT,
  requestPermissionATT,
} from "src/utils/appTrackingTransparency";

export const useAtt = (): {
  showAttModal: () => void;
  renderAttModal: () => ReactNode;
} => {
  const [isOpenAttModal, setIsOpenAttModal] = useState(false);
  const requested = useRef(false);

  const showAttModal = (): void => {
    if (!requested.current) {
      checkPermissionATT(
        () => {
          setIsOpenAttModal(true);
          requested.current = true;
        },
        () => {
          requested.current = true;
        }
      );
    }
  };

  const onOpenRequestPermissionDialog = () => {
    requestPermissionATT();
    setIsOpenAttModal(false);
  };

  const renderAttModal = () => {
    return (
      <AttModal
        isOpenAttModal={isOpenAttModal}
        setIsOpenAttModal={setIsOpenAttModal}
        onPress={onOpenRequestPermissionDialog}
      />
    );
  };

  return {
    showAttModal,
    renderAttModal,
  };
};

type Props = {
  isOpenAttModal: boolean;
  setIsOpenAttModal: (val: boolean) => void;
  onPress: () => void;
};
const AttModal: React.FC<Props> = (props) => {
  const { isOpenAttModal, onPress } = props;

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isOpenAttModal}
      style={styles.attModal}
      onModalHide={onPress}
    >
      <Block style={styles.attContainer}>
        <Text size={21} bold color={COLORS.BLACK} style={styles.attTitle}>
          あなたに合う広告を表示します
        </Text>
        <Text size={14} color={COLORS.GRAY} style={styles.attDescription}>
          Fullfiiは広告の収益に支えられています。
          <Text size={14} color="#ff5576">
            関連性の低い広告
          </Text>
          を表示させずによりあなたに
          <Text size={14} color="#1997d2">
            適切な広告
          </Text>
          を表示するには、必要な情報の利用をFullfiiに許可してください。
        </Text>
        <Button
          round
          color={COLORS.BROWN}
          shadowless
          style={styles.attOnButton}
          onPress={onPress}
        >
          <Text size={16} color="white" bold>
            次の画面で設定する
          </Text>
        </Button>
      </Block>
    </Modal>
  );
};

const styles = StyleSheet.create({
  attModal: {
    marginHorizontal: 20,
  },
  attContainer: {
    backgroundColor: COLORS.WHITE,
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  attTitle: {
    marginTop: 12,
    marginBottom: 22,
  },
  attDescription: {
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  attOnButton: {
    width: "100%",
  },
  attOffButton: {
    width: "100%",
  },
});

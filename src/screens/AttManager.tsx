import React, { useEffect, useRef, useState } from "react";
import Modal from "react-native-modal";
import { StyleSheet } from "react-native";
import { Block, Text, Button } from "galio-framework";

import { COLORS } from "src/constants/colors";
import {
  checkPermissionATT,
  requestPermissionATT,
} from "src/utils/appTrackingTransparency";

export const AttManager: React.FC = (props) => {
  const { children } = props;
  const [isOpenAttModal, setIsOpenAttModal] = useState(false);

  // const [attModule, setAttModule] = useState(); // 未設定: undefined, expo等環境不適合: null, import成功: module本体
  const requested = useRef(false);

  // useEffect(() => {
  //   (async () => {
  //     // XCode12じゃない開発者への対処
  //     if (CAN_APP_TRACKING_TRANSPARENCY && !isExpo) {
  //       const appTrackingTransparencyModule = await import(
  //         "src/utils/appTrackingTransparency"
  //       );
  //       setAttModule(appTrackingTransparencyModule);
  //     } else {
  //       setAttModule(null);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
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
  }, []);

  const onOpenRequestPermissionDialog = () => {
    requestPermissionATT();
    setIsOpenAttModal(false);
  };

  return (
    <>
      {children}
      <AttModal
        isOpenAttModal={isOpenAttModal}
        setIsOpenAttModal={setIsOpenAttModal}
        onPress={onOpenRequestPermissionDialog}
      />
    </>
  );
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
    >
      <Block style={styles.attContainer}>
        <Text size={21} bold color={COLORS.BLACK} style={styles.attTitle}>
          広告をカスタマイズしましょう
        </Text>
        <Text color={COLORS.GRAY} style={styles.attDescription}>
          Fullfiiは広告の収益に支えられています。
          <Text color="#ff5576">関連性の低い広告</Text>
          を表示させずにより
          <Text color="#1997d2">適切な広告</Text>
          を表示するには、必要な情報の利用をFullfiiに許可してください。アプリに表示される広告が皆様に合わせてカスタマイズされます。
        </Text>
        <Button
          round
          color={COLORS.PINK}
          shadowless
          style={styles.attOnButton}
          onPress={onPress}
        >
          <Text size={16} color="white" bold>
            次の画面で設定する
          </Text>
        </Button>
        {/* <Button
          round
          color="transparent"
          style={styles.attOffButton}
          onPress={onPress}
        >
          <Text size={16} color="#80ccf0" bold>
            関連性の低い広告を引き続き表示する
          </Text>
        </Button> */}
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
  },
  attOnButton: {
    width: "100%",
    // marginBottom: 10,
  },
  attOffButton: {
    width: "100%",
  },
});

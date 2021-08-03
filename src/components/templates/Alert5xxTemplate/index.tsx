import React from "react";
import { StyleSheet } from "react-native";

import { Block, Text } from "galio-framework";
import { ReviewModal } from "src/components/organisms/ReviewModal";

type Props = {
  isMaintenance: boolean;
  openTwitterFullfii: () => void;
};
export const Alert5xxTemplate: React.FC<Props> = (props) => {
  const {
    isMaintenance,
    openTwitterFullfii,
    isOpenReviewModal,
    setIsOpenReviewModal,
  } = props;

  return (
    <Block flex style={styles.container}>
      <Text>
        {/* isMaintenance使用例 ⇓ */}
        {isMaintenance
          ? "ただいまメンテナンス中です"
          : "ごめんなさい...\nあなたは何も悪くないです"}
      </Text>
      <Text color="blue" onPress={openTwitterFullfii}>
        Twitter
      </Text>

      {/* TODO: 最終的に消す */}
      <Text
        color="red"
        onPress={() => {
          setIsOpenReviewModal(true);
        }}
      >
        レビュー喚起モーダル（最終的に消す）
      </Text>
      <ReviewModal
        isOpen={isOpenReviewModal}
        setIsOpen={setIsOpenReviewModal}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

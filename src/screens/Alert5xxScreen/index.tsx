import React, { useState } from "react";
import { Linking } from "react-native";

import { Alert5xxTemplate } from "src/components/templates/Alert5xxTemplate/indext";
import {
  TWITTER_FULLFII_URL,
  TWITTER_FULLFII_URL_ORIGINAL_SCHEME,
} from "src/constants/env";

export const Alert5xxScreen: React.FC = () => {
  const [isMaintenance] = useState(true); // メンテナンス or ネットワークエラー

  const openTwitterFullfii = () => {
    Linking.canOpenURL(TWITTER_FULLFII_URL_ORIGINAL_SCHEME).then((supported) =>
      Linking.openURL(
        supported ? TWITTER_FULLFII_URL_ORIGINAL_SCHEME : TWITTER_FULLFII_URL
      )
    );
  };

  // TODO: 最終的に消す
  const [isOpenReviewModal, setIsOpenReviewModal] = useState(false);

  return (
    <Alert5xxTemplate
      isMaintenance={isMaintenance}
      openTwitterFullfii={openTwitterFullfii}
      isOpenReviewModal={isOpenReviewModal}
      setIsOpenReviewModal={setIsOpenReviewModal}
    />
  );
};

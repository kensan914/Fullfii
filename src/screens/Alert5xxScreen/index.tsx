import React, { useState } from "react";
import { Linking } from "react-native";

import { Alert5xxTemplate } from "src/components/templates/Alert5xxTemplate";
import {
  TWITTER_FULLFII_URL,
  TWITTER_FULLFII_URL_ORIGINAL_SCHEME,
} from "src/constants/env";
import { MAINTENANCE, useDomState } from "src/contexts/DomContext";

export const Alert5xxScreen: React.FC = () => {
  const domState = useDomState();

  const [isMaintenance] = useState(domState.apiStatus === MAINTENANCE); // メンテナンス or ネットワークエラー

  const openTwitterFullfii = () => {
    Linking.canOpenURL(TWITTER_FULLFII_URL_ORIGINAL_SCHEME).then((supported) =>
      Linking.openURL(
        supported ? TWITTER_FULLFII_URL_ORIGINAL_SCHEME : TWITTER_FULLFII_URL
      )
    );
  };

  return (
    <Alert5xxTemplate
      isMaintenance={isMaintenance}
      openTwitterFullfii={openTwitterFullfii}
    />
  );
};

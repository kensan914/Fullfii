import { useEffect } from "react";
import { Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import { ALERT_MESSAGES } from "src/constants/alertMessages";

export const useNetInfo = (): void => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        Alert.alert(...ALERT_MESSAGES["NOT_CONNECT_NETWORK"]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
};

import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

import { useAuthState } from "src/contexts/AuthContext";
import { useChatDispatch } from "src/contexts/ChatContext";
import { AllMessages } from "src/types/Types.context";

export const useTurnOnRead = (messages: AllMessages, roomId: string): void => {
  const appState = useRef(AppState.currentState);
  const chatDispatch = useChatDispatch();
  const authState = useAuthState();

  const turnOnRead = () => {
    authState.token &&
      chatDispatch({
        type: "READ_BY_ROOM",
        roomId: roomId,
        token: authState.token,
        isForceSendReadNotification: true,
      });
  };

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active" && appState.current === "background") {
      turnOnRead();
    }
    appState.current = nextAppState;
  };
  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    if (appState.current === "active") {
      turnOnRead();
    }
  }, [messages.length]);
};

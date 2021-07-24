import { Dispatches, States } from "src/types/Types.context";
import { useAuthDispatch, useAuthState } from "src/contexts/AuthContext";
import { useChatDispatch, useChatState } from "src/contexts/ChatContext";
import {
  useProfileDispatch,
  useProfileState,
} from "src/contexts/ProfileContext";

export const useAllContext = (): [States, Dispatches] => {
  const states: States = {
    authState: useAuthState(),
    profileState: useProfileState(),
    chatState: useChatState(),
  };
  const dispatches: Dispatches = {
    authDispatch: useAuthDispatch(),
    profileDispatch: useProfileDispatch(),
    chatDispatch: useChatDispatch(),
  };

  return [states, dispatches];
};

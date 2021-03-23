import { useState } from "react";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";

import { useProfileState } from "../contexts/ProfileContext";
import { alertModal, URLJoin } from "../modules/support";
import { useAxios } from "../modules/axios";
import { BASE_URL, REPORT_URL } from "../../constants/env";
import { useChatDispatch } from "../contexts/ChatContext";
import { useAuthState } from "../contexts/AuthContext";
import {
  Profile,
  TalkTicket,
  TalkTicketJson,
  TalkTicketJsonIoTs,
} from "../types/Types.context";
import { useNavigation } from "@react-navigation/native";

const useProfileModal: (
  profile: Profile,
  talkTicket?: TalkTicket
) => {
  canPressBackdrop: boolean;
  setCanPressBackdrop: (val: boolean) => void;
  onPressReport: () => void;
  onPressBlock: () => void;
  user: Profile;
} = (profile, talkTicket) => {
  const navigation = useNavigation();
  const profileState = useProfileState();
  const user = profile.me ? profileState.profile : profile;

  const authState = useAuthState();
  const chatDispatch = useChatDispatch();
  const { request: requestReport } = useAxios(
    URLJoin(BASE_URL, "talk-ticket/", talkTicket?.id),
    "post",
    TalkTicketJsonIoTs,
    {
      data: {
        status: "waiting",
      },
      thenCallback: (resData) => {
        const newTalkTicket = resData as TalkTicketJson;
        chatDispatch({
          type: "OVERWRITE_TALK_TICKET",
          talkTicket: newTalkTicket,
        });
        (async () => {
          await WebBrowser.openBrowserAsync(REPORT_URL);
          navigation.navigate("Home");
        })();
      },
      finallyCallback: () => {
        // 遅延したchatDispatchを実行(同時にマッチしていた場合はSTART_TALKが実行される)
        chatDispatch({ type: "TURN_OFF_DELAY" });
      },
      didRequestCallback: () => {
        // この後のchatDispatchを遅延する(同時にマッチしていた場合はSTART_TALKが遅延される)
        chatDispatch({
          type: "TURN_ON_DELAY",
          excludeType: ["OVERWRITE_TALK_TICKET"],
        });
      },
      token: authState.token ? authState.token : "",
      limitRequest: 1,
    }
  );
  const onPressReport = () => {
    setCanPressBackdrop(false);
    alertModal({
      mainText: "通報します。",
      subText:
        "トークは終了され、通報ページに移動します。通報には話し相手とあなたのユーザ名が必要です。メモなどで入力できるようにしましょう。",
      cancelButton: "キャンセル",
      okButton: "通報する",
      onPress: () => {
        setCanPressBackdrop(true);
        requestReport();
      },
      cancelOnPress: () => setCanPressBackdrop(true),
    });
  };

  const { request: requestBlock } = useAxios(
    URLJoin(BASE_URL, "users/", user.id, "block/"),
    "patch",
    null,
    {
      data: {
        status: "waiting",
      },
      thenCallback: async () => {
        Alert.alert(`${user.name}さんをブロックしました。`);
      },
      catchCallback: (err) => {
        if (
          err?.response &&
          err.response.data.type === "have_already_blocked"
        ) {
          Alert.alert(err.response.data.message);
        }
      },
      token: authState.token ? authState.token : "",
      limitRequest: 1,
    }
  );
  const onPressBlock = () => {
    alertModal({
      mainText: `${user.name}さんをブロックしますか？`,
      subText: `あなたの端末と${user.name}さんの端末からお互いの情報が表示されなくなります。また、相手にこのブロックは通知されません。`,
      cancelButton: "キャンセル",
      okButton: "ブロックする",
      onPress: () => {
        setCanPressBackdrop(true);
        requestBlock();
      },
      cancelOnPress: () => setCanPressBackdrop(true),
    });
  };

  const [canPressBackdrop, setCanPressBackdrop] = useState(true);

  return {
    canPressBackdrop,
    setCanPressBackdrop,
    onPressReport,
    onPressBlock,
    user,
  };
};

export default useProfileModal;

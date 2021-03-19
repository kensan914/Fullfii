import { Dispatch, MutableRefObject, useRef, useState } from "react";
import {
  ADMOB_UNIT_ID_AFTER_SHUFFLE,
  BASE_URL,
  isExpo,
} from "../../constants/env";
import { useAuthDispatch, useAuthState } from "../contexts/AuthContext";
import { useChatDispatch, useChatState } from "../contexts/ChatContext";
import { useProfileState } from "../contexts/ProfileContext";
import { useAxios } from "../modules/axios";
import { alertModal, formatGender, URLJoin } from "../modules/support";
import {
  TalkTicketJson,
  TalkTicketJsonIoTs,
  TalkTicketKey,
} from "../types/Types.context";
import { logEvent } from "../modules/firebase/logEvent";
import { showAdMobInterstitial } from "../molecules/Admob";

const useShuffle = (
  talkTicketKey: TalkTicketKey,
  setIsOpen?: (val: boolean) => void
): {
  canTalkHeterosexual: boolean;
  setCanTalkHeterosexual: Dispatch<boolean>;
  canTalkDifferentJob: boolean;
  setCanTalkDifferentJob: Dispatch<boolean>;
  isSpeaker: boolean;
  setIsSpeaker: Dispatch<boolean>;
  isShowSpinner: boolean;
  setIsShowSpinner: Dispatch<boolean>;
  isOpenEndTalk: boolean;
  setIsOpenEndTalk: Dispatch<boolean>;
  canPressBackdrop: boolean;
  setCanPressBackdrop: Dispatch<boolean>;
  onPressStop: () => void;
  onPressShuffle: () => void;
  closeChatModal: () => void;
  isSecretJob: boolean;
  isSecretGender: boolean;
  roomId: MutableRefObject<string | undefined>;
} => {
  /* states, dispatches */
  const chatState = useChatState();
  const authState = useAuthState();
  const chatDispatch = useChatDispatch();
  const profileState = useProfileState();
  const authDispatch = useAuthDispatch();

  /* talkTicket */
  const talkTicket = chatState.talkTicketCollection[talkTicketKey];

  /* state */
  const [canTalkHeterosexual, setCanTalkHeterosexual] = useState(
    talkTicket.canTalkHeterosexual
  );
  const [canTalkDifferentJob, setCanTalkDifferentJob] = useState(
    talkTicket.canTalkDifferentJob
  );
  const [isSpeaker, setIsSpeaker] = useState(talkTicket.isSpeaker);
  const [isShowSpinner, setIsShowSpinner] = useState(false);
  const [isOpenEndTalk, setIsOpenEndTalk] = useState(false);
  const [canPressBackdrop, setCanPressBackdrop] = useState(true);

  const isSecretJob = profileState.profile.job.key === "secret";
  const isSecretGender =
    formatGender(
      profileState.profile.gender,
      profileState.profile.isSecretGender
    ).key === "secret";

  /* ref */
  const roomId = useRef<string>();

  const { request } = useAxios(
    URLJoin(BASE_URL, "talk-ticket/", talkTicket.id),
    "post",
    TalkTicketJsonIoTs,
    {
      thenCallback: (resData) => {
        const _resData = resData as TalkTicketJson;
        roomId.current = talkTicket.room.id;
        const newTalkTicketJson = _resData;

        chatDispatch({
          type: "OVERWRITE_TALK_TICKET",
          talkTicket: newTalkTicketJson,
        });
        if (talkTicket.status.key === "talking") {
          setIsOpenEndTalk(true);
        } else {
          closeChatModal();
        }
      },
      catchCallback: () => {
        closeChatModal();
      },
      finallyCallback: () => {
        // 遅延したchatDispatchを実行(同時にマッチしていた場合はSTART_TALKが実行される)
        chatDispatch({ type: "TURN_OFF_DELAY" });
        setIsShowSpinner(false);

        if (!isExpo) {
          authDispatch({ type: "SET_IS_SHOW_SPINNER", value: true });
          showAdMobInterstitial(ADMOB_UNIT_ID_AFTER_SHUFFLE, () => {
            authDispatch({ type: "SET_IS_SHOW_SPINNER", value: false });
          });
        }
      },
      didRequestCallback: () => {
        // この後のchatDispatchを遅延する(同時にマッチしていた場合はSTART_TALKが遅延される)
        chatDispatch({
          type: "TURN_ON_DELAY",
          excludeType: ["OVERWRITE_TALK_TICKET"],
        });
      },
      token: authState.token ? authState.token : "",
    }
  );

  const onPressStop = () => {
    setCanPressBackdrop(false);
    alertModal({
      mainText: `「${talkTicket.worry.label}」の話し相手の検索を停止します。`,
      subText: "今までのトーク内容は端末から削除されます。",
      cancelButton: "キャンセル",
      okButton: "停止する",
      onPress: () => {
        logEvent(
          "stop_talk_button",
          {
            job: profileState.profile?.job?.label,
          },
          profileState
        );
        setIsShowSpinner(true);
        request({
          data: {
            is_speaker: isSpeaker,
            ...(isSecretGender
              ? {}
              : { can_talk_heterosexual: canTalkHeterosexual }),
            ...(isSecretJob
              ? {}
              : { can_talk_different_job: canTalkDifferentJob }),
            status: "stopping",
          },
        });
      },
      cancelOnPress: () => setCanPressBackdrop(true),
    });
  };

  const onPressShuffle = () => {
    setCanPressBackdrop(false);
    const jobSubText = canTalkDifferentJob
      ? "全ての職業を許可"
      : `話し相手を${profileState.profile.job?.label}に絞る`;

    const genderSubText = canTalkHeterosexual
      ? "話し相手に異性を含む"
      : "話し相手を同性に絞る";
    alertModal({
      mainText: `以下の条件で「${talkTicket.worry.label}」の話し相手を探します。`,
      subText: `\n・${isSpeaker ? "話したい" : "聞きたい"}\n${
        isSecretJob ? "" : `・${jobSubText}\n`
      }${
        isSecretGender ? "" : `・${genderSubText}\n`
      }\n今までのトーク内容は端末から削除されます。`,
      cancelButton: "キャンセル",
      okButton: "探す",
      onPress: () => {
        logEvent(
          "shuffle_talk_button",
          {
            is_speaker: isSpeaker,
            ...(isSecretGender
              ? {}
              : { can_talk_heterosexual: canTalkHeterosexual }),
            ...(isSecretJob
              ? {}
              : { can_talk_different_job: canTalkDifferentJob }),
          },
          profileState
        );
        setIsShowSpinner(true);
        request({
          data: {
            is_speaker: isSpeaker,
            can_talk_heterosexual: canTalkHeterosexual,
            can_talk_different_job: canTalkDifferentJob,
            status: "waiting",
          },
        });
      },
      cancelOnPress: () => setCanPressBackdrop(true),
    });
  };

  const closeChatModal = () => {
    setIsOpen && setIsOpen(false);
    setCanPressBackdrop(true);
    setIsOpenEndTalk(false);
  };

  return {
    canTalkHeterosexual,
    setCanTalkHeterosexual,
    canTalkDifferentJob,
    setCanTalkDifferentJob,
    isSpeaker,
    setIsSpeaker,
    isShowSpinner,
    setIsShowSpinner,
    isOpenEndTalk,
    setIsOpenEndTalk,
    canPressBackdrop,
    setCanPressBackdrop,
    onPressStop,
    onPressShuffle,
    closeChatModal,
    isSecretJob,
    isSecretGender,
    roomId,
  };
};

export default useShuffle;

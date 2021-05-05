import { BASE_URL } from "src/constants/env";
import { useChatDispatch, useChatState } from "src/contexts/ChatContext";
import { useAxios } from "src/hooks/useAxios";
import { URLJoin } from "src/utils";
import {
  GenreOfWorries,
  ProfileParams,
  TokenNullable,
  WorriesResJson,
  WorriesResJsonIoTs,
} from "src/types/Types.context";

/**
 * 悩みのジャンルとして「悩み相談」・「ただ話したい」をPOST
 */
const usePostWorry = (
  _token: TokenNullable
): {
  requestPostWorry: (profileParams: ProfileParams) => void;
  genePostWorryData: (
    profileParams: ProfileParams
  ) => { genre_of_worries: GenreOfWorries };
} => {
  const chatDispatch = useChatDispatch();
  const chatState = useChatState();
  const targetWorryValues = ["just_want_to_talk", "worry"];

  const { request } = useAxios(
    URLJoin(BASE_URL, "me/worries/"),
    "post",
    WorriesResJsonIoTs,
    {
      thenCallback: (resData) => {
        const _resData = resData as WorriesResJson;
        const addedTalkTickets = _resData["addedTalkTickets"];
        const removedTalkTicketKeys = _resData["removedTalkTicketKeys"];
        // 追加
        addedTalkTickets.forEach((talkTicket) => {
          chatDispatch({ type: "OVERWRITE_TALK_TICKET", talkTicket });
        });
        // 削除
        chatDispatch({
          type: "REMOVE_TALK_TICKETS",
          talkTicketKeys: removedTalkTicketKeys,
        });
      },
      finallyCallback: () => {
        chatDispatch({ type: "TURN_OFF_DELAY" });
      },
      didRequestCallback: () => {
        // この後のchatDispatchを遅延する(同時にマッチしていた場合はSTART_TALKが遅延される)
        chatDispatch({
          type: "TURN_ON_DELAY",
          excludeType: ["OVERWRITE_TALK_TICKET"],
        });
      },
      token: _token ? _token : "",
      limitRequest: 1,
    }
  );

  const genePostWorryData = (
    profileParams: ProfileParams
  ): { genre_of_worries: GenreOfWorries } => {
    const dataWorries = Object.values(profileParams.genreOfWorries).filter(
      (worry) => {
        return targetWorryValues.includes(worry.value);
      }
    );

    return { genre_of_worries: dataWorries };
  };

  const requestPostWorry = (profileParams: ProfileParams) => {
    const isAlreadyPost =
      Object.keys(chatState.talkTicketCollection).length ===
        targetWorryValues.length &&
      Object.values(chatState.talkTicketCollection).every((talkTicket) => {
        return targetWorryValues.includes(talkTicket.worry.value);
      });
    if (!isAlreadyPost) {
      const postWorryData = genePostWorryData(profileParams);
      request({ data: postWorryData });
    }
  };

  return { requestPostWorry, genePostWorryData };
};

export default usePostWorry;

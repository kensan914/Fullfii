import { BASE_URL } from "src/constants/env";
import { useAuthState } from "src/contexts/AuthContext";
import { useAxios } from "src/hooks/useAxios";
import { Request } from "src/types/Types";
import { TalkInfoJson, TalkInfoJsonIoTs } from "src/types/Types.context";
import { URLJoin } from "src/utils";

type UseRequestTalkInfo = (
  additionalThenCallback?: (talkInfoJson: TalkInfoJson) => void
) => {
  requestGetTalkInfo: Request;
};
/** talk infoをGETリクエストすること飲み責務を持つので、その情報を用いてなにかする場合はadditionalThenCallbackで実行
 *
 */
export const useRequestGetTalkInfo: UseRequestTalkInfo = (
  additionalThenCallback
) => {
  const authState = useAuthState();

  const { request: requestGetTalkInfo } = useAxios(
    URLJoin(BASE_URL, "me/talk-info/"),
    "get",
    TalkInfoJsonIoTs,
    {
      token: authState.token ? authState.token : "",
      thenCallback: (resData) => {
        const talkInfoJson = resData as TalkInfoJson;

        additionalThenCallback && additionalThenCallback(talkInfoJson);
      },
    }
  );

  return { requestGetTalkInfo };
};

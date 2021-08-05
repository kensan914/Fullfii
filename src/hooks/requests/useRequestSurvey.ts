import { BASE_URL } from "src/constants/env";
import { useAuthState } from "src/contexts/AuthContext";
import { useAxios } from "src/hooks/useAxios";
import { Request } from "src/types/Types";
import { URLJoin } from "src/utils";

type UseRequestSurveyDissatisfaction = (
  contents: string,
  additionalThenCallback?: () => void,
  additionalFinallyCallback?: () => void
) => {
  requestPostSurveyDissatisfaction: Request;
  isLoadingPostSurveyDissatisfaction: boolean;
};
export const useRequestSurveyDissatisfaction: UseRequestSurveyDissatisfaction =
  (contents, additionalThenCallback, additionalFinallyCallback) => {
    const authState = useAuthState();

    const {
      request: requestPostSurveyDissatisfaction,
      isLoading: isLoadingPostSurveyDissatisfaction,
    } = useAxios(URLJoin(BASE_URL, "survey/dissatisfaction/"), "post", null, {
      data: { contents: contents },
      token: authState.token ? authState.token : "",
      thenCallback: () => {
        additionalThenCallback && additionalThenCallback();
      },
      finallyCallback: () => {
        additionalFinallyCallback && additionalFinallyCallback();
      },
    });

    return {
      requestPostSurveyDissatisfaction,
      isLoadingPostSurveyDissatisfaction,
    };
  };

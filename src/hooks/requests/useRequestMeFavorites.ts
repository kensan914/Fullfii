import { BASE_URL } from "src/constants/env";
import { useAuthState } from "src/contexts/AuthContext";
import { Request } from "src/types/Types";
import { URLJoin } from "src/utils";
import { useAxios } from "src/hooks/useAxios";
import { AxiosError } from "axios";

type UseRequestPatchMeFavoritesUsers = (
  userId: string | undefined,
  additionalThenCallback?: () => void,
  additionalCatchCallback?: (err: AxiosError) => void
) => {
  requestPatchMeFavoritesUsers: Request;
  isLoadingPatchMeFavoritesUsers: boolean;
};
export const useRequestPatchMeFavoritesUsers: UseRequestPatchMeFavoritesUsers =
  (userId, additionalThenCallback, additionalCatchCallback) => {
    const authState = useAuthState();

    const {
      request: requestPatchMeFavoritesUsers,
      isLoading: isLoadingPatchMeFavoritesUsers,
    } = useAxios(URLJoin(BASE_URL, "me/favorites/users/"), "patch", null, {
      token: authState.token ? authState.token : "",
      data: { user_id: userId },
      thenCallback: () => {
        additionalThenCallback && additionalThenCallback();
      },
      catchCallback: (err) => {
        additionalCatchCallback && err && additionalCatchCallback(err);
      },
    });

    return { requestPatchMeFavoritesUsers, isLoadingPatchMeFavoritesUsers };
  };

type UseRequestDeleteMeFavoritesUsers = (
  userId: string | undefined,
  additionalThenCallback?: () => void,
  additionalCatchCallback?: (err: AxiosError) => void
) => {
  requestDeleteMeFavoritesUsers: Request;
  isLoadingDeleteMeFavoritesUsers: boolean;
};
export const useRequestDeleteMeFavoritesUsers: UseRequestDeleteMeFavoritesUsers =
  (userId, additionalThenCallback, additionalCatchCallback) => {
    const authState = useAuthState();

    const {
      request: requestDeleteMeFavoritesUsers,
      isLoading: isLoadingDeleteMeFavoritesUsers,
    } = useAxios(
      URLJoin(BASE_URL, "me/favorites/users/", userId),
      "delete",
      null,
      {
        token: authState.token ? authState.token : "",
        thenCallback: () => {
          additionalThenCallback && additionalThenCallback();
        },
        catchCallback: (err) => {
          additionalCatchCallback && err && additionalCatchCallback(err);
        },
      }
    );

    return { requestDeleteMeFavoritesUsers, isLoadingDeleteMeFavoritesUsers };
  };

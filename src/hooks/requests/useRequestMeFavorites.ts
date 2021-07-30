import { AxiosError } from "axios";

import { BASE_URL } from "src/constants/env";
import { useAuthState } from "src/contexts/AuthContext";
import {
  DeleteFavoriteUserResData,
  DeleteFavoriteUserResDataIoTs,
  Request,
} from "src/types/Types";
import { URLJoin } from "src/utils";
import requestAxios, { useAxios } from "src/hooks/useAxios";
import { ChatDispatch, TokenNullable } from "src/types/Types.context";
import { useChatDispatch } from "src/contexts/ChatContext";

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
    const chatDispatch = useChatDispatch();

    const {
      request: requestPatchMeFavoritesUsers,
      isLoading: isLoadingPatchMeFavoritesUsers,
    } = useAxios(URLJoin(BASE_URL, "me/favorites/users/"), "patch", null, {
      token: authState.token ? authState.token : "",
      data: { user_id: userId },
      thenCallback: () => {
        chatDispatch({
          type: "SET_HAS_FAVORITE_USER",
          hasFavoriteUser: true,
        });
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
    const chatDispatch = useChatDispatch();

    const {
      request: requestDeleteMeFavoritesUsers,
      isLoading: isLoadingDeleteMeFavoritesUsers,
    } = useAxios(
      URLJoin(BASE_URL, "me/favorites/users/", userId),
      "delete",
      DeleteFavoriteUserResDataIoTs,
      {
        token: authState.token ? authState.token : "",
        thenCallback: (_resData) => {
          const resData = _resData as DeleteFavoriteUserResData;
          chatDispatch({
            type: "SET_HAS_FAVORITE_USER",
            hasFavoriteUser: resData.hasFavoriteUser,
          });
          additionalThenCallback && additionalThenCallback();
        },
        catchCallback: (err) => {
          additionalCatchCallback && err && additionalCatchCallback(err);
        },
      }
    );

    return { requestDeleteMeFavoritesUsers, isLoadingDeleteMeFavoritesUsers };
  };

export const requestDeleteMeFavoritesUsers = (
  userId: string | undefined,
  token: TokenNullable,
  chatDispatch: ChatDispatch,
  additionalThenCallback?: () => void,
  additionalCatchCallback?: (err: AxiosError) => void
): void => {
  requestAxios(
    URLJoin(BASE_URL, "me/favorites/users/", userId),
    "delete",
    null,
    {
      token: token ? token : "",
      thenCallback: (_resData) => {
        const resData = _resData as DeleteFavoriteUserResData;
        chatDispatch({
          type: "SET_HAS_FAVORITE_USER",
          hasFavoriteUser: resData.hasFavoriteUser,
        });
        additionalThenCallback && additionalThenCallback();
      },
      catchCallback: (err) => {
        additionalCatchCallback && err && additionalCatchCallback(err);
      },
    }
  );
};

import React, { useState } from "react";

import { dangerouslyDelete } from "src/utils/auth/crud";
import { useAxios } from "src/hooks/useAxios";
import { URLJoin } from "src/utils";
import { FormTemplate } from "src/components/templates/FormTemplate";
import { BASE_URL } from "src/constants/env";
import { useAllContext } from "src/contexts/ContextUtils";
import { alertModal } from "src/utils/customModules";

export const AccountDeleteScreen: React.FC = () => {
  const [deleteReason, setDeleteReason] = useState("");

  const [states, dispatches] = useAllContext();
  const authState = states.authState;

  const {
    isLoading: isLoadingPostSurveyAccountDelete,
    request: requestPostSurveyAccountDelete,
  } = useAxios(URLJoin(BASE_URL, "survey/account-delete/"), "post", null, {
    data: { reason: deleteReason },
    thenCallback: (resData, res) => {
      if (res.status === 201) {
        requestDeleteMe();
      }
    },
    catchCallback: (err) => {
      console.log(err);
    },
    token: authState?.token ? authState?.token : "",
  });

  const { isLoading: isLoadingDeleteMe, request: requestDeleteMe } = useAxios(
    URLJoin(BASE_URL, "me/"),
    "delete",
    null,
    {
      data: { reason: deleteReason },
      thenCallback: async (resData, res) => {
        if (res.status === 204) {
          // async storage削除
          await dangerouslyDelete(dispatches, ["status"]);
          dispatches.authDispatch({ type: "DELETE_ACCOUNT" });
        }
      },
      token: authState?.token ? authState?.token : "",
    }
  );

  const onSubmit = () => {
    const finalVerification = () => {
      alertModal({
        mainText: "本当に削除してもよろしいですか？",
        subText: "一度削除したアカウントは元に戻すことができません。",
        cancelButton: "キャンセル",
        okButton: "アカウントを完全に削除する",
        okButtonStyle: "destructive",
        onPress: () => {
          requestPostSurveyAccountDelete();
        },
      });
    };

    alertModal({
      mainText: "アカウントを削除します",
      subText:
        "アカウントを削除すると、端末上からアカウントのすべての情報が削除され、元に戻すことができません。アカウントを削除しますか？",
      cancelButton: "キャンセル",
      okButton: "削除する",
      okButtonStyle: "destructive",
      onPress: () => {
        finalVerification();
      },
    });
  };

  return (
    <FormTemplate
      forms={[
        {
          type: "INPUT_TEXTAREA",
          value: deleteReason,
          setValue: setDeleteReason,
          maxLength: 500,
          title:
            "ご希望に添えず申し訳ございません。アカウント削除のきっかけとなる不満点を教えていただけませんか？",
        },
      ]}
      submitSettings={{
        label: "削除する",
        onSubmit: onSubmit,
        canSubmit: deleteReason.length > 0,
        isLoading: isLoadingPostSurveyAccountDelete || isLoadingDeleteMe,
      }}
    />
  );
};

import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Block, theme } from "galio-framework";
import { useNavigation } from "@react-navigation/native";

import { SubmitButton } from "src/components/atoms/SubmitButton";
import {
  ErrorSubmitProfile,
  ProfileInputData,
  ProfileInputScreen,
  SuccessSubmitProfile,
  ProfileInputNavigationProps,
} from "src/types/Types";
import { width } from "src/constants";
import {
  useRequestPatchMe,
  useRequestPutGender,
} from "src/hooks/requests/useRequestMe";

type SubmitProfileButtonProps = {
  screen: ProfileInputScreen;
  value: unknown;
  canSubmit: boolean;
  setValidationText: React.Dispatch<string>;
};
export const ProfileSubmitButton: React.FC<SubmitProfileButtonProps> = (
  props
) => {
  const { screen, value, canSubmit, setValidationText } = props;

  const navigation = useNavigation<ProfileInputNavigationProps>();

  const [isLoading, setIsLoading] = useState(false);

  const onSuccessSubmit: SuccessSubmitProfile = () => {
    setIsLoading(false);
    navigation.goBack();
  };

  const onErrorSubmit: ErrorSubmitProfile = (err) => {
    setValidationText(err.response && err.response.data.name);
    setIsLoading(false);
  };

  const { requestPatchMe } = useRequestPatchMe(onSuccessSubmit, onErrorSubmit);
  const { requestPutGender } = useRequestPutGender(
    typeof value === "string" ? value : "",
    onSuccessSubmit,
    onErrorSubmit
  );

  const submit = () => {
    setIsLoading(true);

    if (screen === "InputGender") {
      requestPutGender();
    } else {
      let data: ProfileInputData = {};
      if (screen === "InputName") {
        data = { name: value };
      } else if (screen === "InputIsPrivateProfile") {
        data = { is_private_profile: value };
      }

      requestPatchMe({ data: data });
    }
  };

  return (
    <Block style={styles.submitButtonWrapper}>
      <SubmitButton
        style={styles.submitButton}
        canSubmit={canSubmit}
        isLoading={isLoading}
        submit={submit}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  submitButtonWrapper: {
    position: "absolute",
    alignSelf: "center",
    bottom: theme.SIZES.BASE * 2,
  },
  submitButton: {
    width: width - 30,
  },
});

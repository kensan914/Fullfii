import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";

import { ProfileInputTemplate } from "src/components/templates/ProfileInputTemplate";
import { ProfileInputRouteProp } from "src/types/Types";

export const ProfileInputScreen: React.FC = () => {
  const route = useRoute<ProfileInputRouteProp>();
  const { prevValue, screen: profileInputScreen } = route.params;

  const [value, setValue] = useState(prevValue);
  const [canSubmit, setCanSubmit] = useState(false);
  const [validationText, setValidationText] = useState("");

  return (
    <ProfileInputTemplate
      value={value}
      setValue={setValue}
      prevValue={prevValue}
      canSubmit={canSubmit}
      setCanSubmit={setCanSubmit}
      validationText={validationText}
      setValidationText={setValidationText}
      profileInputScreen={profileInputScreen}
    />
  );
};

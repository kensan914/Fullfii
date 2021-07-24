import React, { Dispatch } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Block, theme, Text } from "galio-framework";

import { InputBlock } from "src/components/templates/ProfileInputTemplate/organisms/ProfileInputBlock";
import { ProfileInputScreen } from "src/types/Types";
import { ProfileSubmitButton } from "src/components/templates/ProfileInputTemplate/organisms/ProfileSubmitButton";
import { COLORS } from "src/constants/theme";

type Props = {
  value: unknown;
  setValue: Dispatch<unknown>;
  prevValue: unknown;
  canSubmit: boolean;
  setCanSubmit: Dispatch<boolean>;
  validationText: string;
  setValidationText: Dispatch<string>;
  profileInputScreen: ProfileInputScreen;
};
export const ProfileInputTemplate: React.FC<Props> = (props) => {
  const {
    value,
    setValue,
    prevValue,
    canSubmit,
    setCanSubmit,
    validationText,
    setValidationText,
    profileInputScreen,
  } = props;

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <Block style={styles.container}>
          <InputBlock
            screen={profileInputScreen}
            prevValue={prevValue}
            setCanSubmit={setCanSubmit}
            value={value}
            setValue={setValue}
          />
          <Text
            color="red"
            style={{ paddingHorizontal: 10, paddingVertical: 3 }}
          >
            {validationText}
          </Text>
        </Block>
      </ScrollView>
      <ProfileSubmitButton
        screen={profileInputScreen}
        value={value}
        canSubmit={canSubmit}
        setValidationText={setValidationText}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLORS.BEIGE,
  },
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE * 5,
  },
});

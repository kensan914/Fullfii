import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, Switch } from "react-native";
import { Block, Input, Text,  } from "galio-framework";

import {
  FormattedGender,
  FormattedGenderKey,
  ProfileInputScreen,
} from "src/types/Types";
import { useProfileState } from "src/contexts/ProfileContext";
import { formatGender } from "src/utils";
import { GenderInputButtonList } from "src/components/molecules/GenderInputButtonList";
import { GenderKey } from "src/types/Types.context";
import { COLORS } from "src/constants/theme";

type InputBlockProps = {
  screen: ProfileInputScreen;
  prevValue: unknown;
  setCanSubmit: React.Dispatch<boolean>;
  value: unknown;
  setValue: React.Dispatch<unknown>;
};
export const InputBlock: React.FC<InputBlockProps> = (props) => {
  const { screen, prevValue, value, setCanSubmit, setValue } = props;

  const me = useProfileState().profile;
  let maxLength;

  switch (screen) {
    case "InputName":
      maxLength = 15;
      if (typeof value === "string" && typeof prevValue === "string")
        return (
          <TextInputBlock
            maxLength={maxLength}
            value={value}
            prevValue={prevValue}
            setCanSubmit={setCanSubmit}
            setValue={setValue}
          />
        );
      else return <></>;

    case "InputGender":
      return (
        // <GenderInputBlock
        //   value={value as FormattedGenderKey}
        //   prevValue={prevValue as FormattedGenderKey}
        //   setCanSubmit={setCanSubmit}
        //   setValue={setValue}
        //   formattedGender={formatGender(me.gender, me.isSecretGender)}
        // />
        <SwitchPublicDomain/>
      );

    case "InputIntroduction":
      maxLength = 250;
      if (typeof value === "string" && typeof prevValue === "string")
        return (
          <TextInputBlock
            isTextarea
            maxLength={maxLength}
            value={value}
            prevValue={prevValue}
            setCanSubmit={setCanSubmit}
            setValue={setValue}
          />
        );
      else return <></>;
    default:
      return <></>;
  }
};

const SwitchPublicDomain = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(!isEnabled);
  return(
    <Block>
      <Block row space="between" style={styles.switchContainer}>
        <Text size={14} color={COLORS.BLACK}>公開</Text>
        <Switch
        trackColor={{ false: COLORS.HIGHLIGHT_GRAY, true: COLORS.PINK}}
        ios_backgroundColor={COLORS.HIGHLIGHT_GRAY}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      </Block>
        <Text size={12} color={COLORS.BLACK} style={styles.explainSwitch}>
        「公開しない」に設定する場合、他ユーザーはあなたの名前、性別、職業、写真のみ閲覧することができます{"\n"}
        「公開する」に設定する場合、他ユーザーはあなたのプロフィール情報全てを閲覧することができます
        </Text>
    </Block>
  )
}


type GenderInputBlockProps = {
  prevValue: FormattedGenderKey;
  value: FormattedGenderKey;
  setValue: React.Dispatch<GenderKey | FormattedGenderKey | undefined>;
  setCanSubmit: React.Dispatch<boolean>;
  formattedGender: FormattedGender;
};
const GenderInputBlock: React.FC<GenderInputBlockProps> = (props) => {
  const { prevValue, value, setValue, setCanSubmit, formattedGender } = props;

  useEffect(() => {
    setCanSubmit(prevValue !== value);
  }, [value]);

  const femaleMaleKeys: FormattedGenderKey[] = ["female", "male"];
  let genderKeys: FormattedGenderKey[] = [];
  const realGenderKey = formattedGender.realGenderKey;
  if (!formattedGender.isNotSet && realGenderKey !== "notset") {
    genderKeys = [realGenderKey, "secret"];
  } else {
    genderKeys = [...femaleMaleKeys, "secret"];
  }

  return (
    <Block style={styles.genderInputButtonListContainer}>
      {/* expected genderKeys=[("female"), ("male"), "secret"] */}
      <GenderInputButtonList
        genderKeys={genderKeys}
        genderKey={value}
        setGenderKey={setValue}
      />
    </Block>
  );
};

type TextInputBlockProps = {
  maxLength: number;
  isTextarea?: boolean;
  prevValue: string;
  setCanSubmit: React.Dispatch<boolean>;
  value: string;
  setValue: React.Dispatch<string>;
};
const TextInputBlock: React.FC<TextInputBlockProps> = (props) => {
  const { maxLength, isTextarea, prevValue, setCanSubmit, value, setValue } =
    props;

  const [length, setLength] = useState(prevValue.length);
  useEffect(() => {
    setLength(value.length);
    setCanSubmit(prevValue !== value);
  }, [value]);

  let input;
  if (isTextarea && typeof value === "string") {
    input = (
      <TextInput
        multiline
        numberOfLines={4}
        editable
        style={{
          height: 350,
          borderColor: "silver",
          borderWidth: 1,
          padding: 10,
          marginVertical: 10,
          borderRadius: 10,
          backgroundColor: COLORS.WHITE,
          textAlignVertical: "top",
        }}
        maxLength={maxLength}
        value={value}
        placeholder="（例）最近結婚して専業主婦になったのですが、夫の転勤で地方で新しく暮らすことになり、周りに悩みを話せる人がいないです...友達はみんな働いているので気楽に電話もできません。どなたか雑談程度で話せる方いないでしょうか？？"
        onChangeText={(text) => setValue(text)}
      />
    );
  } else {
    input = (
      <Input
        placeholder={""}
        rounded
        color={COLORS.BLACK}
        style={{ borderColor: "silver", backgroundColor: COLORS.WHITE }}
        placeholderTextColor="gray"
        maxLength={maxLength}
        value={value}
        onChangeText={(text: string) => setValue(text)}
      />
    );
  }

  return (
    <>
      <Block flex style={{ alignItems: "flex-end", marginRight: 10 }}>
        <Text color={COLORS.GRAY}>
          {length.toString()}/{maxLength}
        </Text>
      </Block>
      {input}
    </>
  );
};

const styles = StyleSheet.create({
  genderInputButtonListContainer: {
    marginTop: 30,
  },
  switchContainer: {
    alignItems: "center",
    height: 48,
  },
  explainSwitch:{
    lineHeight: 16,
    marginTop: 16
  }
});

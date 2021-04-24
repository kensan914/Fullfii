import React from "react";
import { Block, theme } from "galio-framework";

import { Forms, SubmitSettings } from "../types/Types";
import SubmitButton from "../atoms/SubmitButton";
import { ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { width } from "../../constants";

type Props = {
  forms: Forms;
  submitSettings: SubmitSettings;
};
const FormTemplate: React.FC<Props> = (props) => {
  const { forms, submitSettings } = props;
  return (
    <>
      <ScrollView style={styles.container}>
        {forms.map((form, i) => {
          switch (form.type) {
            case "INPUT_TEXTAREA":
              return (
                <React.Fragment key={i}>
                  {form.title && (
                    <Text style={styles.formTitle}>{form.title}</Text>
                  )}
                  <TextInput
                    multiline
                    numberOfLines={4}
                    editable
                    style={{
                      height: 150,
                      borderColor: "silver",
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: "white",
                    }}
                    maxLength={form.maxLength ? form.maxLength : void 0}
                    value={form.value}
                    placeholder=""
                    onChangeText={form.setValue}
                  />
                </React.Fragment>
              );
          }
        })}
      </ScrollView>
      <Block style={styles.submitButtonWrapper}>
        <SubmitButton
          style={styles.submitButton}
          canSubmit={
            typeof submitSettings.canSubmit !== "undefined"
              ? submitSettings.canSubmit
              : true
          }
          isLoading={
            typeof submitSettings.isLoading !== "undefined"
              ? submitSettings.isLoading
              : false
          }
          submit={submitSettings.onSubmit}
        >
          {submitSettings.label}
        </SubmitButton>
      </Block>
    </>
  );
};

export default FormTemplate;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  submitButtonWrapper: {
    position: "absolute",
    alignSelf: "center",
    bottom: theme.SIZES.BASE * 2,
  },
  submitButton: {
    width: width - 30,
  },
  formTitle: {
    color: "dimgray",
    paddingHorizontal: 4,
    marginBottom: 10,
  },
});

import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "galio-framework";

type Props = {
  onTransitionProfileEditor: () => void;
};
export const ProfileTemplate: React.FC<Props> = (props) => {
  const { onTransitionProfileEditor } = props;
  return <Button onPress={onTransitionProfileEditor}>プロフィール編集</Button>;
};

const styles = StyleSheet.create({});

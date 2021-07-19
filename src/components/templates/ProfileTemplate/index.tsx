import React from "react";
import { Button} from "galio-framework";
import { StyleSheet } from "react-native";


type Props = {
  onTransitionProfileEditor: () => void;
};
export const ProfileTemplate: React.FC<Props> = (props) => {
  const { onTransitionProfileEditor } = props;
  return <Button onPress={onTransitionProfileEditor}>プロフィール編集</Button>;
};

const styles = StyleSheet.create({});

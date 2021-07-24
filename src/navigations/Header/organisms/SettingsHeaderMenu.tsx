import React from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, ViewStyle } from "react-native";

import { Icon } from "src/components/atoms/Icon";
import { COLORS } from "src/constants/colors";

export const SettingsHeaderMenu: React.FC<{ style?: ViewStyle }> = (props) => {
  const { style } = props;

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[style]}
      onPress={() => navigation.navigate("Settings")}
    >
      <Icon family="AntDesign" size={32} name="setting" color={COLORS.BROWN} />
    </TouchableOpacity>
  );
};

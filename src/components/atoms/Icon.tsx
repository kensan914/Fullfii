import React from "react";
import { Icon as _Icon } from "galio-framework";
import { ViewStyle } from "react-native";

type Props = {
  family?: string;
  name?: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
};
/**
 * 【family】
 *    - Ionicons: "ionicon"
 *    - MaterialIcon: "material"
 *    - MaterialCommunityIcon: "material-community"
 */
export const Icon: React.FC<Props> = (props) => {
  const { name = "", family = "font-awesome", ...rest } = props;

  return <_Icon name={name} family={family} {...rest} />;
};

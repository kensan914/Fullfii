import React from "react";
import { Block } from "galio-framework";
import { ViewStyle } from "react-native";

type Props = {
  h: number;
  mb?: number;
  mt?: number;
  color?: string;
  style?: ViewStyle;
};
/**
 * @example
 * <Hr h={1} mb={7} mt={4} color="gainsboro" style={{ }} />
 */
export const Hr: React.FC<Props> = (props) => {
  const { h, mb, mt, color, style } = props;

  return (
    <Block
      style={[
        {
          height: h,
          marginBottom: mb,
          marginTop: mt,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
};

import React from "react";
import { Platform } from "react-native";
import _SvgUri from "react-native-svg-uri";

type Props = {
  width: number;
  height: number;
  source: any;
  fill?: string;
};
/**https://saachitech.medium.com/react-native-svg-android-e60d4aab1b42 */
export const SvgUri: React.FC<Props> = (props) => {
  const { width, height, source, fill } = props;

  if (Platform.OS === "android") {
    const SVG = source;
    return <SVG width={width} height={height} fill={fill} />;
  } else {
    return (
      <_SvgUri width={width} height={height} source={source} fill={fill} />
    );
  }
};

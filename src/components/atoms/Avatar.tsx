import React from "react";
import { Block } from "galio-framework";
import { Image, ImageStyle, StyleSheet } from "react-native";

import { Icon } from "src/components/atoms/Icon";
import { COLORS } from "src/constants/colors";

type Props = {
  size: number;
  hasBorder?: boolean;
  style?: ImageStyle;
  imageUri?: string | null;
};
export const Avatar: React.FC<Props> = (props) => {
  const { size, hasBorder, style, imageUri } = props;
  const avatarStyle = {
    height: size,
    width: size,
    borderRadius: size / 2,
  };

  if (!imageUri) {
    return (
      <Block
        style={[
          avatarStyle,
          style,
          {
            alignSelf: "center",
            justifyContent: "center",
            backgroundColor: "darkgray",
          },
        ]}
      >
        <Icon
          family="font-awesome"
          size={size}
          name="user-circle-o"
          color="whitesmoke"
        />
      </Block>
    );
  } else if (hasBorder) {
    const additionalSize = 10;
    return (
      <Block
        style={[
          styles.avatarContainer,
          {
            height: size + additionalSize,
            width: size + additionalSize,
            borderRadius: (size + additionalSize) / 2,
          },
        ]}
      >
        <Image source={{ uri: imageUri }} style={[avatarStyle, style]} />
      </Block>
    );
  } else {
    return <Image source={{ uri: imageUri }} style={[avatarStyle, style]} />;
  }
};

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: COLORS.WHITE,
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});

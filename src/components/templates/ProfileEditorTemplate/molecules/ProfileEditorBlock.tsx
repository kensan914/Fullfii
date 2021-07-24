import React, { ReactElement } from "react";
import { StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Block } from "galio-framework";

import { Icon } from "src/components/atoms/Icon";
import { width } from "src/constants";

type Props = {
  onPress: () => void;
  title?: ReactElement;
  content: ReactElement;
  isImage?: boolean;
  isLoadingImage?: boolean;
};
export const ProfileEditorBlock: React.FC<Props> = (props) => {
  const { onPress, title, content, isImage, isLoadingImage } = props;
  return isImage ? (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{ flex: 1, width: "100%" }}
    >
      <Block style={{ zIndex: -1 /* Androidで下記のiconが下に行くため */ }}>
        {content}
      </Block>
      <Block
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {isLoadingImage ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <Icon name="camera" family="font-awesome" color="white" size={40} />
        )}
      </Block>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={onPress} style={{ flex: 1, width: width - 32 }}>
      <Block row space="between" style={styles.editContainer}>
        <Block>{title}</Block>
        <Block row center>
          {content}
          <Block style={styles.angleIcon} center>
            <Icon
              name="angle-right"
              family="font-awesome"
              color="gray"
              size={24}
            />
          </Block>
        </Block>
      </Block>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  editContainer: {
    alignItems: "center",
  },
  angleIcon: {
    height: 24,
    width: 24,
    marginLeft: 8,
  },
});

import React, { ReactNode } from "react";
import { Text, Block } from "galio-framework";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

import { COLORS } from "src/constants/colors";
import { GenderKey } from "src/types/Types.context";
import { FormattedGenderKey } from "src/types/Types";
import { width } from "src/constants";
import { Icon } from "../atoms/Icon";

type GenderInputButtonListProps = {
  genderKeys: (GenderKey | FormattedGenderKey)[];
  genderKey: GenderKey | FormattedGenderKey | undefined;
  setGenderKey: React.Dispatch<GenderKey | FormattedGenderKey | undefined>;
  renderItem?: (label: string, isSelected: boolean) => ReactNode;
  style?: ViewStyle;
};
export const GenderInputButtonList: React.FC<GenderInputButtonListProps> = (
  props
) => {
  const { genderKeys, genderKey, setGenderKey, renderItem, style } = props;

  return (
    <Block flex justifyContent="center" style={style}>
      <Block flex style={styles.genderInputContainer}>
        {genderKeys.map((_genderKey, i) => {
          const isActive = genderKey === _genderKey;
          const contentsColor = isActive ? COLORS.BROWN : "lightgray";
          const shadowColor = isActive ? COLORS.BROWN : COLORS.WHITE;
          const genderAddInfo: {
            [key: string]: { iconName: string; title: string };
          } = {
            female: { iconName: "female", title: "女性" },
            male: { iconName: "male", title: "男性" },
            notset: { iconName: "lock", title: "内緒" },
            secret: { iconName: "lock", title: "内緒" },
          };
          return (
            <Block key={i} flex style={styles.genderInput}>
              <TouchableOpacity
                onPress={() => {
                  setGenderKey(_genderKey);
                }}
                activeOpacity={0.7}
              >
                {renderItem ? (
                  renderItem(
                    _genderKey in genderAddInfo
                      ? genderAddInfo[_genderKey].title
                      : "",
                    isActive
                  )
                ) : (
                  <Block
                    style={[
                      styles.genderInputButton,
                      {
                        shadowColor: shadowColor,
                        shadowOpacity: isActive ? 1.0 : 0,
                      },
                    ]}
                  >
                    <Icon
                      family="font-awesome"
                      size={50}
                      name={
                        _genderKey in genderAddInfo
                          ? genderAddInfo[_genderKey].iconName
                          : ""
                      }
                      color={contentsColor}
                    />
                    <Text
                      bold
                      size={12}
                      color={contentsColor}
                      style={{ marginTop: 4 }}
                    >
                      {_genderKey in genderAddInfo
                        ? genderAddInfo[_genderKey].title
                        : ""}
                    </Text>
                  </Block>
                )}
              </TouchableOpacity>
            </Block>
          );
        })}
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  genderInputContainer: {
    flexDirection: "row",
  },
  genderInput: {
    justifyContent: "center",
    alignItems: "center",
  },
  genderInputButton: {
    width: width / 4,
    height: width / 4,
    borderRadius: width / 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1.0,
  },
});

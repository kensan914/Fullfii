import React, { Dispatch } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

import { Icon } from "src/components/atoms/Icon";
import { COLORS } from "src/constants/colors";
import { FilterKey } from "src/navigations/Header/organisms/FilterHeaderMenu/useFilterRoom";
import { showActionSheet } from "src/utils/customModules";

type Props = {
  filterKey: FilterKey;
  setFilterKey: Dispatch<FilterKey>;
  style?: StyleProp<ViewStyle>;
};
export const FilterHeaderMenu: React.FC<Props> = (props) => {
  const { style, filterKey, setFilterKey } = props;

  const onPress = () => {
    showActionSheet([
      {
        label: "キャンセル",
        cancel: true,
      },
      {
        label: `${filterKey === "all" ? "✓  " : ""}全部`,
        onPress: () => {
          setFilterKey("all");
        },
      },
      {
        label: `${filterKey === "speak" ? "✓  " : ""}話したいのみ`,
        onPress: () => {
          setFilterKey("speak");
        },
      },
      {
        label: `${filterKey === "listen" ? "✓  " : ""}聞きたいのみ`,
        onPress: () => {
          setFilterKey("listen");
        },
      },
    ]);
  };

  return (
    <TouchableOpacity style={[style]} onPress={onPress}>
      <Icon family="ionicon" size={32} name="ios-filter" color={COLORS.BROWN} />
    </TouchableOpacity>
  );
};

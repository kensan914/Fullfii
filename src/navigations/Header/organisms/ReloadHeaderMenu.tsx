import React from "react";
import { TouchableOpacity } from "react-native";

import { Icon } from "src/components/atoms/Icon";
import { COLORS } from "src/constants/theme";
import { useDomDispatch } from "src/contexts/DomContext";

export const ReloadHeaderMenu: React.FC = () => {
  const domDispatch = useDomDispatch();

  return (
    <TouchableOpacity
      onPress={() => {
        domDispatch({ type: "SCHEDULE_TASK", taskKey: "refreshRooms" });
      }}
    >
      <Icon family="AntDesign" size={32} name="reload1" color={COLORS.BROWN} />
    </TouchableOpacity>
  );
};

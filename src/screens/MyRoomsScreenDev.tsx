import React, {useState} from "react";
import { MyRoomsTemplate } from "src/components/templates/MyRoomsTemplate";
import {COLORS} from "src/constants/theme"
import { HOME_IMG } from "src/constants/imagePath";

export const MyRoomsScreenDev: React.FC = () => {
  const [isOpenRoomEditorModal, setIsOpenRoomEditorModal] = useState(false)

  const item =
    {
      key: 1,
      title: "悩み相談ここここここここここここここここ悩み相談ここここここここここここここここ",
      image: HOME_IMG.a,
      avatar: null,
      userName: "杉浦夏帆",
      userGender: "女性",
      userJob: "高校生",
      joinNum: 1,
      maxNum: 1,
      maxed: true, //joinNum===maxNum ? true : false このプロパティはいらないかもしれない
      memberColor: COLORS.GREEN, //maxed ? COLORS.GREEN : COLORS.LIGHT_GRAY
      memberIconName: "person",
      // onPress: () => {},
      countNum: 1,
    }

  return <MyRoomsTemplate
  item={item}
  isOpenRoomEditorModal={isOpenRoomEditorModal}
  setIsOpenRoomEditorModal={setIsOpenRoomEditorModal}
  />;
};

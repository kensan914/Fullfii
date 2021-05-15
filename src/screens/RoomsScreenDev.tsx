import React, { useState } from "react";
import { RoomsTemplate } from "src/components/templates/RoomsTemplate";
import { COLORS } from "src/constants/theme";
import { HOME_IMG } from "src/constants/imagePath";

export const RoomsScreenDev: React.FC = () => {
  const [hiddenRooms, setHiddenRooms] = React.useState([]);
  const [isOpenRoomEditorModal, setIsOpenRoomEditorModal] = useState(false);

  const items = [
    {
      key: 1,
      title:
        "悩み相談ここここここここここここここここ悩み相談ここここここここここここここここ",
      image: HOME_IMG.a,
      avatar: "",
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
    },
    {
      key: 2,
      title: "この文章はダミーです。文字の大きさ、量、字間、行間等を確認す",
      image: HOME_IMG.b,
      avatar: "",
      userName: "ミッキー",
      userGender: "女性",
      userJob: "大学生",
      joinNum: 0,
      maxNum: 1,
      maxed: false, //joinNum===maxNum ? true : false このプロパティはいらないかもしれない
      memberColor: COLORS.LIGHT_GRAY, //maxed ? COLORS.GREEN : COLORS.LIGHT_GRAY
      memberIconName: "person-outline",
      // onPress: () => {},
      countNum: 2,
    },
    {
      key: 3,
      title: "最近の若者はどうかしてるぜ。全くどう思います？",
      image: HOME_IMG.c,
      avatar: "",
      userName: "頑固親父",
      userGender: "男性",
      userJob: "主婦",
      joinNum: 1,
      maxNum: 1,
      maxed: true, //joinNum===maxNum ? true : false このプロパティはいらないかもしれない
      memberColor: COLORS.GREEN, //maxed ? COLORS.GREEN : COLORS.LIGHT_GRAY
      memberIconName: "person",
      // onPress: () => {},
      countNum: 3,
    },
    {
      key: 4,
      title:
        "悩み相談ここここここここここここここここ悩み相談ここここここここここここここここ",
      image: HOME_IMG.a,
      avatar: "",
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
    },
  ];

  return (
    <RoomsTemplate
      items={items}
      hiddenRooms={hiddenRooms}
      setHiddenRooms={setHiddenRooms}
      isOpenRoomEditorModal={isOpenRoomEditorModal}
      setIsOpenRoomEditorModal={setIsOpenRoomEditorModal}
    />
  );
};

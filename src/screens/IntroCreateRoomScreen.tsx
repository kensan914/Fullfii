import React, { useState } from "react";

import { IntroCreateRoomTemplate } from "src/components/templates/IntroCreateRoomTemplate";
import { TOAST_SETTINGS } from "src/constants/alertMessages";
import { useAuthDispatch } from "src/contexts/AuthContext";
import { useRequestPostRoom } from "src/hooks/requests/useRequestRooms";
import { showToast } from "src/utils/customModules";

export const _IntroCreateRoomScreen: React.FC = () => {
  const authDispatch = useAuthDispatch();

  const [roomName, setRoomName] = useState<string>("");
  const maxRoomNameLength = 60;
  const canPost = roomName.length > 0;

  // ルーム作成用
  const { requestPostRoom, isLoadingPostRoom } = useRequestPostRoom(
    roomName,
    false, // このタイミングでは, 性別未設定のため「異性にも表示」固定
    null, // ルーム画像の設定はできない
    () => {
      authDispatch({
        type: "COMPLETE_INTRO",
        initBottomTabRouteName: "MyRooms",
      });
      showToast(TOAST_SETTINGS["CREATE_ROOM"]);
    }
  );

  // スキップする
  const skipCreateRoomWhenIntro = () => {
    authDispatch({ type: "COMPLETE_INTRO", initBottomTabRouteName: "Rooms" });
  };

  // ルームを作成する
  const createRoomWhenIntro = () => {
    requestPostRoom();
  };

  return (
    <IntroCreateRoomTemplate
      roomName={roomName}
      setRoomName={setRoomName}
      maxRoomNameLength={maxRoomNameLength}
      canPost={canPost}
      isLoadingPostRoom={isLoadingPostRoom}
      skipCreateRoomWhenIntro={skipCreateRoomWhenIntro}
      createRoomWhenIntro={createRoomWhenIntro}
    />
  );
};

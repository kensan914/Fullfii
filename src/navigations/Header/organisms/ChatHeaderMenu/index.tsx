import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Block } from "galio-framework";

import { ByeByeMenu } from "src/navigations/Header/organisms/ChatHeaderMenu/ByeByeMenu";
import { LeaveParticipantMenu } from "src/navigations/Header/organisms/ChatHeaderMenu/LeaveParticipantMenu";
import { AddFavoriteUserMenu } from "src/navigations/Header/organisms/ChatHeaderMenu/AddFavoriteUserMenu";
import { useChatState } from "src/contexts/ChatContext";
import { useProfileState } from "src/contexts/ProfileContext";

type Props = {
  roomId: string;
};
export const ChatHeaderMenu: React.FC<Props> = (props) => {
  const { roomId } = props;

  const chatState = useChatState();
  const profileState = useProfileState();

  const [isReadyTalk, setIsReadyTalk] = useState(false);
  const [isReadyTalkForOwner, setIsReadyTalkForOwner] = useState(false);
  useEffect(() => {
    // トーク開始済み
    if (
      roomId in chatState.talkingRoomCollection &&
      chatState.talkingRoomCollection[roomId].isStart
    ) {
      setIsReadyTalk(true);

      // かつ作成者
      if (
        chatState.talkingRoomCollection[roomId].owner.id ===
        profileState.profile.id
      ) {
        setIsReadyTalkForOwner(true);
      }
    }
  }, [chatState.talkingRoomCollection]);

  return (
    <Block style={styles.container}>
      <AddFavoriteUserMenu
        roomId={roomId}
        isReadyTalk={isReadyTalk}
        isReadyTalkForOwner={isReadyTalkForOwner}
        style={styles.leaveParticipantMenu}
      />
      <LeaveParticipantMenu
        roomId={roomId}
        isReadyTalkForOwner={isReadyTalkForOwner}
        style={styles.leaveParticipantMenu}
      />
      <ByeByeMenu
        roomId={roomId}
        isReadyTalk={isReadyTalk}
        isReadyTalkForOwner={isReadyTalkForOwner}
        style={styles.byeByeMenu}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addFavoriteUserMenu: { marginRight: 8 },
  leaveParticipantMenu: { marginRight: 8 },
  byeByeMenu: { marginRight: 16 },
});

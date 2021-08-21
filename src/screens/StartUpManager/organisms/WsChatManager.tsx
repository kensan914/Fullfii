import React, { useEffect } from "react";

import { useWsChat } from "src/screens/StartUpManager/useWsChat";

type Props = {
  roomId: string;
  shouldStart: boolean;
};
/**
 *  かつて1つのuseWsChat()で複数のルームのwsを管理していたため, 最初にopenされたwsが上書きされて
 *  送信バグを引き起こしていた. ルームごとにWsChatManagerというコンポーネント内で管理することにし対処.
 */
export const WsChatManager: React.FC<Props> = (props) => {
  const { roomId, shouldStart } = props;

  const { connectWsChat } = useWsChat();
  useEffect(() => {
    connectWsChat(roomId, shouldStart);
  }, []);

  return <></>;
};

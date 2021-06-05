import { BASE_URL_WS } from "src/constants/env";
import { useAuthState } from "src/contexts/AuthContext";
import { useChatDispatch } from "src/contexts/ChatContext";
import { useWebsocket } from "src/hooks/useWebsocket";
import { WsResNotification, WsResNotificationIoTs } from "src/types/Types";
import { URLJoin } from "src/utils";
import { useWsChat } from "./useWsChat";

type UseWsNotification = () => {
  connectWsNotification: () => void;
};
export const useWsNotification: UseWsNotification = () => {
  const authState = useAuthState();
  const chatDispatch = useChatDispatch();

  const { connectWsChat } = useWsChat();
  const { connectWebsocket } = useWebsocket(
    {
      url: URLJoin(BASE_URL_WS, "notification/"),
      typeIoTsOfResData: WsResNotificationIoTs,
      onopen: (ws) => {
        ws.send(JSON.stringify({ type: "auth", token: authState.token }));
      },
      onmessage: (eData) => {
        const data = eData as WsResNotification;
        if (data.type === "auth") {
          // 認証完了
        } else if (data.type === "notice_talk") {
          if (data.status === "SOMEONE_PARTICIPATED") {
            // 誰かが参加した
            chatDispatch({
              type: "UPDATE_TALKING_ROOM",
              roomJson: data.room,
            });
            if (data.shouldStart) {
              connectWsChat(data.room.id, data.shouldStart);
            }

            const participant = data.room.participants.find((_participant) => {
              return _participant.id === data.participantId;
            });
            if (participant) {
              chatDispatch({
                type: "APPEND_COMMON_MESSAGE",
                roomId: data.room.id,
                commonMessageSettings: {
                  type: "SOMEONE_PARTICIPATED",
                  participant: participant,
                },
              });
            }
          }
        }
      },
      onclose: () => {
        return void 0;
      },
    },
    null // wsState. chatと異なり, global stateでの管理もないし, useWsNotificationの複数箇所呼び出しもなし
  );

  const connectWsNotification = () => {
    connectWebsocket();
  };

  return { connectWsNotification };
};

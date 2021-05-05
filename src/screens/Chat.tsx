import React from "react";
import { useRoute } from "@react-navigation/native";

import ChatTemplate from "src/components/templates/ChatTemplate";
import { useAuthState } from "src/contexts/AuthContext";
import { useChatState } from "src/contexts/ChatContext";
import { ChatRouteProp } from "src/types/Types";

const Chat: React.FC = () => {
  const route = useRoute<ChatRouteProp>();
  const talkTicketKey = route.params.talkTicketKey;
  const talkTicketCollection = useChatState().talkTicketCollection;
  const talkTicket = talkTicketCollection[talkTicketKey];

  const authState = useAuthState();

  if (talkTicket) {
    const user = talkTicket.room.user;
    const messages = talkTicket.room.messages;
    const offlineMessages = talkTicket.room.offlineMessages;
    const ws = talkTicket.room.ws;
    const isEnd = talkTicket.room.isEnd;

    return (
      <ChatTemplate
        user={user}
        messages={messages.concat(offlineMessages)}
        ws={ws}
        token={authState.token}
        talkTicketKey={talkTicketKey}
        isEnd={isEnd}
      />
    );
  } else return <></>;
};

export default Chat;

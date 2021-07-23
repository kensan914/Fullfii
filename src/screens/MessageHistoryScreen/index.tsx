import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { IMessage } from "react-native-gifted-chat";

import { MessageHistoryRouteProp } from "src/types/Types";
import { MessageHistoryTemplate } from "src/components/templates/MessageHistoryTemplate";
import { Message } from "src/types/Types.context";
import { useGifted } from "src/screens/ChatScreen/useGifted";
import { useProfileState } from "src/contexts/ProfileContext";

export const MessageHistoryScreen: React.FC = () => {
  const route = useRoute<MessageHistoryRouteProp>();
  const profileState = useProfileState();

  const user = route.params.user;
  const [messages, setMessage] = useState<Message[]>([
    {
      id: "test",
      text: "test",
      senderId: "test",
      time: new Date(),
    },
  ]);
  const [giftedMessages, setGiftedMessages] = useState<IMessage[]>([]);
  const roomMemberCollection = {
    [profileState.profile.id]: profileState.profile,
    [user.id]: user,
  };
  const { giftedMe, convertMessagesToGifted } = useGifted(roomMemberCollection);
  useEffect(() => {
    setGiftedMessages(convertMessagesToGifted([...messages]));
  }, [messages.length]);

  return (
    <MessageHistoryTemplate
      // messages={messages}
      giftedMessages={giftedMessages}
      giftedMe={giftedMe}
    />
  );
};

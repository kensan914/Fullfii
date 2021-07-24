import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { IMessage } from "react-native-gifted-chat";

import { MessageHistoryRouteProp } from "src/types/Types";
import { MessageHistoryTemplate } from "src/components/templates/MessageHistoryTemplate";
import { AllMessages, AllMessagesIoTs } from "src/types/Types.context";
import { useGifted } from "src/screens/ChatScreen/useGifted";
import { useProfileState } from "src/contexts/ProfileContext";
import { useChatState } from "src/contexts/ChatContext";
import { asyncGetObjectIncludeId } from "src/utils/asyncStorage";

export const MessageHistoryScreen: React.FC = () => {
  const route = useRoute<MessageHistoryRouteProp>();
  const profileState = useProfileState();
  const chatState = useChatState();

  const user = route.params.user;
  const [messages, setMessage] = useState<AllMessages>([]);
  useEffect(() => {
    (async () => {
      // 複数該当した場合(同一ユーザと話し聞きあっている場合)は, 最新に作られたルーム
      const talkingRoomsFindResult = Object.values(
        chatState.talkingRoomCollection
      )
        .filter((tr) => {
          return tr.addedFavoriteUserIds.includes(user.id);
        })
        .sort((a, b) => {
          if (a.createdAt < b.createdAt) {
            return 1;
          } else {
            return -1;
          }
        });

      if (talkingRoomsFindResult.length <= 0) {
        const messageHistory = await asyncGetObjectIncludeId(
          "messageHistory",
          user.id,
          AllMessagesIoTs
        );

        if (messageHistory === null) {
          // 該当userIdが見つからない
        } else {
          setMessage(messageHistory as AllMessages);
        }
      } else {
        const talkingRoom = talkingRoomsFindResult[0];
        setMessage(talkingRoom.messages);
      }
    })();
  }, []);

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
      giftedMessages={giftedMessages}
      giftedMe={giftedMe}
    />
  );
};

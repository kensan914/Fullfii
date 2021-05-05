import { IMessage, User } from "react-native-gifted-chat";

import { USER_EMPTY_ICON_URL } from "src/constants/env";
import { AllMessages, MeProfile, Profile } from "src/types/Types.context";

type ConvertMessagesToGifted = (messages: AllMessages) => IMessage[];
const useGifted = (
  me: MeProfile,
  targetUser: Profile
): [User, ConvertMessagesToGifted] => {
  const giftedMe = {
    _id: me.id,
    name: me.name,
    avatar: me.image ? me.image : "",
  };

  const convertMessagesToGifted: ConvertMessagesToGifted = (messages) => {
    const _giftedMessages: IMessage[] = [...messages]
      .reverse()
      .map((_message) => {
        const giftedUser =
          "isMe" in _message && _message.isMe
            ? giftedMe
            : {
                _id: targetUser.id,
                name: targetUser.name,
                avatar: targetUser.image
                  ? targetUser.image
                  : USER_EMPTY_ICON_URL,
              };

        const giftedMessage = {
          _id: `${_message.messageId}${
            "isOffline" in _message && _message.isOffline ? "-offline" : ""
          }`,
          // _id: Math.round(Math.random() * 100000000),
          text: _message.message,
          createdAt: _message.time,
          user: giftedUser,
          sent: !("isOffline" in _message && _message.isOffline),
          system: "common" in _message && _message.common,
        };
        return giftedMessage;
      });

    return _giftedMessages;
  };

  return [giftedMe, convertMessagesToGifted];
};

export default useGifted;

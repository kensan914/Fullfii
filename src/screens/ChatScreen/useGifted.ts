import { IMessage, User } from "react-native-gifted-chat";

import { USER_EMPTY_ICON_URL } from "src/constants/env";
import { useProfileState } from "src/contexts/ProfileContext";
import { RoomMemberCollection } from "src/types/Types";
import { AllMessages } from "src/types/Types.context";

type ConvertMessagesToGifted = (messages: AllMessages) => IMessage[];
type UseGifted = (roomMemberCollection: RoomMemberCollection) => {
  giftedMe: User;
  convertMessagesToGifted: ConvertMessagesToGifted;
};
export const useGifted: UseGifted = (roomMemberCollection) => {
  const profileState = useProfileState();
  const me = profileState.profile;

  const giftedMe = {
    _id: me.id,
    name: me.name,
    avatar: me.image ? me.image : "",
  };

  /**
   * Fullfii形式のmessagesを受け取り、Gifted chat形式のmessagesに変換
   * @param messages
   * @returns
   */
  const convertMessagesToGifted: ConvertMessagesToGifted = (messages) => {
    const _giftedMessages: IMessage[] = [...messages]
      .reverse()
      .map((_message) => {
        // system message
        if ("isCommon" in _message) {
          return {
            _id: _message.id,
            text: _message.text,
            createdAt: _message.time,
            user: giftedMe,
            system: "isCommon" in _message && _message.isCommon,
          };
        } else if ("isThirdParty" in _message) {
          return {
            _id: _message.id,
            text: _message.text,
            createdAt: _message.time,
            user: {
              _id: _message.senderId,
              name: "匿名子",
              avatar: require("src/assets/images/intro/lectureWoman.png"),
            },
            sent: true,
            system: false,
          };
        } else {
          // normal message (message | offlineMessage)
          let giftedSender: User;
          if (_message.senderId in roomMemberCollection) {
            const sender = roomMemberCollection[_message.senderId];
            giftedSender = {
              _id: sender.id,
              name: sender.name,
              avatar: sender.image ? sender.image : USER_EMPTY_ICON_URL,
            };
          } else {
            // roomMemberCollectionにいないsenderのメッセージを扱った時
            giftedSender = giftedMe;
            console.error(`not found "${_message.senderId}" member.`);
          }

          return {
            _id: `${_message.id}${
              "isOffline" in _message && _message.isOffline ? "-offline" : ""
            }`,
            text: _message.text,
            createdAt: _message.time,
            user: giftedSender,
            sent: !("isOffline" in _message && _message.isOffline),
            system: false,
          };
        }
      });

    return _giftedMessages;
  };

  return { giftedMe, convertMessagesToGifted };
};

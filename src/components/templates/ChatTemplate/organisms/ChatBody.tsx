import React, { Dispatch, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import "dayjs/locale/ja";
import { getBottomSpace } from "react-native-iphone-x-helper";

import { COLORS } from "src/constants/colors";
import { useProfileState } from "src/contexts/ProfileContext";
import { generateUuid4, includeUrl } from "src/utils";
import { useTurnOnRead } from "src/screens/ChatScreen/useTurnOnRead";
import {
  AllMessages,
  OfflineMessage,
  WsNullable,
} from "src/types/Types.context";
import {
  AppendOfflineMessage,
  RoomMemberCollection,
  SendWsMessage,
} from "src/types/Types";
import { useChatDispatch } from "src/contexts/ChatContext";
import { useGifted } from "src/screens/ChatScreen/useGifted";
import { useAuthState } from "src/contexts/AuthContext";
import { useDomState } from "src/contexts/DomContext";
import { ALERT_MESSAGES } from "src/constants/alertMessages";
import { GiftedSender } from "src/components/templates/ChatTemplate/atoms/GiftedSender";
import { GiftedBubble } from "src/components/templates/ChatTemplate/atoms/GiftedBubble";
import { GiftedInputToolbar } from "src/components/templates/ChatTemplate/atoms/GiftedInputToolbar";
import { GiftedScrollToBottom } from "src/components/templates/ChatTemplate/atoms/GiftedScrollToBottom";
import { GiftedSystemMessage } from "src/components/templates/ChatTemplate/atoms/GiftedSystemMessage";

type Props = {
  roomMemberCollection: RoomMemberCollection;
  roomId: string;
  messages: AllMessages;
  offlineMessages: OfflineMessage[];
  ws: WsNullable;
  isEnd: boolean;
  openProfileModal: (userId: string) => void;
  setIsOpenNotificationReminderModal: Dispatch<boolean>;
  isStart: boolean;
};
export const ChatBody: React.FC<Props> = (props) => {
  const {
    roomMemberCollection,
    roomId,
    messages,
    offlineMessages,
    ws,
    isEnd,
    openProfileModal,
    setIsOpenNotificationReminderModal,
    isStart,
  } = props;

  const authState = useAuthState();
  const profileState = useProfileState();
  const chatDispatch = useChatDispatch();

  const [step, setStep] = useState(0);
  const [giftedMessages, setGiftedMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const _isMounted = useRef(false);

  useTurnOnRead(messages, roomId);
  const { giftedMe, convertMessagesToGifted } = useGifted(roomMemberCollection);
  const domState = useDomState();

  useEffect(() => {
    _isMounted.current = true;
    setIsTyping(false);
    return () => {
      _isMounted.current = false;
    };
  }, []);

  // オフラインメッセージの反映
  useEffect(() => {
    setGiftedMessages(
      convertMessagesToGifted([...messages, ...offlineMessages])
    );
  }, [messages.length, offlineMessages.length]);

  const sendWsMessage: SendWsMessage = (ws, messageId, messageText) => {
    ws.send(
      JSON.stringify({
        type: "chat_message",
        message_id: messageId,
        text: messageText,
      })
    );
  };

  const appendOfflineMessage: AppendOfflineMessage = (
    messageId,
    messageText
  ) => {
    chatDispatch({
      type: "APPEND_OFFLINE_MESSAGE",
      messageId: messageId,
      text: messageText,
      senderId: profileState.profile.id,
      time: new Date(),
      roomId: roomId,
    });
  };

  const onSend = (_giftedMessages: IMessage[] = []) => {
    if (_giftedMessages.length > 0) {
      const _giftedMessage = _giftedMessages[0];

      if (isEnd) {
        Alert.alert(...ALERT_MESSAGES["CANNOT_SEND_MSG_ALREADY_END_ROOM"]);
        return;
      } else if (Object.keys(roomMemberCollection).length <= 1) {
        Alert.alert(...ALERT_MESSAGES["CANNOT_SEND_MSG_NOT_EXIST_USER"]);
        return;
      } else if (includeUrl(_giftedMessage.text)) {
        Alert.alert(...ALERT_MESSAGES["CANNOT_SEND_MSG_INAPPROPRIATE"]);
        return;
      } else if (!isStart) {
        Alert.alert(...ALERT_MESSAGES["CANNOT_SEND_MSG_NOT_START"]);
        return;
      }

      const messageId = generateUuid4();
      appendOfflineMessage(messageId, _giftedMessage.text);

      if (ws !== null && authState.token !== null) {
        sendWsMessage(ws, messageId, _giftedMessage.text);
      }

      setStep(step + 1);

      // プッシュ通知催促
      if (!domState.pushNotificationParams.isChosenPermission) {
        setIsOpenNotificationReminderModal(true);
      }
    }
  };

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel="main"
      testID="main"
    >
      <GiftedChat
        messages={giftedMessages}
        onSend={onSend}
        user={giftedMe}
        scrollToBottom
        onPressAvatar={(user) => {
          openProfileModal(user._id.toString());
        }}
        keyboardShouldPersistTaps="never"
        renderBubble={GiftedBubble}
        renderInputToolbar={GiftedInputToolbar}
        renderSystemMessage={GiftedSystemMessage}
        renderSend={GiftedSender}
        inverted
        timeTextStyle={{
          left: { color: "lightcoral" },
          right: { color: "navajowhite" },
        }}
        isTyping={isTyping}
        infiniteScroll
        alwaysShowSend
        renderTicks={() => null}
        renderTime={() => null}
        locale="ja"
        placeholder="メッセージを入力"
        textInputStyle={{
          paddingHorizontal: 10,
          paddingTop: 9,
          borderRadius: 18,
          backgroundColor: COLORS.WHITE,
        }}
        bottomOffset={getBottomSpace()} // textInput下部に時たま余白ができてしまうため固定
        listViewProps={{
          // https://reactnative.dev/docs/scrollview#props
          contentContainerStyle: {
            paddingBottom: 16,
          },
        }}
        scrollToBottomComponent={GiftedScrollToBottom}
        scrollToBottomStyle={{ bottom: 20 }}

        // parsePatterns={parsePatterns} // 特定のテキスト(ex. "# awesome")をリンク化
        // onQuickReply={onQuickReply} // QuickReply (ex. checkBox)
        // quickReplyStyle={{ borderRadius: 12 }}

        // onLongPressAvatar={(user) => Alert.alert(JSON.stringify(user))}
        // loadEarlier={loadEarlier}
        // onLoadEarlier={onLoadEarlier}
        // isLoadingEarlier={isLoadingEarlier}
        // renderAccessory={Platform.OS === "web" ? null : renderAccessory}
        // renderActions={renderCustomActions}
        // renderCustomView={renderCustomView}
        // renderQuickReplySend={renderQuickReplySend}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BEIGE,
  },
});

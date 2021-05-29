import React, { Dispatch, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Platform, Alert } from "react-native";
import {
  Bubble,
  GiftedChat,
  SystemMessage,
  IMessage,
  Send,
  BubbleProps,
  InputToolbar,
  InputToolbarProps,
  SystemMessageProps,
} from "react-native-gifted-chat";
import "dayjs/locale/ja";
import { Text } from "galio-framework";
import { getBottomSpace } from "react-native-iphone-x-helper";

import { COLORS } from "src/constants/theme";
import Icon from "src/components/atoms/Icon";
import { useProfileState } from "src/contexts/ProfileContext";
import { generateUuid4, fmtfromDateToStr, includeUrl } from "src/utils";
import { useTurnOnRead } from "src/screens/ChatScreen/useTurnOnRead";
import { AllMessages, WsNullable } from "src/types/Types.context";
import {
  AppendOfflineMessage,
  RoomMemberCollection,
  SendWsMessage,
} from "src/types/Types";
import { useChatDispatch } from "src/contexts/ChatContext";
import { useGifted } from "src/screens/ChatScreen/useGifted";
import { useAuthState } from "src/contexts/AuthContext";
import { width } from "src/constants";
import { useConfigPushNotification } from "src/hooks/useConfigPushNotification";

type Props = {
  roomMemberCollection: RoomMemberCollection;
  roomId: string;
  messages: AllMessages;
  ws: WsNullable;
  isEnd: boolean;
  openProfileModal: (userId: string) => void;
  setIsOpenNotificationReminderModal: Dispatch<boolean>;
};
const ChatBody: React.FC<Props> = (props) => {
  const {
    roomMemberCollection,
    roomId,
    messages,
    ws,
    isEnd,
    openProfileModal,
    setIsOpenNotificationReminderModal,
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
  const { isPermission } = useConfigPushNotification();

  useEffect(() => {
    _isMounted.current = true;
    setIsTyping(false);
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setGiftedMessages(convertMessagesToGifted(messages));
  }, [messages]);

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
        Alert.alert(`このルームは終了されています`);
        return;
      } else if (Object.keys(roomMemberCollection).length <= 1) {
        Alert.alert("まだ相手が参加していません");
        return;
      } else if (includeUrl(_giftedMessage.text)) {
        Alert.alert("このメッセージは送信することができません");
        return;
      }

      const messageId = generateUuid4();
      appendOfflineMessage(messageId, _giftedMessage.text);

      if (ws !== null && authState.token !== null) {
        sendWsMessage(ws, messageId, _giftedMessage.text);
      }

      const sentMessages = [{ ..._giftedMessage, sent: false }];
      setGiftedMessages(
        GiftedChat.append(giftedMessages, sentMessages, Platform.OS !== "web")
      );
      setStep(step + 1);

      // プッシュ通知催促
      if (!isPermission) {
        setIsOpenNotificationReminderModal(true);
      }
    }
  };

  const renderBubble = (props: BubbleProps<IMessage>) => {
    const { currentMessage, previousMessage, nextMessage, position } = props;

    const currentCreatedAt = currentMessage?.createdAt;
    const previousCreatedAt = previousMessage?.createdAt;
    const nextCreatedAt = nextMessage?.createdAt;
    const currentUser = currentMessage?.user;
    const previousUser = previousMessage?.user;
    const nextUser = nextMessage?.user;

    const isSameAsPreviousCreatedAt =
      typeof currentCreatedAt !== "undefined" &&
      typeof currentCreatedAt !== "number" &&
      typeof currentCreatedAt !== "string" &&
      typeof previousCreatedAt !== "undefined" &&
      typeof previousCreatedAt !== "number" &&
      typeof previousCreatedAt !== "string" &&
      typeof currentUser !== "undefined" &&
      typeof previousUser !== "undefined" &&
      currentUser._id === previousUser._id &&
      currentCreatedAt.getFullYear() === previousCreatedAt.getFullYear() &&
      currentCreatedAt.getMonth() === previousCreatedAt.getMonth() &&
      currentCreatedAt.getDate() === previousCreatedAt.getDate() &&
      currentCreatedAt.getHours() === previousCreatedAt.getHours() &&
      currentCreatedAt.getMinutes() === previousCreatedAt.getMinutes();

    const isSameAsNextCreatedAt =
      typeof currentCreatedAt !== "undefined" &&
      typeof currentCreatedAt !== "number" &&
      typeof currentCreatedAt !== "string" &&
      typeof nextCreatedAt !== "undefined" &&
      typeof nextCreatedAt !== "number" &&
      typeof nextCreatedAt !== "string" &&
      typeof currentUser !== "undefined" &&
      typeof nextUser !== "undefined" &&
      currentUser._id === nextUser._id &&
      currentCreatedAt.getFullYear() === nextCreatedAt.getFullYear() &&
      currentCreatedAt.getMonth() === nextCreatedAt.getMonth() &&
      currentCreatedAt.getDate() === nextCreatedAt.getDate() &&
      currentCreatedAt.getHours() === nextCreatedAt.getHours() &&
      currentCreatedAt.getMinutes() === nextCreatedAt.getMinutes();

    const isFirst =
      !isSameAsPreviousCreatedAt ||
      !(previousMessage && !previousMessage.system);
    const isEnd =
      !isSameAsNextCreatedAt || !(nextMessage && !nextMessage.system);

    const borderRadius = 22;
    return (
      <View style={{ flexDirection: "column" }}>
        <Bubble
          {...props}
          textStyle={{
            right: {
              color: COLORS.WHITE,
            },
            left: {
              color: COLORS.BLACK,
            },
          }}
          wrapperStyle={{
            right: {
              backgroundColor: COLORS.BROWN,
              paddingRight: 4,
              paddingLeft: 4,
              paddingVertical: 4,
              borderRadius: borderRadius,
              borderTopRightRadius: isFirst ? borderRadius : 0,
              borderBottomRightRadius:
                isEnd &&
                !isFirst /* bubble要素が一つのみの時にただの丸になるのを防ぐ */
                  ? borderRadius
                  : 0,
            },
            left: {
              paddingRight: 4,
              paddingLeft: 4,
              paddingVertical: 4,
              backgroundColor: COLORS.WHITE,
              borderRadius: borderRadius,
              borderTopLeftRadius: isFirst ? borderRadius : 0,
              borderBottomLeftRadius:
                isEnd &&
                !isFirst /* bubble要素が一つのみの時にただの丸になるのを防ぐ */
                  ? borderRadius
                  : 0,
            },
          }}
        />

        {isEnd && currentCreatedAt && typeof currentCreatedAt !== "number" && (
          <View
            style={{
              marginTop: 2,
              marginBottom: 10,
              marginHorizontal: 2,
              flexDirection: "row",
              justifyContent: position === "right" ? "flex-end" : "flex-start",
            }}
          >
            <Text
              size={12}
              color={COLORS.GRAY}
              style={{
                textAlign: position,
              }}
            >
              {fmtfromDateToStr(currentCreatedAt, "hh:mm")}
            </Text>

            {position === "right" && currentMessage && !currentMessage.sent && (
              <Text
                size={12}
                color={COLORS.GRAY}
                style={{
                  textAlign: position,
                  marginLeft: 4,
                }}
              >
                送信中...
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderInputToolbar = (props: InputToolbarProps) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{ backgroundColor: COLORS.BEIGE, borderTopWidth: 0 }}
      />
    );
  };

  const renderSystemMessage = (props: SystemMessageProps<IMessage>) => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
          backgroundColor: COLORS.BROWN_RGBA_1,
          padding: 8,
          width: width * 0.8,
          alignSelf: "center",
          borderRadius: 14,
        }}
        textStyle={{
          fontSize: 14,
          color: COLORS.GRAY,
        }}
      />
    );
  };

  const renderSend = (props: Send["props"]) => (
    <Send
      {...props}
      containerStyle={{
        justifyContent: "center",
        paddingHorizontal: 14,
        paddingRight: 27,
      }}
    >
      <Icon size={23} name="send" family="font-awesome" color={COLORS.BROWN} />
    </Send>
  );

  const renderScrollToBottomComponent = () => {
    return (
      <Icon
        family="font-awesome"
        size={15}
        name="arrow-down"
        color="darkgray"
      />
    );
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
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSystemMessage={renderSystemMessage}
        renderSend={renderSend}
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
        scrollToBottomComponent={renderScrollToBottomComponent}
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
  container: { flex: 1, backgroundColor: COLORS.BEIGE },
});

export default ChatBody;

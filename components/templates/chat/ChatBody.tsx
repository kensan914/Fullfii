import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Platform, Alert, Dimensions } from "react-native";
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

import { COLORS } from "../../../constants/Theme";
import Icon from "../../atoms/Icon";
import { logEvent } from "../../modules/firebase/logEvent";
import { useProfileState } from "../../contexts/ProfileContext";
import { generateUuid4, fmtfromDateToStr } from "../../modules/support";
import useTurnOnRead from "./TurnOnRead";
import {
  AllMessages,
  Profile,
  TalkTicketKey,
  TokenNullable,
  WsNullable,
} from "../../types/Types.context";
import { AppendOfflineMessage, SendWsMessage } from "../../types/Types";
import { useChatDispatch } from "../../contexts/ChatContext";
import useGifted from "./Gifted";
import { getBottomSpace } from "react-native-iphone-x-helper";

const { width } = Dimensions.get("screen");

type Props = {
  user: Profile;
  messages: AllMessages;
  ws: WsNullable;
  token: TokenNullable;
  talkTicketKey: TalkTicketKey;
  isEnd: boolean;
  existUser: boolean;
  setIsOpenProfile: (val: boolean) => void;
};
const ChatBody: React.FC<Props> = (props) => {
  const {
    user,
    messages,
    ws,
    token,
    talkTicketKey,
    isEnd,
    existUser,
    setIsOpenProfile,
  } = props;

  const [step, setStep] = useState(0);
  const [giftedMessages, setGiftedMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const _isMounted = useRef(false);

  const profileState = useProfileState();
  const chatDispatch = useChatDispatch();
  useTurnOnRead(messages, talkTicketKey);
  const [giftedMe, convertMessagesToGifted] = useGifted(
    profileState.profile,
    user
  );

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

  const sendWsMessage: SendWsMessage = (ws, messageId, messageText, token) => {
    ws.send(
      JSON.stringify({
        type: "chat_message",
        message_id: messageId,
        message: messageText,
        token,
      })
    );
  };

  const appendOfflineMessage: AppendOfflineMessage = (
    messageId,
    messageText
  ) => {
    chatDispatch({
      type: "APPEND_OFFLINE_MESSAGE",
      talkTicketKey,
      messageId,
      messageText,
      time: new Date(),
    });
  };

  const onSend = (_giftedMessages: IMessage[] = []) => {
    if (_giftedMessages.length > 0) {
      const _giftedMessage = _giftedMessages[0];

      if (isEnd) {
        Alert.alert(`${user.name}さんは退室しています`);
        return;
      } else if (!existUser) {
        Alert.alert("話し相手が見つかりません。");
        return;
      }

      logEvent(
        "send_message_button",
        {
          message: _giftedMessage.text,
          talkTicketKey: talkTicketKey,
        },
        profileState
      );

      const messageId = generateUuid4();
      appendOfflineMessage(messageId, _giftedMessage.text);

      if (ws !== null && token !== null) {
        sendWsMessage(ws, messageId, _giftedMessage.text, token);
      }

      const sentMessages = [{ ..._giftedMessage, sent: false }];
      setGiftedMessages(
        GiftedChat.append(giftedMessages, sentMessages, Platform.OS !== "web")
      );
      setStep(step + 1);
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
          wrapperStyle={{
            right: {
              backgroundColor: COLORS.PINK,
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
              color={"gray"}
              style={{
                textAlign: position,
              }}
            >
              {fmtfromDateToStr(currentCreatedAt, "hh:mm")}
            </Text>

            {position === "right" && currentMessage && !currentMessage.sent && (
              <Text
                size={12}
                color={"darkgray"}
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
    return <InputToolbar {...props} containerStyle={{}} />;
  };

  const renderSystemMessage = (props: SystemMessageProps<IMessage>) => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
          backgroundColor: "whitesmoke",
          padding: 8,
          width: width * 0.8,
          alignSelf: "center",
          borderRadius: 14,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  };

  const renderSend = (props: Send["props"]) => (
    <Send
      {...props}
      containerStyle={{
        justifyContent: "center",
        // backgroundColor: "red",
        paddingHorizontal: 14,
        paddingRight: 27,
      }}
    >
      <Icon size={20} name="send" family="font-awesome" color={COLORS.PINK} />
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
        onPressAvatar={() => {
          setIsOpenProfile(true);
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
          paddingHorizontal: 6,
          paddingTop: 8,
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
  container: { flex: 1 },
});

export default ChatBody;

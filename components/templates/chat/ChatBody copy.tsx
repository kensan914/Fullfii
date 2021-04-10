import { MaterialIcons } from "@expo/vector-icons";
import { AppLoading, Asset, Linking } from "expo";
import React, { Component, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Platform, Alert } from "react-native";
import {
  Bubble,
  GiftedChat,
  SystemMessage,
  IMessage,
  Send,
} from "react-native-gifted-chat";

// import AccessoryBar from "./example-expo/AccessoryBar";
import CustomActions from "./CustomActions";
import CustomView from "./CustomView";
import messagesData from "./data/messages";
import earlierMessages from "./data/earlierMessages";
import { COLORS } from "../../../constants/Theme";
import Icon from "../../atoms/Icon";

// const filterBotMessages = (message) =>
//   !message.system && message.user && message.user._id && message.user._id === 2;
// const findStep = (step) => (message) => message._id === step;

const user = {
  _id: 1,
  name: "Developer",
};

const otherUser = {
  _id: 2,
  name: "React Native",
  avatar: "https://facebook.github.io/react/img/logo_og.png",
};

const ChatBody = (props) => {
  const [inverted, setInverted] = useState(false);
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loadEarlier, setLoadEarlier] = useState(true);
  const [typingText, setTypingText] = useState(null);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const _isMounted = useRef(false);

  useEffect(() => {
    _isMounted.current = true;
    setMessages(messagesData);
    setIsTyping(false);

    return () => {
      _isMounted.current = false;
    };
  }, []);

  const onLoadEarlier = () => {
    setIsLoadingEarlier(true);

    setTimeout(() => {
      if (_isMounted.current) {
        setMessages(
          GiftedChat.prepend(
            messages,
            earlierMessages() as IMessage[],
            Platform.OS !== "web"
          )
        );
        setLoadEarlier(true);
        setIsLoadingEarlier(false);
      }
    }, 1500); // simulating network
  };

  const onSend = (_messages: IMessage[] = []) => {
    const _step = step + 1;
    const sentMessages = [{ ..._messages[0], sent: true, received: true }];
    setMessages(
      GiftedChat.append(messages, sentMessages, Platform.OS !== "web")
    );
    setStep(_step);

    // for demo purpose
    // setTimeout(() => botSend(_step), Math.round(Math.random() * 1000));
  };

  const botSend = (_step = 0) => {
    const newMessage = {
      _id: 10000,
      text: "こんにちは",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "React Native",
      },
    };
    if (newMessage) {
      setMessages(
        GiftedChat.append(messages, [newMessage], Platform.OS !== "web")
      );
    }
  };

  const parsePatterns = (_linkStyle: any) => {
    return [
      {
        pattern: /#(\w+)/,
        style: { textDecorationLine: "underline", color: "darkorange" },
        onPress: () => Linking.openURL("http://gifted.chat"),
      },
    ];
  };

  const renderCustomView = (props) => {
    return <CustomView {...props} />;
  };

  const onReceive = (text: string) => {
    setMessages(
      GiftedChat.append(
        messages as any,
        [
          {
            _id: Math.round(Math.random() * 1000000),
            text,
            createdAt: new Date(),
            user: otherUser,
          },
        ],
        Platform.OS !== "web"
      )
    );
  };

  const onSendFromUser = (messages: IMessage[] = []) => {
    const createdAt = new Date();
    const messagesToUpload = messages.map((message) => ({
      ...message,
      user,
      createdAt,
      _id: Math.round(Math.random() * 1000000),
    }));
    onSend(messagesToUpload);
  };

  const toggleIsTyping = () => {
    setIsTyping(!isTyping);
  };

  const renderAccessory = () =>
    // <AccessoryBar onSend={onSendFromUser} isTyping={toggleIsTyping} />
    null;

  const renderCustomActions = (props) =>
    Platform.OS === "web" ? null : (
      <CustomActions {...props} onSend={onSendFromUser} />
    );

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: COLORS.PINK,
          },
        }}
      />
    );
  };

  const renderSystemMessage = (props) => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  };

  const onQuickReply = (replies) => {
    const createdAt = new Date();
    if (replies.length === 1) {
      onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies[0].title,
          user,
        },
      ]);
    } else if (replies.length > 1) {
      onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies.map((reply) => reply.title).join(", "),
          user,
        },
      ]);
    } else {
      console.warn("replies param is not set correctly");
    }
  };

  const renderQuickReplySend = () => <Text>{" custom send =>"}</Text>;

  const renderSend = (props: Send["props"]) => (
    <Send
      {...props}
      containerStyle={{
        justifyContent: "center",
        // backgroundColor: "red",
        paddingHorizontal: 14,
      }}
    >
      <Icon size={20} name="send" family="font-awesome" color={COLORS.PINK} />
    </Send>
  );

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel="main"
      testID="main"
    >
      <GiftedChat
        messages={messages}
        placeholder="メッセージを入力"
        onSend={onSend}
        // loadEarlier={loadEarlier}
        // onLoadEarlier={onLoadEarlier}
        // isLoadingEarlier={isLoadingEarlier}
        user={user}
        scrollToBottom
        onLongPressAvatar={(user) => Alert.alert(JSON.stringify(user))}
        onPressAvatar={() => Alert.alert("short press")}
        keyboardShouldPersistTaps="never"
        // renderAccessory={Platform.OS === "web" ? null : renderAccessory}
        // renderActions={renderCustomActions}
        renderBubble={renderBubble}
        renderSystemMessage={renderSystemMessage}
        // renderCustomView={renderCustomView}
        renderSend={renderSend}
        renderQuickReplySend={renderQuickReplySend}
        inverted
        timeTextStyle={{
          left: { color: "lightcoral" },
          right: { color: "navajowhite" },
        }}
        isTyping={isTyping}
        infiniteScroll
        alwaysShowSend
        // parsePatterns={parsePatterns} // 特定のテキスト(ex. "# awesome")をリンク化
        // onQuickReply={onQuickReply} // QuickReply (ex. checkBox)
        // quickReplyStyle={{ borderRadius: 12 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default ChatBody;

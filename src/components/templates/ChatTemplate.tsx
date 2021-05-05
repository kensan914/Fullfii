import React, { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Block, theme } from "galio-framework";

import { useChatState } from "src/contexts/ChatContext";
import ProfileModal from "src/components/molecules/ProfileModal";
import {
  AllMessages,
  Profile,
  WsNullable,
  TokenNullable,
  TalkTicketKey,
} from "src/types/Types.context";
import WaitingChatBody from "src/components/organisms/WaitingChatBody";
import StoppingChatBody from "src/components/organisms/StoppingChatBody";
import ApprovingChatBody from "src/components/organisms/ApprovingChatBody";
import ChatBody from "src/components/templates/chat/ChatBody";
import { COLORS } from "src/constants/theme";

const { width } = Dimensions.get("screen");

type Props = {
  user: Profile;
  messages: AllMessages;
  ws: WsNullable;
  token: TokenNullable;
  talkTicketKey: TalkTicketKey;
  isEnd: boolean;
};
const ChatTemplate: React.FC<Props> = (props) => {
  const { user, messages, ws, token, talkTicketKey, isEnd } = props;

  const existUser = !!user.id.length;
  const chatState = useChatState();

  const renderBody = () => {
    const talkStatusKey =
      chatState.talkTicketCollection[talkTicketKey].status.key;

    switch (talkStatusKey) {
      case "talking":
      case "finishing":
        return (
          <ChatBody
            user={user}
            messages={messages}
            ws={ws}
            token={token}
            talkTicketKey={talkTicketKey}
            isEnd={isEnd}
            existUser={existUser}
            setIsOpenProfile={setIsOpenProfile}
          />
        );

      case "approving":
        return (
          <ApprovingChatBody
            talkTicket={chatState.talkTicketCollection[talkTicketKey]}
            talkTicketKey={talkTicketKey}
            commonMessage={messages[0]}
          />
        );

      case "waiting":
        return (
          <WaitingChatBody
            talkTicket={chatState.talkTicketCollection[talkTicketKey]}
            talkTicketKey={talkTicketKey}
            commonMessage={messages[0]}
          />
        );
      case "stopping":
        return (
          <StoppingChatBody
            talkTicketKey={talkTicketKey}
            commonMessage={messages[0]}
          />
        );
    }
  };

  const [isOpenProfile, setIsOpenProfile] = useState(false);
  return (
    <Block flex space="between" style={styles.container}>
      {renderBody()}

      {existUser ? (
        <ProfileModal
          isOpen={isOpenProfile}
          setIsOpen={setIsOpenProfile}
          profile={user}
          talkTicket={chatState.talkTicketCollection[talkTicketKey]}
        />
      ) : (
        <></>
      )}
    </Block>
  );
};

export default ChatTemplate;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,
  },
  messageFormContainer: {
    maxHeight: theme.SIZES.BASE * 12 + 10,
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: "lavenderblush",
  },
  input: {
    width: width * 0.8,
    maxHeight: theme.SIZES.BASE * 9,
    minHeight: theme.SIZES.BASE * 2.2,
    borderRadius: theme.SIZES.BASE * 1.1,
    backgroundColor: theme.COLORS.WHITE,
  },
  iconButton: {
    width: width * 0.15,
    minHeight: theme.SIZES.BASE * 3,
    backgroundColor: "transparent",
  },
  sedButton: {
    width: width * 0.15,
    minHeight: theme.SIZES.BASE * 3,
    backgroundColor: "transparent",
  },
  messagesWrapper: {
    flexGrow: 1,
    top: 0,
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 16,
    paddingBottom: 68,
  },
  messageCardWrapper: {
    maxWidth: "85%",
    marginLeft: 8,
    marginBottom: 20,
  },
  messageCard: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: theme.COLORS.WHITE,
  },
  shadow: {
    shadowColor: "rgba(0, 0, 0, 0.12)",
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 20,
    shadowOpacity: 1,
  },
  time: {
    fontSize: 11,
    opacity: 0.5,
    marginTop: 8,
  },
  avatar: {
    marginBottom: theme.SIZES.BASE,
  },
});

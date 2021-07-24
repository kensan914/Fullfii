import React from "react";
import { StyleSheet, View } from "react-native";
import { GiftedChat, IMessage, User } from "react-native-gifted-chat";

import { COLORS } from "src/constants/colors";
import { GiftedBubble } from "src/components/templates/ChatTemplate/atoms/GiftedBubble";
import { GiftedScrollToBottom } from "src/components/templates/ChatTemplate/atoms/GiftedScrollToBottom";
import { GiftedSystemMessage } from "src/components/templates/ChatTemplate/atoms/GiftedSystemMessage";

type Props = {
  giftedMessages: IMessage[];
  giftedMe: User;
};
export const MessageHistoryTemplate: React.FC<Props> = (props) => {
  const { giftedMessages, giftedMe } = props;

  return (
    <View style={styles.container} accessible accessibilityLabel="main">
      <GiftedChat
        messages={giftedMessages}
        user={giftedMe}
        scrollToBottom
        renderBubble={GiftedBubble}
        renderSystemMessage={GiftedSystemMessage}
        inverted
        timeTextStyle={{
          left: { color: "lightcoral" },
          right: { color: "navajowhite" },
        }}
        infiniteScroll
        alwaysShowSend
        renderInputToolbar={() => null}
        renderSend={() => null}
        renderTicks={() => null}
        renderTime={() => null}
        locale="ja"
        listViewProps={{
          // https://reactnative.dev/docs/scrollview#props
          contentContainerStyle: {
            paddingBottom: 16,
          },
        }}
        scrollToBottomComponent={GiftedScrollToBottom}
        scrollToBottomStyle={{ bottom: 20 }}
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

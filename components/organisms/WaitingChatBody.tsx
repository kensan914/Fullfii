import React from "react";
import { Block, Text } from "galio-framework";
import { Image, StyleSheet } from "react-native";
import { AllMessage, TalkTicket } from "../types/Types.context";
import { CommonMessage } from "./Chat";

type Props = {
  talkTicket: TalkTicket;
  commonMessage: AllMessage;
};
const WaitingChatBody: React.FC<Props> = (props) => {
  const { talkTicket, commonMessage } = props;

  return (
    <Block flex={1}>
      <Block
        flex={0.2}
        style={[styles.dividedContainer, styles.headerContainer]}
      >
        {"common" in commonMessage && (
          <Block style={{}}>
            <CommonMessage message={commonMessage.message} />
          </Block>
        )}
      </Block>

      <Block
        flex={0.5}
        style={[styles.dividedContainer, styles.centralContainer]}
      >
        <Image
          style={{
            height: "100%",
            resizeMode: "contain",
          }}
          source={require("../../assets/images/chat/waiting_chat.png")}
        />
      </Block>

      <Block
        flex={0.3}
        style={[styles.dividedContainer, styles.bottomContainer]}
      >
        <Text
          bold
          color="#737373"
          size={15}
          style={{ lineHeight: 20, textAlign: "center" }}
        >
          マッチするまで時間がかかる場合があります。{"\n"}
          話し相手が見つかり次第通知でお知らせします。
        </Text>
      </Block>
    </Block>
  );
};

export default WaitingChatBody;

const styles = StyleSheet.create({
  dividedContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    // backgroundColor: "red",
  },
  centralContainer: {
    // backgroundColor: "green",
  },
  bottomContainer: {
    // backgroundColor: "blue",
    paddingHorizontal: 20,
  },
  modalContents: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    paddingTop: 40,
    paddingBottom: 40,
  },
});

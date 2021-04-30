import React, { useEffect, useState } from "react";
import { Block, Text } from "galio-framework";
import LottieView from "lottie-react-native";
import { Dimensions, Image, StyleSheet } from "react-native";

import { AllMessage, TalkTicket, TalkTicketKey } from "../types/Types.context";
import { CommonMessage } from "./Chat";
import SvgButton from "../atoms/SvgButton";
import useShuffle from "../hooks/useShuffle";
import ChatModal from "../molecules/ChatModal";
import { ADMOB_UNIT_ID_NATIVE } from "../../constants/env";
import useAdView from "../hooks/useAdView";
const { width } = Dimensions.get("screen");

type Props = {
  talkTicket: TalkTicket;
  commonMessage: AllMessage;
  talkTicketKey: TalkTicketKey;
};
const WaitingChatBody: React.FC<Props> = (props) => {
  const { talkTicket, talkTicketKey, commonMessage } = props;

  const { onPressStop } = useShuffle(talkTicketKey);

  const [isOpenChatModal, setIsOpenChatModal] = useState(false);
  const adViewModule = useAdView();

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
        flex={0.35}
        style={[styles.dividedContainer, styles.centralContainer]}
      >
        <LottieView
          style={{
            width: "100%",
          }}
          loop
          autoPlay
          source={require("../../assets/animations/waiting.json")}
        />
      </Block>

      <Block
        flex={0.45}
        style={[
          styles.dividedContainer,
          styles.bottomContainer,
          { justifyContent: "space-evenly" },
        ]}
      >
        {/* <Text
          bold
          color={COLORS.GRAY}
          size={14}
          style={{ lineHeight: 20, textAlign: "center" }}
        >
          話し相手が見つかり次第通知でお知らせします！
        </Text> */}
        <Block row center style={{ justifyContent: "center", marginTop: 20 }}>
          <Block flex={0.45} center>
            <SvgButton
              source={require("../../assets/icons/exit-room.svg")}
              onPress={onPressStop}
              diameter={width / 5.5}
              shadowColor={"#a9a9a9"}
            />
          </Block>
          <Block />
          <Block flex={0.45} center>
            <SvgButton
              source={require("../../assets/icons/pinkLoop.svg")}
              onPress={() => {
                setIsOpenChatModal(true);
              }}
              diameter={width / 5.5}
              shadowColor={"#ed775d"}
            />
          </Block>
        </Block>
        {typeof adViewModule !== "undefined" && (
          <Block style={{ width: "98%", paddingTop: 40 }}>
            <adViewModule.AdView
              media={false}
              type="video"
              index={2}
              adUnitId={ADMOB_UNIT_ID_NATIVE.video}
            />
          </Block>
        )}
      </Block>

      <ChatModal
        isOpen={isOpenChatModal}
        setIsOpen={setIsOpenChatModal}
        talkTicketKey={talkTicketKey}
        isOnlyShuffle
      />
    </Block>
  );
};

export default WaitingChatBody;

const styles = StyleSheet.create({
  dividedContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {},
  centralContainer: {},
  bottomContainer: {
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

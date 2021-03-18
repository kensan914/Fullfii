import React from "react";
import { Block, Text } from "galio-framework";
import { StyleSheet } from "react-native";
import { ChatSwitch } from "../molecules/ChatModal";
import { AllMessage, TalkTicketKey } from "../types/Types.context";
import { useProfileState } from "../contexts/ProfileContext";
import { CommonMessage } from "./Chat";
import SvgButton from "../atoms/SvgButton";
import useShuffle from "../hooks/useShuffle";
import Spinner from "react-native-loading-spinner-overlay";

type Props = {
  talkTicketKey: TalkTicketKey;
  commonMessage: AllMessage;
};
const StoppingChatBody: React.FC<Props> = (props) => {
  const { talkTicketKey, commonMessage } = props;

  const {
    canTalkHeterosexual,
    setCanTalkHeterosexual,
    canTalkDifferentJob,
    setCanTalkDifferentJob,
    isSpeaker,
    setIsSpeaker,
    isShowSpinner,
    isOpenEndTalk,
    canPressBackdrop,
    onPressStop,
    onPressShuffle,
    closeChatModal,
    isSecretJob,
    isSecretGender,
    roomId,
  } = useShuffle(talkTicketKey);

  const profileState = useProfileState();

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
        <Text bold size={18} color={"dimgray"} style={{ textAlign: "center" }}>
          条件を絞ることでミスマッチ{"\n"}を防ぐことができます
        </Text>
      </Block>

      <Block
        flex={0.45}
        style={[styles.dividedContainer, styles.centralContainer]}
      >
        <Block>
          <Block style={{ justifyContent: "center" }}>
            <ChatSwitch
              title="話したい"
              value={isSpeaker}
              onChange={(val) => setIsSpeaker(val)}
            />
            <ChatSwitch
              title="聞きたい"
              value={!isSpeaker}
              onChange={(val) => setIsSpeaker(!val)}
            />
          </Block>
          <Block style={{ justifyContent: "center", marginTop: 10 }}>
            <ChatSwitch
              title={
                isSecretJob
                  ? "話し相手を職業で絞る"
                  : `話し相手を${profileState.profile.job?.label}に絞る`
              }
              value={!canTalkDifferentJob}
              onChange={() => {
                setCanTalkDifferentJob(!canTalkDifferentJob);
              }}
              disable={isSecretJob}
              alertMessageWhenDisable="話し相手を職業で絞り込むには職業を内緒以外に設定して下さい"
            />
            <ChatSwitch
              title="話し相手に異性を含む"
              value={canTalkHeterosexual}
              onChange={setCanTalkHeterosexual}
              disable={isSecretGender}
              alertMessageWhenDisable="話し相手を性別で絞り込むには性別を内緒以外に設定して下さい"
            />
          </Block>
        </Block>
      </Block>

      <Block
        flex={0.35}
        style={[styles.dividedContainer, styles.bottomContainer]}
      >
        <SvgButton
          source={require("../../assets/icons/pinkLoop.svg")}
          onPress={() => onPressShuffle()}
        />
        <Spinner visible={isShowSpinner} overlayColor="rgba(0,0,0,0.3)" />
      </Block>
    </Block>
  );
};

export default StoppingChatBody;

const styles = StyleSheet.create({
  dividedContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    // backgroundColor: "red",
    justifyContent: "space-around",
  },
  centralContainer: {
    // backgroundColor: "green",
  },
  bottomContainer: {
    // backgroundColor: "blue",
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

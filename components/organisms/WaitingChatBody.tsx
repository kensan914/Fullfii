import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import { StyleSheet } from "react-native";
import { ChatSwitch } from "../molecules/ChatModal";
import { TalkTicket } from "../types/Types.context";
import { useProfileState } from "../contexts/ProfileContext";
import { formatGender } from "../modules/support";
import ModalButton from "../atoms/ModalButton";

type Props = {
  talkTicket: TalkTicket;
};
const WaitingChatBody: React.FC<Props> = (props) => {
  const { talkTicket } = props;

  const [canTalkHeterosexual, setCanTalkHeterosexual] = useState(
    talkTicket.canTalkHeterosexual
  );
  const [canTalkDifferentJob, setCanTalkDifferentJob] = useState(
    talkTicket.canTalkDifferentJob
  );
  const [isSpeaker, setIsSpeaker] = useState(talkTicket.isSpeaker);

  const profileState = useProfileState();
  const isSecretJob = profileState.profile.job.key === "secret";
  const isSecretGender =
    formatGender(
      profileState.profile.gender,
      profileState.profile.isSecretGender
    ).key === "secret";

  return (
    <Block flex={1}>
      <Block
        flex={0.2}
        style={[styles.dividedContainer, styles.headerContainer]}
      >
        <Text bold size={18} style={{ textAlign: "center" }}>
          条件を絞ることでミスマッチ{"\n"}を防ぐことができます
        </Text>
      </Block>

      <Block
        flex={0.45}
        style={[styles.dividedContainer, styles.centralContainer]}
      >
        {/* <Block style={styles.modalContents}> */}
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
              onChange={(val) => setCanTalkDifferentJob(!val)}
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
        {/* </Block> */}
      </Block>

      <Block
        flex={0.35}
        style={[styles.dividedContainer, styles.bottomContainer]}
      >
        <ModalButton
          icon="loop"
          iconFamily="MaterialIcons"
          onPress={() => {}}
        />
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

import React, {useState} from "react";
import { Alert, Dimensions, StyleSheet, Switch, TextInput } from "react-native";
import { Block, Text } from "galio-framework";
import Modal from "react-native-modal";
import Spinner from "react-native-loading-spinner-overlay";

import { EndTalkScreenType } from "../organisms/Chat";
import { TalkTicketKey } from "../types/Types.context";
import useShuffle from "../hooks/useShuffle";
import { useProfileState } from "../contexts/ProfileContext";
import { useAuthState } from "../contexts/AuthContext";
import { COLORS } from "../../constants/Theme";
import SvgButton from "../atoms/SvgButton";
import { between } from "fp-ts/lib/Ord";

const { width } = Dimensions.get("screen");

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  EndTalkScreen?: React.FC<EndTalkScreenType>;
  talkTicketKey: TalkTicketKey;
};
const ChatModal: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen, EndTalkScreen, talkTicketKey } = props;

  const authState = useAuthState();
//↓でstate値を引き継げるのか？
    // const { prevValue, screen: profileInputScreen } = route.params;
  const prevValue = "こんにちは"

  const [value, setValue] = useState(prevValue);

  const placeholder = ():string[] => {
    if (talkTicketKey==="ただ話したい") {
      if (isSpeaker) {
        return ["今の気分は？","話したいことはなんですか？","今日あった出来事、今の感情、気になってる映画について...なんでも大丈夫です！"]
      } else {
        return ["今の気分は？","一緒に話したいことはなんですか？","今日あった出来事、今の感情、気になってる映画について...なんでも大丈夫です！"]
      }
    } else {
      if (isSpeaker) {
        return ["悩みやモヤモヤを？","悩んでることはなんですか？","友達に裏切られた、好きな人ができた、寂しいから話したい...なんでも大丈夫です！"]
      } else {
        return ["悩みやモヤモヤを？","力になってあげられそうな悩みはなんですか？","人間関係でアドバイスできる、片想いの悩みで共感できる、ただ話しをきいてあげる...なんでも大丈夫です！"]
      }
    }
  }

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
  } = useShuffle(talkTicketKey, setIsOpen);

  return (
    <>
      <Modal
        backdropOpacity={0.3}
        isVisible={isOpen}
        onBackdropPress={() => {
          if (canPressBackdrop || typeof canPressBackdrop === "undefined")
            closeChatModal();
        }}
        style={styles.modal}
      >
        <Spinner visible={isShowSpinner} overlayColor="rgba(0,0,0,0)" />

        <Block style={styles.modalContents}>
          <Block>
            <Text
              bold
              size={15}
              style={{ textAlign: "center", paddingBottom: 18 }}
              color={COLORS.PINK}
            >
              気楽に話し相手をシャッフルしましょう
            </Text>
            <Block style={{ justifyContent: "center",alignItems: "center", }}>
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
              {/* <ChatSwitch
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
              /> */}
              <Block
                style={styles.textArea}
              >
                <TextInput
                multiline
                numberOfLines={4}
                editable

                maxLength={250}
                placeholder={placeholder()[2]}
                value={value}
                onChangeText={(text) => setValue(text)}
                />
              </Block>
            </Block>
            <Block />
            <Block
              row
              center
              style={{ justifyContent: "center", marginTop: 20 }}
            >
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
                  onPress={onPressShuffle}
                  diameter={width / 5.5}
                />
              </Block>
            </Block>
          </Block>
        </Block>

        {roomId.current && authState.token && EndTalkScreen ? (
          <EndTalkScreen
            isOpen={isOpenEndTalk}
            closeChatModal={closeChatModal}
            roomId={roomId.current}
            token={authState.token}
          />
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
};

export default ChatModal;

type ChatSwitchProps = {
  title: string;
  onChange: (val: boolean) => void;
  value: boolean;
  disable?: boolean;
  alertMessageWhenDisable?: string;
};
export const ChatSwitch: React.FC<ChatSwitchProps> = (props) => {
  const {
    title,
    onChange,
    value,
    disable = false,
    alertMessageWhenDisable = "",
  } = props;

  return (
    <>
      <Block row space="between" style={styles.settingsCard}>
        <Block>
          <Text
            bold
            size={15}
            color={disable ? "silver" : "dimgray"}
            style={{ marginRight: 40}}
          >
            {title}
          </Text>
        </Block>
        <Block style={{ alignItems: "center", justifyContent: "center" }}>
          <Switch
            trackColor={{
              false: disable ? "gainsboro" : "dimgray",
              true: "#F69896",
            }}
            ios_backgroundColor={disable ? "gainsboro" : "gray"}
            value={disable ? false : value}
            style={{ marginVertical: 8, marginLeft: 40 }}
            onValueChange={(val) => {
              if (alertMessageWhenDisable && disable)
                Alert.alert(alertMessageWhenDisable);
              onChange(val);
            }}
          />
        </Block>
      </Block>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
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
  settingsCard: {
    backgroundColor: "white",
    alignItems: "center",
  },
  textArea: {
    height:150,
    borderColor: "silver",
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 30,

    borderRadius: 10,
    backgroundColor: "white",
  }
});

import React, {useState} from "react";
import { Block, Text, Button } from "galio-framework";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { ChatSwitch } from "../molecules/ChatModal";
import { AllMessage, TalkTicketKey } from "../types/Types.context";
import { useProfileState } from "../contexts/ProfileContext";
import { CommonMessage } from "./Chat";
import { InputBlock } from "./ProfileInputBlock";
import {
  ProfileInputRouteProp,
  RequestPatchProfile,
  RequestPutGender,
} from "../types/Types";
import SvgButton from "../atoms/SvgButton";
import useShuffle from "../hooks/useShuffle";
import SvgUri from "react-native-svg-uri";
import { COLORS } from "../../constants/Theme";
import pinkLoop from "../../assets/icons/pinkLoop.svg"
import Spinner from "react-native-loading-spinner-overlay";


type Props = {
  talkTicketKey: TalkTicketKey;
  commonMessage: AllMessage;
  requestPatchProfile: RequestPatchProfile;
  requestPutGender: RequestPutGender;
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
    onPressShuffle,
    isSecretJob,
    isSecretGender,
  } = useShuffle(talkTicketKey, undefined, false);

  // const { requestPatchProfile, requestPutGender } = props;
  // const route = useRoute<ProfileInputRouteProp>();
  // const { prevValue, screen: profileInputScreen } = route.params;
  const prevValue = ""
  const profileInputScreen = "InputIntroduction"
  // const authState = useAuthState();
  // const profileDispatch = useProfileDispatch();

  const [value, setValue] = useState(prevValue);
  const [canSubmit, setCanSubmit] = useState(false);
  const [validationText, setValidationText] = useState("");

  const profileState = useProfileState();


  //returnで配列を返す。[0]=switchのサブタイトル、[1]=textareaのサブタイトル、[2]=textareaのplaceholder
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

  return (
    <Block flex={1}>
      <Block flex={0.2} style={[styles.dividedContainer]}>
        {"common" in commonMessage && (
          <Block style={{}}>
            <CommonMessage message="マッチする前に確認画面が表示されますので、気軽に話し相手を探してみましょう" />
          </Block>
        )}
      </Block>
      <Block flex={0.05} style={styles.subTitle}>
        <Text bold color="#909090">
        {placeholder()[0]}
        </Text>
      </Block>
      <Block
        flex={0.25}
        style={[styles.dividedContainer, styles.centralContainer]}
      >
        <Block>
        {validationText ? <Block style={styles.container}>
          <Text
            color="red"
            style={{ paddingHorizontal: 10, paddingVertical: 3 }}
          >
            {validationText}
          </Text>
        </Block> : null}
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
          {/* <Block style={{ justifyContent: "center", marginTop: 10 }}>
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
          </Block> */}
        </Block>
      </Block>
      <Block flex={0.05} style={styles.subTitle}>
        <Text bold color="#909090">
        {placeholder()[1]}
        </Text>
      </Block>
      <Block
        flex={0.35}
        style={styles.textArea}
      >
        <TextInput
        multiline
        numberOfLines={4}
        editable

        maxLength={250}
        value={value}
        placeholder={placeholder()[2]}
        onChangeText={(text) => setValue(text)}
        />
      </Block>

      <Block
        flex={0.2}
        style={[styles.dividedContainer, styles.bottomContainer]}
      >
        {/* <SvgButton
          source={require("../../assets/icons/pinkLoop.svg")}
          onPress={() => onPressShuffle()}
        /> */}
        {/* <Button round uppercase color="error">話し相手を探す！</Button> */}
        <TouchableOpacity style={styles.touchableOpacity} onPress={() => onPressShuffle()}>
          <Block flex row>
            <Block flex={0.2} center style={styles.buttonSvgIcon}>
              <SvgUri
                width={40}
                height={40}
                source={pinkLoop}
              />
            </Block>
            <Block flex={0.8}center style={styles.buttonText}>
              <Text bold size={20} color={COLORS.PINK}>
                話し相手を探す!
              </Text>
            </Block>
          </Block>
        </TouchableOpacity>
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
  headerContainer: {},
  centralContainer: {
    justifyContent: "center",
  },
  bottomContainer: {},
  container: {
    // paddingHorizontal: theme.SIZES.BASE,
    // marginVertical: theme.SIZES.BASE,
    // paddingBottom: theme.SIZES.BASE * 5,
  },
  subTitle: {
    justifyContent: "center",
    paddingLeft: 30
  },
  textArea: {
    height:150,
    borderColor: "silver",
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 20,
    marginEnd: 20,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
  touchableOpacity: {
    width: 300,
    height:50,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: COLORS.PINK,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  buttonSvgIcon: {
    justifyContent: "center",
    paddingLeft: 20
  },
  buttonText: {
    justifyContent: "center",
    paddingRight: 20
  }
});

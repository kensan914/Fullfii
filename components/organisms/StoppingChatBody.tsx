import React from "react";
import { Block, Text } from "galio-framework";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { ChatSwitch } from "../molecules/ChatModal";
import { AllMessage, TalkTicketKey } from "../types/Types.context";
import { CommonMessage } from "./Chat";
import { RequestPatchProfile, RequestPutGender } from "../types/Types";
import useShuffle from "../hooks/useShuffle";
import SvgUri from "react-native-svg-uri";
import { COLORS } from "../../constants/Theme";
import pinkLoop from "../../assets/icons/pinkLoop.svg";
import Spinner from "react-native-loading-spinner-overlay";

type Props = {
  talkTicketKey: TalkTicketKey;
  commonMessage: AllMessage;
  // requestPatchProfile: RequestPatchProfile;
  // requestPutGender: RequestPutGender;
};
const StoppingChatBody: React.FC<Props> = (props) => {
  const { talkTicketKey, commonMessage } = props;

  const {
    topic,
    setTopic,
    isSpeaker,
    setIsSpeaker,
    isShowSpinner,
    onPressShuffle,
    genePlaceholder,
  } = useShuffle(talkTicketKey, undefined, false);

  // const { requestPatchProfile, requestPutGender } = props;
  // const route = useRoute<ProfileInputRouteProp>();
  // const { prevValue, screen: profileInputScreen } = route.params;
  // const profileInputScreen = "InputIntroduction";

  // const [validationText, setValidationText] = useState("");

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
          {genePlaceholder(talkTicketKey)[0]}
        </Text>
      </Block>
      <Block
        flex={0.25}
        style={[styles.dividedContainer, styles.centralContainer]}
      >
        <Block>
          {/* {validationText ? (
            <Block style={styles.container}>
              <Text
                color="red"
                style={{ paddingHorizontal: 10, paddingVertical: 3 }}
              >
                {validationText}
              </Text>
            </Block>
          ) : null} */}
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
          {genePlaceholder(talkTicketKey)[1]}
        </Text>
      </Block>
      <Block flex={0.35} style={styles.textAreaContainer}>
        <TextInput
          multiline
          numberOfLines={4}
          editable
          maxLength={250}
          value={topic}
          placeholder={genePlaceholder(talkTicketKey)[2]}
          onChangeText={setTopic}
          style={styles.textArea}
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
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={() => onPressShuffle()}
        >
          <Block flex row>
            <Block flex={0.2} center style={styles.buttonSvgIcon}>
              <SvgUri width={40} height={40} source={pinkLoop} />
            </Block>
            <Block flex={0.8} center style={styles.buttonText}>
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
    paddingLeft: 30,
  },
  textAreaContainer: {
    height: 150,
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "white",
  },
  textArea: {
    height: 150,
    borderColor: "silver",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
  },
  touchableOpacity: {
    width: 300,
    height: 50,
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
    paddingLeft: 20,
  },
  buttonText: {
    justifyContent: "center",
    paddingRight: 20,
  },
});

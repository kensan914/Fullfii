import React from "react";
import { Block, Text, theme } from "galio-framework";
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { ChatSwitch } from "../molecules/ChatModal";
import { AllMessage, TalkTicketKey } from "../types/Types.context";
import { CommonMessage } from "./Chat";
import useShuffle from "../hooks/useShuffle";
import SvgUri from "react-native-svg-uri";
import { COLORS } from "../../constants/Theme";
import pinkLoop from "../../assets/icons/pinkLoop.svg";

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
    onPressShuffle,
    genePlaceholder,
  } = useShuffle(talkTicketKey, undefined, false);

  // const { requestPatchProfile, requestPutGender } = props;
  // const route = useRoute<ProfileInputRouteProp>();
  // const { prevValue, screen: profileInputScreen } = route.params;
  // const profileInputScreen = "InputIntroduction";

  // const [validationText, setValidationText] = useState("");

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Block flex>
        <KeyboardAvoidingView
          behavior="position"
          style={{
            flex: 0.85,
          }}
          contentContainerStyle={{ flex: 1 }}
          keyboardVerticalOffset={theme.SIZES.BASE * 3}
        >
          <Block flex={0.2} style={[styles.dividedContainer]}>
            {"common" in commonMessage && (
              <CommonMessage message="マッチする前に確認画面が表示されますので、気軽に話し相手を探してみましょう" />
            )}
          </Block>
          <Block flex={0.1} style={styles.subTitle}>
            <Text bold color="#909090">
              {genePlaceholder(talkTicketKey)[0]}
            </Text>
          </Block>
          <Block
            flex={0.25}
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
            </Block>
          </Block>
          <Block flex={0.1} style={styles.subTitle}>
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
              returnKeyType="done"
              blurOnSubmit
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
          </Block>
        </KeyboardAvoidingView>

        <Block flex={0.15} style={styles.buttonContainer}>
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
          {/* <Spinner visible={isShowSpinner} overlayColor="rgba(0,0,0,0.3)" /> */}
        </Block>
      </Block>
    </TouchableWithoutFeedback>
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
  buttonContainer: {
    alignItems: "center",
  },
});

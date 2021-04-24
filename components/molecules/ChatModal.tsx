import React from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Block, Text } from "galio-framework";
import Modal from "react-native-modal";
// import Spinner from "react-native-loading-spinner-overlay";
import Spinner from "../atoms/Spinner";

import { EndTalkScreenType } from "../organisms/Chat";
import { TalkTicketKey } from "../types/Types.context";
import useShuffle from "../hooks/useShuffle";
import { useAuthState } from "../contexts/AuthContext";
import { COLORS } from "../../constants/Theme";
import SvgButton from "../atoms/SvgButton";
import SvgUri from "react-native-svg-uri";

const { width } = Dimensions.get("screen");

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  EndTalkScreen?: React.FC<EndTalkScreenType>;
  talkTicketKey: TalkTicketKey;
  isOnlyShuffle?: boolean;
};
const ChatModal: React.FC<Props> = (props) => {
  const {
    isOpen,
    setIsOpen,
    EndTalkScreen,
    talkTicketKey,
    isOnlyShuffle = false,
  } = props;

  const authState = useAuthState();
  //↓でstate値を引き継げるのか？
  // const { prevValue, screen: profileInputScreen } = route.params;

  const {
    topic,
    setTopic,
    isSpeaker,
    setIsSpeaker,
    isShowSpinner,
    isOpenEndTalk,
    canPressBackdrop,
    onPressStop,
    onPressShuffle,
    closeChatModal,
    roomId,
    genePlaceholder,
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
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <KeyboardAvoidingView behavior="padding" style={{}}>
            {/* <Spinner visible={isShowSpinner} overlayColor="rgba(0,0,0,0)" /> */}

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
                <Block
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
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
                  <Block style={styles.textAreaContainer}>
                    <TextInput
                      multiline
                      numberOfLines={4}
                      editable
                      maxLength={250}
                      placeholder={genePlaceholder(talkTicketKey)[2]}
                      value={topic}
                      onChangeText={setTopic}
                      style={styles.textArea}
                      returnKeyType="done"
                      blurOnSubmit
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                    />
                  </Block>
                </Block>

                <Block
                  row
                  center
                  style={{ justifyContent: "center", marginTop: 20 }}
                >
                  {isOnlyShuffle ? (
                    <TouchableOpacity
                      style={styles.onlyShuffleButton}
                      onPress={() => {
                        onPressShuffle();
                      }}
                    >
                      <Block flex row>
                        <Block
                          flex={0.2}
                          center
                          style={styles.onlyShuffleButtonIcon}
                        >
                          <SvgUri
                            width={40}
                            height={40}
                            source={require("../../assets/icons/pinkLoop.svg")}
                          />
                        </Block>
                        <Block
                          flex={0.8}
                          center
                          style={styles.onlyShuffleButtonText}
                        >
                          <Text bold size={20} color={COLORS.PINK}>
                            話し相手を探す!
                          </Text>
                        </Block>
                      </Block>
                    </TouchableOpacity>
                  ) : (
                    <>
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
                    </>
                  )}
                </Block>
              </Block>
            </Block>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

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
            style={{ marginRight: 40 }}
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
  textAreaContainer: {
    height: 150,
    width: width * 0.8,
    alignSelf: "center",

    marginHorizontal: 30,
    backgroundColor: "white",
  },
  textArea: {
    width: width * 0.8,
    alignSelf: "center",
    height: 150,
    borderColor: "silver",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "white",
  },

  onlyShuffleButton: {
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
  onlyShuffleButtonIcon: {
    justifyContent: "center",
    paddingLeft: 20,
  },
  onlyShuffleButtonText: {
    justifyContent: "center",
    paddingRight: 20,
  },
});

import React, { useState } from "react";
import { Dimensions, Alert, StyleSheet } from "react-native";
import { Block, Text, theme, Button } from "galio-framework";
import * as WebBrowser from "expo-web-browser";

import Avatar from "../atoms/Avatar";
import Icon from "../atoms/Icon";
import { useProfileState } from "../contexts/ProfileContext";
import ModalButton from "../atoms/ModalButton";
import { COLORS } from "../../constants/Theme";
import { CommonMessage } from "./Chat";
// import { alertModal, URLJoin } from "../modules/support";
// import { useAxios } from "../modules/axios";
// import { BASE_URL, REPORT_URL } from "../../constants/env";
import { useChatDispatch } from "../contexts/ChatContext";
import { useAuthState } from "../contexts/AuthContext";
// import {
//   MeProfile,
//   Profile,
//   TalkTicket,
//   TalkTicketJson,
//   TalkTicketJsonIoTs,
// } from "../types/Types.context";
import { useNavigation } from "@react-navigation/native";
const { width } = Dimensions.get("window");

const ApprovingChatBody = (props) => {
  const { isOpen, setIsOpen, profile, talkTicket } = props;
  const navigation = useNavigation();
  const profileState = useProfileState();
  // const user = profile.me ? profileState.profile : profile;

  const authState = useAuthState();
  const chatDispatch = useChatDispatch();
  //   const { request: requestReport } = useAxios(
  //     URLJoin(BASE_URL, "talk-ticket/", talkTicket?.id),
  //     "post",
  //     TalkTicketJsonIoTs,
  //     {
  //       data: {
  //         status: "waiting",
  //       },
  //       thenCallback: (resData) => {
  //         const newTalkTicket = resData as TalkTicketJson;
  //         (async () => {
  //           await WebBrowser.openBrowserAsync(REPORT_URL);
  //           chatDispatch({
  //             type: "OVERWRITE_TALK_TICKET",
  //             talkTicket: newTalkTicket,
  //           });
  //           navigation.navigate("Home");
  //         })();
  //       },
  //       token: authState.token ? authState.token : "",
  //       limitRequest: 1,
  //     }
  //   );
  //   const onPressReport = () => {
  //     setCanPressBackdrop(false);
  //     alertModal({
  //       mainText: "通報します。",
  //       subText: "トークは終了され、通報ページに移動します。よろしいですか？",
  //       cancelButton: "キャンセル",
  //       okButton: "通報する",
  //       onPress: () => {
  //         setCanPressBackdrop(true);
  //         requestReport();
  //       },
  //       cancelOnPress: () => setCanPressBackdrop(true),
  //     });
  //   };

  //   const { request: requestBlock } = useAxios(
  //     URLJoin(BASE_URL, "users/", user.id, "block/"),
  //     "patch",
  //     null,
  //     {
  //       data: {
  //         status: "waiting",
  //       },
  //       thenCallback: async () => {
  //         Alert.alert(`${user.name}さんをブロックしました。`);
  //       },
  //       catchCallback: (err) => {
  //         if (
  //           err?.response &&
  //           err.response.data.type === "have_already_blocked"
  //         ) {
  //           Alert.alert(err.response.data.message);
  //         }
  //       },
  //       token: authState.token ? authState.token : "",
  //       limitRequest: 1,
  //     }
  //   );
  //   const onPressBlock = () => {
  //     alertModal({
  //       mainText: `${user.name}さんをブロックしますか？`,
  //       subText: `あなたの端末と${user.name}さんの端末からお互いの情報が表示されなくなります。また、相手にこのブロックは通知されません。`,
  //       cancelButton: "キャンセル",
  //       okButton: "ブロックする",
  //       onPress: () => {
  //         setCanPressBackdrop(true);
  //         requestBlock();
  //       },
  //       cancelOnPress: () => setCanPressBackdrop(true),
  //     });
  //   };

  const [canPressBackdrop, setCanPressBackdrop] = useState(true);
  return (
    <Block flex={1}>
      <Block
        flex={0.2}
        style={[styles.dividedContainer, styles.headerContainer]}
      >
        <Block style={styles.commonMessage}>
          <Text
            style={{ alignSelf: "center", lineHeight: 18 }}
            bold
            size={14}
            color="#F69896"
          >
            条件に合う話し相手が見つかりました。
          </Text>
        </Block>
        {/* <Block flex={0.2} style={[styles.dividedContainer, styles.headerContainer]}>
        {"common" in commonMessage && (
          <Block style={{}}>
            <CommonMessage message={commonMessage.message} />
          </Block>
        )}
      </Block> */}
      </Block>
      <Block
        shadow={true}
        shadowColor={"#676767"}
        style={[
          styles.modalContents,
          {
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
            margin: 20,
            borderRadius: 20,
          },
        ]}
        flex={0.5}
      >
        <Block row center style={{ marginTop: 24, marginHorizontal: 15 }}>
          <Block flex={0.4} center>
            <Text bold size={15} color="dimgray">
              {/* {user.name} */}けんと
            </Text>
          </Block>
          <Block flex={0.4} center>
            <Avatar size={75} image={false} border={false} />
          </Block>
          <Block flex={0.4} center>
            <Text bold size={15} color="dimgray">
              {/* {user.job.label} */}エンジニア
            </Text>
          </Block>
        </Block>
        {/* {user.me && (
          <Block row center style={{ marginVertical: 28 }}>
            <Block center column>
              <Text bold size={16} color="#333333">
                {user.numOfThunks}
              </Text>
              <Text muted size={15}>
                <Icon
                  name="heart"
                  family="font-awesome"
                  color="#F69896"
                  size={15}
                />{" "}
                ありがとう
              </Text>
            </Block>
          </Block>
        )} */}
        <Block row center style={{ marginVertical: 28 }}>
          <Block center column>
            <Text bold size={16} color="#333333">
              20{/*{user.numOfThunks} */}
            </Text>
            <Text muted size={15}>
              <Icon
                name="heart"
                family="font-awesome"
                color="#F69896"
                size={15}
              />{" "}
              ありがとう
            </Text>
          </Block>
        </Block>
        <Block center>
          <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>
            {/* {user.introduction} */}よろしくね
          </Text>
        </Block>
        {/* {user.me ? (
          <Block center>
            <Button
              round
              color="lightcoral"
              opacity={0.9}
              style={styles.bottomButton}
              onPress={() => {
                setIsOpen(false);
                navigation.navigate("ProfileEditor");
              }}
            >
              <Text color="white" size={16}>
                <Icon
                  name="pencil"
                  family="font-awesome"
                  color="white"
                  size={16}
                />{" "}
                プロフィールを編集する
              </Text>
            </Button>
          </Block>
        ) : (
          <Block row center style={{ marginVertical: theme.SIZES.BASE * 2 }}>
            <Block flex={0.45} center>
              <ModalButton
                icon="notification"
                iconFamily="AntDesign"
                colorLess
                onPress={}
              />
            </Block>
            <Block flex={0.1} />
            <Block flex={0.45} center>
              <ModalButton
                icon="block"
                iconFamily="Entypo"
                colorLess
                onPress={}
              />
            </Block>
          </Block>
        )} */}

        <Block row center style={{ marginVertical: theme.SIZES.BASE * 2 }}>
          <Block flex={0.45} center>
            <ModalButton
              icon="notification"
              iconFamily="AntDesign"
              colorLess
              // onPress={onPressReport}
            />
          </Block>
          <Block flex={0.1} />
          <Block flex={0.45} center>
            <ModalButton
              icon="block"
              iconFamily="Entypo"
              colorLess
              // onPress={onPressBlock}
            />
          </Block>
        </Block>
      </Block>
      <Block flex={0.3} style={styles.signupButtonContainer}>
        <Button
          round
          color={COLORS.PINK}
          // shadowless={!canNext}
          shadowColor={COLORS.PINK}
          style={[styles.goNextButton]}
          // disabled={!canNext || isLoading}
          // loading={isLoading}
          // onPress={pressCallback}
        >
          <Text bold color="white" size={16}>
            メッセージを送信する
          </Text>
        </Button>

        <Button
          round
          color={"darkgray"}
          // shadowColor={"darkgray"}
          shadowless
          style={{ marginTop: 16 }}
          // onPress={pressSubCallback}
        >
          <Text bold color="white" size={16}>
            話し相手を変更する
          </Text>
        </Button>
      </Block>
    </Block>
  );
};

export default ApprovingChatBody;

const styles = StyleSheet.create({
  commonMessage: {
    backgroundColor: "lavenderblush",
    width: "80%",
    alignSelf: "center",
    padding: theme.SIZES.BASE / 2,
    borderRadius: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE / 2,
  },
  dividedContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    // backgroundColor: "red",
  },
  signupButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  goNextButton: {
    alignSelf: "center",
  },
  modal: {
    justifyContent: "center",
  },
  modalContents: {
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 20,
  },

  settingsCard: {
    backgroundColor: "white",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    paddingBottom: 40,
  },
  bottomButton: {
    shadowColor: "lightcoral",
    alignSelf: "center",
    marginVertical: theme.SIZES.BASE * 2,
  },
});

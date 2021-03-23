import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Block, Text, theme, Button } from "galio-framework";

import Avatar from "../atoms/Avatar";
import Icon from "../atoms/Icon";
import ModalButton from "../atoms/ModalButton";
import { COLORS } from "../../constants/Theme";
import { useAxios } from "../modules/axios";
import { URLJoin } from "../modules/support";
import { BASE_URL } from "../../constants/env";
import {
  AllMessage,
  TalkTicket,
  TalkTicketJson,
  TalkTicketJsonIoTs,
  TalkTicketKey,
} from "../types/Types.context";
import useAllContext from "../contexts/ContextUtils";
import { initConnectWsChat } from "../../screens/StartUpManager";
import ChatModal from "../molecules/ChatModal";
import useProfileModal from "../hooks/useProfileModal";

type Props = {
  talkTicket: TalkTicket;
  commonMessage: AllMessage;
  talkTicketKey: TalkTicketKey;
};
const ApprovingChatBody: React.FC<Props> = (props) => {
  const { talkTicket, commonMessage, talkTicketKey } = props;

  const [states, dispatches] = useAllContext();
  const _token = states.authState.token ? states.authState.token : "";
  const { request, isLoading } = useAxios(
    URLJoin(BASE_URL, "talk-ticket/", talkTicket.id),
    "post",
    TalkTicketJsonIoTs,
    {
      thenCallback: (resData) => {
        const _resData = resData as TalkTicketJson;
        const newTalkTicketJson = _resData;

        dispatches.chatDispatch({
          type: "OVERWRITE_TALK_TICKET",
          talkTicket: newTalkTicketJson,
        });

        // ws接続. -> start talk
        initConnectWsChat(
          talkTicket.room.id,
          _token,
          states,
          dispatches,
          newTalkTicketJson
        );
      },
      finallyCallback: () => {
        // 遅延したchatDispatchを実行(同時にマッチしていた場合はSTART_TALKが実行される)
        dispatches.chatDispatch({ type: "TURN_OFF_DELAY" });
      },
      didRequestCallback: () => {
        // この後のchatDispatchを遅延する(同時にマッチしていた場合はSTART_TALKが遅延される)
        dispatches.chatDispatch({
          type: "TURN_ON_DELAY",
          excludeType: ["OVERWRITE_TALK_TICKET"],
        });
      },
      token: _token,
    }
  );

  const { onPressReport, onPressBlock, user } = useProfileModal(
    talkTicket.room.user,
    talkTicket
  );

  const [isOpenChatModal, setIsOpenChatModal] = useState(false);

  return (
    <>
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
              {commonMessage?.message}
            </Text>
          </Block>
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
                {user.name}
              </Text>
            </Block>
            <Block flex={0.4} center>
              <Avatar size={75} image={false} border={false} />
            </Block>
            <Block flex={0.4} center>
              <Text bold size={15} color="dimgray">
                {user.job.label}
              </Text>
            </Block>
          </Block>
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
          <Block center>
            <Text
              bold
              size={15}
              color="dimgray"
              style={{ marginHorizontal: 15 }}
            >
              {user.introduction}
            </Text>
          </Block>

          <Block row center style={{ marginVertical: theme.SIZES.BASE * 2 }}>
            <Block flex={0.45} center>
              <ModalButton
                icon="notification"
                iconFamily="AntDesign"
                colorLess
                onPress={onPressReport}
              />
            </Block>
            <Block flex={0.1} />
            <Block flex={0.45} center>
              <ModalButton
                icon="block"
                iconFamily="Entypo"
                colorLess
                onPress={onPressBlock}
              />
            </Block>
          </Block>
        </Block>
        <Block flex={0.3} style={styles.signupButtonContainer}>
          <Button
            round
            color={COLORS.PINK}
            shadowColor={COLORS.PINK}
            style={[styles.goNextButton]}
            loading={isLoading}
            onPress={() => {
              request({
                data: {
                  status: "talking",
                },
              });
            }}
          >
            <Text bold color="white" size={16}>
              メッセージを送信する
            </Text>
          </Button>

          <Button
            round
            color={"darkgray"}
            shadowless
            style={{ marginTop: 16 }}
            onPress={() => {
              setIsOpenChatModal(true);
            }}
          >
            <Text bold color="white" size={16}>
              話し相手を変更する
            </Text>
          </Button>
        </Block>
      </Block>

      <ChatModal
        isOpen={isOpenChatModal}
        setIsOpen={setIsOpenChatModal}
        talkTicketKey={talkTicketKey}
      />
    </>
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

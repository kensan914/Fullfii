import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Block, Text, theme, Button } from "galio-framework";

import Avatar from "src/components/atoms/Avatar";
import Icon from "src/components/atoms/Icon";
import { COLORS } from "src/constants/theme";
import { useAxios } from "src/hooks/useAxios";
import { URLJoin } from "src/utils";
import { BASE_URL } from "src/constants/env";
import {
  AllMessage,
  TalkTicket,
  TalkTicketJson,
  TalkTicketJsonIoTs,
  TalkTicketKey,
} from "src/types/Types.context";
import useAllContext from "src/contexts/ContextUtils";
import { initConnectWsChat } from "src/screens/StartUpManager";
import ChatModal from "src/components/molecules/ChatModal";
import useProfileModal from "src/hooks/useProfileModal";

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
              color={COLORS.GRAY}
            >
              {commonMessage?.message}
            </Text>
          </Block>
        </Block>
        <Block
          shadow={true}
          style={[
            styles.modalContents,
            {
              backgroundColor: COLORS.WHITE,
              alignItems: "center",
              justifyContent: "center",
              margin: 20,
              borderRadius: 20,
              paddingVertical: 30,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.26,
              shadowRadius: 0,
              elevation: 1,
            },
          ]}
          flex={0.5}
        >
          <Block row center style={{ marginTop: 24, marginHorizontal: 15 }}>
            <Block flex={0.4} center>
              <Text bold size={15} color={COLORS.GRAY}>
                {user.name}
              </Text>
            </Block>
            <Block flex={0.4} center>
              <Avatar size={75} image={false} border={false} />
            </Block>
            <Block flex={0.4} center>
              <Block style={{ paddingVertical: 5 }}>
                <Text bold size={15} color={COLORS.GRAY}>
                  性別：{user.gender.label}
                </Text>
              </Block>
              <Block style={{ paddingVertical: 5 }}>
                <Text bold size={15} color={COLORS.GRAY}>
                  職業：{user.job.label}
                </Text>
              </Block>
            </Block>
          </Block>
          <Block row center style={{ marginVertical: 28 }}>
            <Block center column>
              <Text bold size={16} color={COLORS.GRAY}>
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
              {/* {user.introduction} */}
              {talkTicket.room?.userTopic}
            </Text>
          </Block>

          <Block row center style={{ marginVertical: theme.SIZES.BASE * 2 }}>
            <Block flex={0.45} center>
              <Button
                round
                uppercase
                color="#b0b0b0"
                shadowColor="#b0b0b0"
                style={styles.modalButton}
                onPress={onPressReport}
              >
                <Block row space="between">
                  <Block center style={{ paddingRight: 5 }}>
                    <Icon
                      name="notification"
                      family="AntDesign"
                      color={COLORS.WHITE}
                      size={25}
                    />
                  </Block>
                  <Block center>
                    <Text size={16} color={COLORS.WHITE} bold>
                      通報
                    </Text>
                  </Block>
                </Block>
              </Button>
              {/* <TouchableOpacity
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
            </TouchableOpacity> */}
              {/* <ModalButton
                icon="notification"
                iconFamily="AntDesign"
                colorLess
                onPress={onPressReport}
              /> */}
            </Block>
            <Block flex={0.1} />
            <Block flex={0.45} center>
              {/* <ModalButton
                icon="block"
                iconFamily="Entypo"
                colorLess
                onPress={onPressBlock}
              /> */}
              <Button
                round
                uppercase
                color="#b0b0b0"
                shadowColor="#b0b0b0"
                style={styles.modalButton}
                onPress={onPressBlock}
              >
                <Block row space="between">
                  <Block center style={{ paddingRight: 5 }}>
                    <Icon
                      name="block"
                      family="Entypo"
                      color={COLORS.WHITE}
                      size={25}
                    />
                  </Block>
                  <Block center>
                    <Text size={16} color={COLORS.WHITE} bold>
                      ブロック
                    </Text>
                  </Block>
                </Block>
              </Button>
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
              {/* メッセージを送信する */}
              話してみる！
            </Text>
          </Button>

          <Button
            round
            color={COLORS.WHITE}
            style={{
              marginTop: 16,
              shadowColor: COLORS.GRAY,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.26,
              shadowRadius: 0,
              elevation: 1,
            }}
            onPress={() => {
              setIsOpenChatModal(true);
            }}
          >
            <Text bold color={COLORS.PINK} size={16}>
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
    backgroundColor: COLORS.BROWN_RGBA_1,
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
    shadowColor: "#ed775d",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.26,
    shadowRadius: 3,
    elevation: 1,
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
  modalButton: {
    width: 120,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.26,
    shadowRadius: 0,
    elevation: 1,
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

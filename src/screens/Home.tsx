import React from "react";
import { StyleSheet } from "react-native";
import { Block } from "galio-framework";
import { useNavigation } from "@react-navigation/native";

import { useChatState } from "src/contexts/ChatContext";
import HomeTemplate from "src/components/templates/HomeTemplate";
import { CARD_COLORS } from "src/constants/theme";
import { ADMOB_BANNER_HEIGHT, ADMOB_BANNER_WIDTH } from "src/constants/env";
import {
  AdmobItem,
  HomeItems,
  HomeNavigationProp,
  HomeRooms,
} from "src/types/Types";
import { HOME_IMG } from "src/constants/imagePath";

const Home: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const chatState = useChatState();
  const talkTickets = Object.values(chatState.talkTicketCollection);

  const rooms: HomeRooms = talkTickets
    .map((talkTicket) => {
      const choiceColor = () => {
        if (talkTicket.worry.key in CARD_COLORS) {
          return CARD_COLORS[talkTicket.worry.key];
        } else {
          return [""];
        }
      };

      const choiceImg = () => {
        if (talkTicket.worry.key in HOME_IMG) {
          return HOME_IMG[talkTicket.worry.key];
        } else {
          return "";
        }
      };

      return {
        key: talkTicket.worry.key,
        title: talkTicket.worry.label,
        color: choiceColor(),
        image: choiceImg(),
        content:
          talkTicket.room.messages[talkTicket.room.messages.length - 1]
            ?.message,
        onPress: () => {
          navigation.navigate("Chat", {
            talkTicketKey: talkTicket.worry.key,
          });
        },
        countNum: talkTicket.room.unreadNum,
      };
    })
    .sort((roomA, roomB) => {
      // 降順
      if (roomA.key < roomB.key) {
        return 1;
      } else {
        return -1;
      }
    });

  const admobItem: AdmobItem = {
    isAdmob: true,
  };

  const items: HomeItems = [admobItem, ...rooms];

  return (
    <Block flex style={styles.container}>
      <HomeTemplate items={items} />
    </Block>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
  },
  adMobBanner: {
    width: ADMOB_BANNER_WIDTH,
    height: ADMOB_BANNER_HEIGHT,
    zIndex: 2,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 0,
  },
});

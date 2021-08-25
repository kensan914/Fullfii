import React from "react";
import { Block, Text, Button} from "galio-framework";
import { StyleSheet, TouchableHighlight, Platform } from "react-native";

import { width } from "src/constants";
import { COLORS } from "src/constants/colors";
import { Avatar } from "src/components/atoms/Avatar";
import { Icon } from "src/components/atoms/Icon";

export const RecommendRoomCard: React.FC = (props) => {

  const {
    key,
    item
  } = props
  return (
    <TouchableHighlight
      activeOpacity={0.7}
      underlayColor={Platform.OS === "ios" ? "#DDDDDD" : COLORS.WHITE}
      onPress={() => {
        // setIsOpen(true);
      }}
      style={[styles.touchableHighlight, {marginLeft: item.id===1 ?  16 : 8}]}
      // disabled={room.owner.id === profileState.profile.id} // 自身が作成したルームは押下禁止
    >
      <Block style={styles.card}>
        <Block style={styles.title}>
          <Text
            size={16}
            color={COLORS.BLACK}
            bold
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            悩みを話したいと思っている人間ですが、何か問題でも？？悩みを話したいと思っている人間ですが、何か問題でも？？
            {/* {room.name} */}
          </Text>
        </Block>
        <Block row>
          <Block flex style={styles.roomInfoContainer}>
            <Block row style={styles.ownerContainer}>
              <Avatar
                size={32}
                // imageUri={room.owner.image}
                style={styles.avatar}
              />
              <Block column style={styles.ownerInfo}>
                <Block style={styles.ownerName}>
                  <Text
                    size={14}
                    color={COLORS.LIGHT_GRAY}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {/* {room.owner.name} */}
                    匿名子
                  </Text>
                </Block>
                <Block row>
                  <Block style={styles.ownerGender}>
                    <Text
                      size={14}
                      color={COLORS.LIGHT_GRAY}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      女性
                      {/* {formattedGender.label} */}
                    </Text>
                  </Block>
                  <Block>
                    <Text
                      size={14}
                      color={COLORS.LIGHT_GRAY}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      高校生
                      {/* {room.owner.job.label} */}
                    </Text>
                  </Block>
                </Block>
              </Block>
              <Block row center style={styles.statusItem}>
                <Icon
                  name="message1"
                  family="AntDesign"
                  size={24}
                  // color={
                  //   room.isSpeaker ? COLORS.LIGHT_BLUE : COLORS.ORANGE
                  // }
                  color={
                    COLORS.LIGHT_BLUE
                  }
                />
                <Block style={styles.statusText}>
                  <Text
                    size={14}
                    // color={
                    //   room.isSpeaker ? COLORS.LIGHT_BLUE : COLORS.ORANGE
                    // }
                    color={
                      COLORS.LIGHT_BLUE
                    }
                  >
                    {/* {room.isSpeaker ? "話したい" : "聞きたい"} */}
                    話したい
                  </Text>
                </Block>
              </Block>
            </Block>

          </Block>
        </Block>
      </Block>
    </TouchableHighlight>
  )
}


const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: "relative",
    width: 272,
    height: "auto",
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.26,
    shadowRadius: 0,
    elevation: 1,
  },
  touchableHighlight: {
    borderRadius: 20,
  },
  title: {
    marginBottom: 16,
  },
  roomInfoContainer: {
  },
  ownerContainer: {},
  avatar: {},
  ownerInfo: {
    marginLeft: 8,
    marginRight: 16
  },
  ownerName: {
    marginBottom: 4,
  },
  ownerGender: {
    marginRight: 4,
  },
  statusContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  statusText: {
    marginLeft: 8,
  },
  statusItem: {
    marginRight: 8,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 20,
  },
});
import React, {useState} from "react";
import { Text, Button, Block } from "galio-framework";
import {
  StyleSheet,
  Image,
  TextInput,
  Keyboard,
} from "react-native";
import { COLORS } from "src/constants/colors";
import { width, height } from "src/constants";
import { LECTURE_WOMAN_IMG } from "src/constants/imagePath";
import { Avatar } from "src/components/atoms/Avatar";
import { Icon } from "src/components/atoms/Icon";


export const ExplanationRoomParticipateTemplate: React.FC = () => {
  const room = {image: false, owner: {image: false, name: "ss"}}

  return (
    <Block flex style={styles.container}>
      <Block flex={0.35} center>
        <Block style={styles.card}>
          <Block style={styles.title}>
            <Text
              size={16}
              color={COLORS.BLACK}
              bold
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              好きな人がいるのですが、話しかけられません...話聞いて欲しいです！
            </Text>
          </Block>
          <Block flex row>
            <Block />
            {room.image ? (
              <Image source={{ uri: room.image }} style={styles.image} />
            ) : (
              <Block style={styles.image}></Block>
            )}
            <Block flex column>
              <Block row>
                <Image
                  source={LECTURE_WOMAN_IMG }
                  style={styles.cardAvatar}
                />
                <Block column style={styles.userInfo}>
                  <Block style={styles.userName}>
                    <Text
                      size={14}
                      color={COLORS.LIGHT_GRAY}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      匿名子
                    </Text>
                  </Block>
                  <Block row>
                    <Block style={styles.userGender}>
                      <Text
                        size={14}
                        color={COLORS.LIGHT_GRAY}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        女性
                      </Text>
                    </Block>
                    <Block>
                      <Text
                        size={14}
                        color={COLORS.LIGHT_GRAY}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                       内緒
                      </Text>
                    </Block>
                  </Block>
                </Block>
              </Block>
              <Block row>
                <Block flex row style={styles.member}>
                  <Block>
                    <Icon
                      name="person-outline"
                      family="Ionicons"
                      size={32}
                      color={COLORS.GRAY}
                    />
                  </Block>
                  <Block style={styles.memberText}>
                    <Text size={14} color={COLORS.LIGHT_GRAY}>
                      0/1
                    </Text>
                  </Block>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
      <Block flex={0.65} style={styles.messages}>
        <Block  row style={styles.leftMessageContainer}>
          <Image
            style={styles.avatar}
            source={ LECTURE_WOMAN_IMG }
          />
          <Block>
            <Block style={styles.leftMessage}>
              <Text size={14} color={COLORS.BLACK} numberOfLines={2} ellipsizeMode="tail">“ルーム”は悩みを話すためのトークルームのことだよ！</Text>
            </Block>
            <Text size={12} color={COLORS.LIGHT_GRAY} style={styles.textLineHeight}>21:23</Text>
          </Block>
        </Block>
        <Block  row style={styles.leftMessageContainer}>
          <Image
            style={styles.avatar}
            source={ LECTURE_WOMAN_IMG }
          />
          <Block>
            <Block  center style={styles.leftMessage}>
              <Text size={14} color={COLORS.BLACK} numberOfLines={2} ellipsizeMode="tail">自分と共感できる悩みなら、ぜひ聞いてあげよう！</Text>
            </Block>
            <Text size={12} color={COLORS.LIGHT_GRAY} style={styles.textLineHeight}>21:23</Text>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    height: height-120-104-48
  },

  textLineHeight: {
    lineHeight: 20
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 8,
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 8,
    marginLeft: 16,
  },
  messages: {
    justifyContent: "center"
  },
  leftMessageContainer: {
    alignItems: "center",
    marginTop: 20
  },
  leftMessage: {
    backgroundColor: COLORS.WHITE,
    height: "auto",
    width: 270,
    padding: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  disclosureRangeContainer: {
    marginTop: 32,
  },
  circleButtons: {
    paddingHorizontal: 64,
    marginBottom: 32,
    marginTop: 8,
  },
  circleButton: {
    height: 84,
    width: 84,
    backgroundColor: "#f4f8f7",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 8,
  },
  disclosureRangeImage: {
    height: 80,
    width: 80,
    alignItems: "center",
  },
  disclosureRangeText: {
    paddingTop: 12,
  },
  card: {
    marginTop: 32,
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: "relative",
    width: width - 40,
    height: 171, //仮置き。本来はauto
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
  userInfo: {
    marginLeft: 8,
  },
  userName: {
    marginBottom: 4,
    width: width - 40 - 88 - 32 - 16 - 8 - 32,
  },
  userGender: {
    marginRight: 4,
  },
  position: {
    marginLeft: 16,
    marginTop: 16,
    alignItems: "center",
  },
  positionText: {
    marginLeft: 8,
  },
  member: {
    marginLeft: 16,
    marginTop: 16,
    alignItems: "center",
  },
  memberText: {
    marginLeft: 8,
  },
  eyeIcon: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 20,
    backgroundColor: COLORS.BROWN
  },
})
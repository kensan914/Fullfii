import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import {
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ActionSheetIOS,
} from "react-native";
import IconExtra from "src/components/atoms/Icon";

import { COLORS } from "src/constants/theme";
import Avatar from "src/components/atoms/Avatar";
import RoomEditorModal from "src/components/organisms/RoomEditorModal";
const { width } = Dimensions.get("screen");

const JoinedRoomCard = (props) => {
  const { item } = props;

  const [isToggleUp, setIsToggleUp] = useState(true);
  const [isOpenRoomEditorModal, setIsOpenRoomEditorModal] = useState(false);

  const ActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["キャンセル", "修正する", "削除する"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: "light",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          //card修正する
          setIsOpenRoomEditorModal(true);
        } else if (buttonIndex === 2) {
          //削除する処理
        }
      }
    );
  };

  const RoomContent = () => {
    return (
      <>
        <Block row space="between">
          <Block style={styles.title}>
            <Text size={16} color={COLORS.BLACK} bold ellipsizeMode="tail">
              {item.title}
            </Text>
          </Block>
          <TouchableOpacity
            style={styles.threeDotsIcon}
            onPress={() => {
              ActionSheet();
            }}
          >
            <IconExtra
              name="dots-three-horizontal"
              family="Entypo"
              size={32}
              color={COLORS.BROWN}
            />
          </TouchableOpacity>
        </Block>
        <Block row>
          <Block>
            <Image
              source={item.image}
              style={{
                width: 88,
                height: 88,
                borderRadius: 20,
              }}
            />
          </Block>
          <Block flex column>
            <Block row>
              <Avatar size={32} image={item.avatar} style={styles.avater} />
              <Block column style={styles.userInfo}>
                <Block style={styles.userName}>
                  <Text
                    size={14}
                    color={COLORS.LIGHT_GRAY}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.userName}
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
                      {item.userGender}
                    </Text>
                  </Block>
                  <Block style={styles.userJob}>
                    <Text
                      size={14}
                      color={COLORS.LIGHT_GRAY}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.userJob}
                    </Text>
                  </Block>
                </Block>
              </Block>
            </Block>
            <Block row>
              <Block flex row style={styles.member}>
                <Block>
                  <IconExtra
                    name={item.memberIconName}
                    family="Ionicons"
                    size={32}
                    color={item.memberColor}
                  />
                </Block>
                <Block style={styles.memberText}>
                  <Text size={14} color={COLORS.LIGHT_GRAY}>
                    {item.joinNum}/{item.maxNum}
                  </Text>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
        <RoomEditorModal
          isOpenRoomEditorModal={isOpenRoomEditorModal}
          setIsOpenRoomEditorModal={setIsOpenRoomEditorModal}
        />
      </>
    );
  };

  return (
    <Block style={styles.container}>
      <Block style={styles.card}>
        <Block style={styles.messageContainer}>
          <Text
            size={16}
            color={COLORS.BLACK}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            最近いじめられ始めてどうしたらいいかわからんティー
          </Text>
        </Block>
        <Block>
          <TouchableOpacity
            style={styles.toggleIcon}
            onPress={() => {
              setIsToggleUp(!isToggleUp);
            }}
          >
            <IconExtra
              name={isToggleUp ? "upcircleo" : "circledowno"}
              family="AntDesign"
              size={32}
              color={COLORS.BROWN}
            />
          </TouchableOpacity>
        </Block>
        <Block center style={styles.notification}>
          <Text bold size={15} color={COLORS.WHITE}>
            99
            {/* 100以上は99表示 */}
          </Text>
        </Block>
        {isToggleUp ? <RoomContent /> : null}
      </Block>
    </Block>
  );
};

export default JoinedRoomCard;

const styles = StyleSheet.create({
  container: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    borderRadius: 20,
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: "relative",
    width: width - 40,
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
  messageContainer: {
    marginRight: 32,
  },
  toggleIcon: {
    marginTop: 16,
    alignItems: "center",
  },
  notification: {
    position: "absolute",
    justifyContent: "center",
    right: 16,
    top: 16,
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: COLORS.RED,
  },
  title: {
    marginVertical: 16,
    width: width - 116,
  },
  threeDotsIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  avater: {
    marginLeft: 16,
  },
  userInfo: {
    marginLeft: 8,
  },
  userName: {
    marginBottom: 4,
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
});

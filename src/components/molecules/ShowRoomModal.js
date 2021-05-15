import React from "react";
import { Block, NavBar, theme, Text, Button } from "galio-framework";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ActionSheetIOS,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import Modal from "react-native-modal";
import IconExtra from "src/components/atoms/Icon";

import { COLORS } from "src/constants/theme";
import Avatar from "src/components/atoms/Avatar";

const { width } = Dimensions.get("screen");

const ShowRoomModal = (props) => {
  const { item, isOpen, setIsOpen, hiddenRooms, setHiddenRooms } = props;

  const ActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["キャンセル", "非表示", "ブロック"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: "light",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          setIsOpen(false);
          setHiddenRooms([...hiddenRooms, item.key]);
          //card非表示
        } else if (buttonIndex === 2) {
          //ブロック処理
        }
      }
    );
  };

  const goNext = () => {
    alert("チャット画面に遷移");
  };

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={() => {
        setIsOpen(false);
      }}
      backdropColor={COLORS.BLACK}
      backdropOpacity={0.7}
    >
      <Block column style={styles.modal}>
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => {
            setIsOpen(false);
          }}
        >
          <IconExtra
            name="close"
            family="Ionicons"
            size={32}
            color={COLORS.HILIGHT_GRAY}
          />
        </TouchableOpacity>
        <Block style={styles.modalTitle}>
          <Text
            size={16}
            color={COLORS.BLACK}
            bold
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
        </Block>
        <TouchableOpacity
          style={styles.touchableOpacity}
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
        <Block row>
          <Image source={item.image} style={styles.modalImage} />
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
        <Block center>
          <Button
            style={styles.modalButton}
            color={COLORS.BROWN}
            shadowless
            onPress={() => goNext()}
          >
            <Text size={20} color={COLORS.WHITE} bold>
              聞いてみる！
            </Text>
          </Button>
        </Block>
      </Block>
    </Modal>
  );
};

export default ShowRoomModal;

const styles = StyleSheet.create({
  modal: {
    width: width - 40,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: "relative",
  },
  closeIcon: {
    marginBottom: 32,
    width: 32,
  },
  modalTitle: {
    marginBottom: 16,
  },
  touchableOpacity: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: COLORS.WHITE,
  },
  modalImage: {
    width: 88,
    height: 88,
    borderRadius: 15,
    marginBottom: 32,
  },
  modalButton: {
    marginBottom: 16,
    width: 303,
    height: 48,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
  },
  touchableHightlight: {
    borderRadius: 20,
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

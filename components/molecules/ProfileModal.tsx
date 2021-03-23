import React from "react";
import { StyleSheet } from "react-native";
import { Block, Text, theme, Button } from "galio-framework";
import Modal from "react-native-modal";

import Avatar from "../atoms/Avatar";
import Icon from "../atoms/Icon";
import ModalButton from "../atoms/ModalButton";
import { MeProfile, Profile, TalkTicket } from "../types/Types.context";
import { useNavigation } from "@react-navigation/native";
import useProfileModal from "../hooks/useProfileModal";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  profile: MeProfile | Profile;
  talkTicket?: TalkTicket;
};
/**
 *
 * @param {*} props talkTicketはchat画面時のみ必要
 */
const ProfileModal: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen, profile, talkTicket } = props;

  const {
    canPressBackdrop,
    onPressReport,
    onPressBlock,
    user,
  } = useProfileModal(profile, talkTicket);

  const navigation = useNavigation();

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isOpen}
      onBackdropPress={() => {
        if (canPressBackdrop || typeof canPressBackdrop === "undefined")
          setIsOpen(false);
      }}
      style={styles.modal}
    >
      <Block style={styles.modalContents}>
        <Block row center style={{ marginTop: 24, marginHorizontal: 15 }}>
          <Block flex={0.4} center>
            <Text bold size={15} color="dimgray">
              {user.name}
            </Text>
          </Block>
          <Block flex={0.4} center>
            <Avatar size={75} image={user.image} border={false} />
          </Block>
          <Block flex={0.4} center>
            <Text bold size={15} color="dimgray">
              {user.job.label}
            </Text>
          </Block>
        </Block>

        {user.me && (
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
        )}

        <Block center>
          <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>
            {user.introduction}
          </Text>
        </Block>

        {user.me ? (
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
        )}
      </Block>
    </Modal>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContents: {
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
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

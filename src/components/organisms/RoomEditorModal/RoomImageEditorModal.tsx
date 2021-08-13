import React, { Dispatch } from "react";
import Modal from "react-native-modal";
import { Block, Button, Text } from "galio-framework";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

import { width } from "src/constants";
import { Icon } from "src/components/atoms/Icon";
import { COLORS } from "src/constants/colors";
import { getPermissionAsync, pickImage } from "src/utils/imagePicker";
import { PropsDependsOnMode } from "src/components/organisms/RoomEditorModal";
import { RoomImageState } from "src/components/organisms/RoomEditorModal/useRoomEditor";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  propsDependsOnMode: PropsDependsOnMode;
  resetDraftRoomImage: () => void;
  roomImage: RoomImageState;
  setRoomImage: Dispatch<RoomImageState>;
  draftRoomImage: RoomImageState;
  setDraftRoomImage: Dispatch<RoomImageState>;
};
export const RoomImageEditorModal: React.FC<Props> = (props) => {
  const {
    isOpen,
    setIsOpen,
    propsDependsOnMode,
    resetDraftRoomImage,
    roomImage,
    setRoomImage,
    draftRoomImage,
    setDraftRoomImage,
  } = props;

  const addRoomImage = () => {
    resetDraftRoomImage();
    setRoomImage(draftRoomImage);
  };

  const renderRoomImage = () => {
    const emptyRoomImage = (
      <Icon
        name="image"
        family="Feather"
        size={48}
        color={COLORS.HIGHLIGHT_GRAY}
      />
    );

    if (propsDependsOnMode.mode === "FIX") {
      if (draftRoomImage !== null) {
        return <Image style={styles.roomImage} source={draftRoomImage} />;
      } else {
        if (propsDependsOnMode.talkingRoom.image) {
          return (
            <Image
              style={styles.roomImage}
              source={{ uri: propsDependsOnMode.talkingRoom.image }}
            />
          );
        } else {
          return emptyRoomImage;
        }
      }
    } else if (
      propsDependsOnMode.mode === "CREATE_FROM_MY_ROOMS" ||
      propsDependsOnMode.mode === "CREATE_FROM_ROOMS"
    ) {
      if (draftRoomImage !== null) {
        return <Image style={styles.roomImage} source={draftRoomImage} />;
      } else {
        return emptyRoomImage;
      }
    }
    return null;
  };

  return (
    <Modal isVisible={isOpen} deviceWidth={width}>
      <Block style={styles.modal}>
        <Block column style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              resetDraftRoomImage();
              setIsOpen(false);
            }}
          >
            <Icon
              name="close"
              family="Ionicons"
              size={32}
              color={COLORS.HIGHLIGHT_GRAY}
            />
          </TouchableOpacity>
          <Block style={styles.subTitle}>
            <Text size={12} color={COLORS.GRAY}>
              ルーム画像
            </Text>
          </Block>
          <Block center>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.roomImageContainer}
              onPress={async () => {
                const result = await getPermissionAsync();
                if (result) {
                  pickImage().then((image) => {
                    if (image) {
                      setDraftRoomImage(image);
                    }
                  });
                }
              }}
            >
              {renderRoomImage()}
            </TouchableOpacity>
          </Block>

          <Block center>
            <Button
              style={styles.optionBottomButton}
              color={COLORS.BROWN}
              shadowless
              onPress={() => {
                addRoomImage();
                setIsOpen(false);
              }}
            >
              <Text size={20} color={COLORS.WHITE} bold>
                追加する
              </Text>
            </Button>
          </Block>
        </Block>
      </Block>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: width - 40,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  modalContent: {
    position: "relative",
  },
  closeIcon: {
    marginBottom: 32,
    width: 32,
  },
  subTitle: {
    marginBottom: 8,
  },
  roomImageContainer: {
    marginBottom: 32,
    height: 80,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 1,
  },
  roomImage: {
    height: 72,
    width: 72,
    borderRadius: 8,
  },
  optionBottomButton: {
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
});

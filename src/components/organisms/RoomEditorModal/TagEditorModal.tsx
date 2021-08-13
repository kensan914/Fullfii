import React, { Dispatch, useEffect, useState } from "react";
import Modal from "react-native-modal";
import { Block, Button, Text } from "galio-framework";
import { StyleSheet, TouchableOpacity } from "react-native";

import { width } from "src/constants";
import { Icon } from "src/components/atoms/Icon";
import { COLORS } from "src/constants/colors";
import { TagsState } from "src/components/organisms/RoomEditorModal/useRoomEditor";
import { BubbleList } from "src/components/organisms/RoomEditorModal/BubbleList";
import { useProfileState } from "src/contexts/ProfileContext";
import { equalsArray } from "src/utils";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  resetDraftTags: () => void;
  tags: TagsState;
  setTags: Dispatch<TagsState>;
  draftTags: TagsState;
  setDraftTags: Dispatch<TagsState>;
};
export const TagEditorModal: React.FC<Props> = (props) => {
  const {
    isOpen,
    setIsOpen,
    resetDraftTags,
    tags,
    setTags,
    draftTags,
    setDraftTags,
  } = props;

  const profileState = useProfileState();

  useEffect(() => {
    // draftTagsの初期化
    if (isOpen) {
      setDraftTags(tags);
    }
  }, [isOpen]);

  const addTags = () => {
    resetDraftTags();
    if (draftTags !== null) {
      setTags(draftTags);
    }
  };

  const [canAddTags, setCanAddTags] = useState(false);
  useEffect(() => {
    if (draftTags === null) {
      setCanAddTags(false);
      return;
    } else {
      if (tags !== null && equalsArray(tags, draftTags)) {
        setCanAddTags(false);
        return;
      } else if (tags === null && draftTags.length <= 0) {
        setCanAddTags(false);
        return;
      }
    }
    setCanAddTags(true);
  }, [draftTags]);

  const items =
    profileState.profileParams !== null
      ? Object.values(profileState.profileParams.tags)
      : [];
  const sizeStatus = items.length > 7 ? "LARGE" : "SMALL";

  return (
    <Modal isVisible={isOpen} deviceWidth={width}>
      <Block style={styles.modal}>
        <Block column style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
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
          <BubbleList
            items={items}
            activeKeys={draftTags !== null ? draftTags : []}
            pressBubble={(tagKey) => {
              if (draftTags !== null) {
                if (draftTags.includes(tagKey)) {
                  // 削除
                  setDraftTags(
                    draftTags.filter((draftTag) => {
                      return draftTag !== tagKey;
                    })
                  );
                } else {
                  // 追加
                  const _draftTags = [...draftTags, tagKey];
                  setDraftTags(
                    _draftTags.sort((a, b) => {
                      if (profileState.profileParams !== null) {
                        return (
                          profileState.profileParams.tags[a].order -
                          profileState.profileParams.tags[b].order
                        );
                      } else {
                        return -1;
                      }
                    })
                  );
                }
              } else {
                setDraftTags([tagKey]);
              }
            }}
            diameter={80}
            limitLines={sizeStatus === "LARGE" ? 3 : 2}
            style={{
              height: sizeStatus === "LARGE" ? 80 * 3 : 80 * 2,
              width: "100%",
              marginBottom: 16,
            }}
          />
          <Block center>
            <Button
              style={styles.optionBottomButton}
              color={canAddTags ? COLORS.BROWN : "lightgray"}
              shadowless
              disabled={!canAddTags}
              onPress={() => {
                addTags();
                setIsOpen(false);
              }}
            >
              <Text size={20} color={COLORS.WHITE} bold>
                {draftTags !== null && canAddTags
                  ? draftTags.length > 0
                    ? `${draftTags.length}個のタグを追加する`
                    : "タグをリセットする"
                  : "タグを追加する"}
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
    marginBottom: 16,
    width: 32,
  },
  subTitle: {
    marginBottom: 8,
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

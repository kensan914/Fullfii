import React, { Dispatch, ReactNode } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Block, Text, Button } from "galio-framework";
import Modal from "react-native-modal";

import { COLORS } from "src/constants/colors";

type Item = {
  label: string;
  onPress: () => void;
};
type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  items: Item[];
  otherModal?: ReactNode;
  spinnerOverlay?: ReactNode;
  canPressBackdrop?: boolean;
};
export const MenuModal: React.FC<Props> = (props) => {
  const {
    isOpen,
    setIsOpen,
    items,
    otherModal,
    spinnerOverlay,
    canPressBackdrop,
  } = props;

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isOpen}
      onBackdropPress={() => {
        if (canPressBackdrop || typeof canPressBackdrop === "undefined")
          setIsOpen(false);
      }}
      style={styles.menuModal}
    >
      {spinnerOverlay}
      <Block style={styles.menuContainer}>
        {items &&
          items.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              style={styles.menuItem}
            >
              <Text style={{}} size={20} bold color={COLORS.GRAY}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        <Button
          round
          shadowless
          size="small"
          color="lightgray"
          onPress={() => setIsOpen(false)}
        >
          <Text bold size={16} color={COLORS.WHITE}>
            閉じる
          </Text>
        </Button>
      </Block>
      {otherModal}
    </Modal>
  );
};

const styles = StyleSheet.create({
  menuModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  menuContainer: {
    backgroundColor: COLORS.WHITE,
    padding: 22,
    paddingBottom: 40,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  menuItem: {
    paddingVertical: 15,
    width: "100%",
    textAlign: "right",
  },
});

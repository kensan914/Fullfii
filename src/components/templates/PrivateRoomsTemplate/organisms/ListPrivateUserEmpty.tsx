import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Block, Text, Button } from "galio-framework";
import { COLORS } from "src/constants/theme";
import { Icon } from "src/components/atoms/Icon";
import { PrivateRoomDemoModal } from "src/components/templates/PrivateRoomsTemplate/organisms/PrivateRoomDemoModal";

export const ListPrivateUserEmpty: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Block center>
        <Button
          shadowless={true}
          color="transparent"
          opacity={0.6}
          style={styles.infoWhatTalkAgainList}
          onPress={() => {
            setIsOpen(true);
          }}
        >
          <Icon name="info" family="Feather" size={26} color={COLORS.BROWN} />
          <Text size={14} bold color={COLORS.BROWN} style={styles.textHeight}>
            プライベートルームとは？
          </Text>
        </Button>
      </Block>
      <PrivateRoomDemoModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

const styles = StyleSheet.create({
  textHeight: {
    lineHeight: 20,
  },
  infoWhatTalkAgainList: {
    width: 240,
    marginTop: 80,
  },
});

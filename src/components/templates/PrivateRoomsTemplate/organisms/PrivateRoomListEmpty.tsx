import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Block, Text, Button } from "galio-framework";
import { COLORS } from "src/constants/theme";
import { Icon } from "src/components/atoms/Icon";
import { PrivateRoomDemoModal } from "src/components/templates/PrivateRoomsTemplate/organisms/PrivateRoomDemoModal";

export const PrivateRoomListEmpty: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Block flex>
      <Block flex center>
        <Text size={16} bold color={COLORS.BLACK} style={styles.title}>
          プライベートルーム
        </Text>
        <Text size={14} bold color={COLORS.GRAY} style={styles.subTitle}>
          あなたに通知されたルームは0件です
        </Text>
      </Block>
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
    </Block>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 24,
    lineHeight: 20,
  },
  subTitle: {
    marginTop: 16,
    lineHeight: 20,
  },
  textHeight: {
    lineHeight: 20,
  },
  infoWhatTalkAgainList: {
    width: 240,
    marginTop: 80,
  },
});

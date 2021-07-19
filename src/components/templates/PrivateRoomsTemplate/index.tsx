import React from "react";
import { StyleSheet, Image, ScrollView, } from "react-native";
import { Block, Text, Button } from "galio-framework";
import { COLORS } from "src/constants/theme";
import {ListPrivateUserEmpty} from "src/components/templates/PrivateRoomsTemplate/organisms/ListPrivateUserEmpty"

export const PrivateRoomsTemplate: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Block flex center>
        <Text size={16} bold color={COLORS.BLACK} style={styles.title}>プライベートルーム</Text>
        <Text size={14} bold color={COLORS.GRAY} style={styles.subTitle}>あなたに通知されたルームは0件です</Text>
      </Block>

              <ListPrivateUserEmpty/>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      backgroundColor: COLORS.BEIGE
    },
    title: {
      marginTop: 24,
      lineHeight: 20
    },
    subTitle: {
      marginTop: 16,
      lineHeight: 20
    }
  });

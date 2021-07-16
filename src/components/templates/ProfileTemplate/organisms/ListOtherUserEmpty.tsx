import React, {useState} from "react";
import { StyleSheet } from "react-native";
import { Block, Text, Button } from "galio-framework";
import { COLORS } from "src/constants/theme";
import IconExtra from "src/components/atoms/Icon";
import {TalkListDemoModal} from "src/components/templates/ProfileTemplate/organisms/TalkListDemoModal"

export const ListOtherUserEmpty = () => {
    const [isOpen, setIsOpen] = useState(false)
    return(
        <>
        <Block center >
            <Block>
            <Text size={14} bold color={COLORS.LIGHT_GRAY}>また相談したい人リストは0人です</Text>
            </Block>
            <Button shadowless={true} color='transparent' opacity={0.6} style={styles.infoWhatTalkAgainList} onPress={()=>{setIsOpen(true)}}>
                <IconExtra name="info" family="Feather" size={26} color={COLORS.BROWN}/>
                <Text size={14} bold color={COLORS.BROWN} style={styles.textHeight}>また相談したい人リストとは？</Text>
            </Button>
        </Block>
        <TalkListDemoModal isOpen={isOpen} setIsOpen={setIsOpen}/>
        </>
    )
}

const styles = StyleSheet.create({
    textHeight: {
        lineHeight: 20
      },
      infoWhatTalkAgainList: {
        width: 240,
        marginTop: 80,
      },
})
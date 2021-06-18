import React, { Dispatch } from "react";
import { Block, Button, Text } from "galio-framework";
import { StyleSheet, TouchableOpacity,ImageBackground } from "react-native";
import Modal from "react-native-modal";

import { RoundButton } from "src/components/atoms/RoundButton";
import { COLORS } from "src/constants/theme";
import IconExtra from "src/components/atoms/Icon";
import { width } from "src/constants";
import {HOME_INFO} from "src/constants/imagePath"
export const InformationModal: React.FC<Props> = (props) => {

    const {openInformationModal, setOpenInformationModal} = props
    const close = () => {
        setOpenInformationModal(false);
    }

    return (
    <Modal
      isVisible={openInformationModal}
      onBackdropPress={close}
      deviceWidth={width}
    >
        <Block center style={styles.modalContent}>
            <ImageBackground
            source={HOME_INFO}
            style={styles.informationImage}/>
            <TouchableOpacity
            style={styles.closeIcon}
            onPress={close}
            >
                <IconExtra
                    name="close"
                    family="Ionicons"
                    size={32}
                    color={COLORS.HIGHLIGHT_GRAY}
                />
            </TouchableOpacity>
            <Block center style={styles.titleContainer}>
                <Text size={20} bold color={COLORS.BLACK}>あなたの悩みを話す場所です</Text>
            </Block>
            <Block center style={styles.subTitleContainer}>
                <Text size={14} color={COLORS.BLACK} center style={styles.subTitle}>作成したルームは設定した公開範囲で{"\n"}他ユーザーに表示されます</Text>
            </Block>
            <RoundButton
                label="OK"
                style={styles.createButton}
                // isLoading={isLoadingPostRoom}
                // disabled={!canPost}
                onPress={close}
            />
        </Block>
    </Modal>
    )
}

const styles = StyleSheet.create({
    modalContent: {
      width: width - 40,
      backgroundColor: COLORS.WHITE,
      borderRadius: 20,
      position: "relative"
    },
    informationImage: {
        height: 160,
        width: width - 40,
        backgroundColor: COLORS.BEIGE,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    titleContainer: {
        marginTop: 24
    },
    subTitleContainer: {
        marginTop: 16,
        marginBottom: 16
    },
    subTitle: {
        lineHeight: 20
    },
    createButton: {
        width: width-72,
        marginBottom: 24
    },
    closeIcon: {
        position: "absolute",
        top: 16,
        left: 16
    },

  });

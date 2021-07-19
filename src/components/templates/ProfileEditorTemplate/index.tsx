import React, { Dispatch } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Avatar } from "src/components/atoms/Avatar";
import { COLORS } from "src/constants/theme";
import { width } from "src/constants";
import { ProfileEditorBlock } from "src/components/templates/ProfileEditorTemplate/molecules/ProfileEditorBlock";
import { MeProfile } from "src/types/Types.context";
import { FormattedGender } from "src/types/Types";
import { JobEditorMenu } from "./organisms/JobEditorMenu";

const profileImageHeight = 500;
const editButtonRate = { content: 9, button: 1 };

type Props = {
  meProfile: MeProfile;
  meFormattedGender: FormattedGender;
  isOpenJobModal: boolean;
  setIsOpenJobModal: Dispatch<boolean>;
  isLoadingRequestPostProfileImage: boolean;
  onPressNameEditor: () => void;
  onPressGenderEditor: () => void;
  onPressJobEditor: () => void;
  onPressProfileImageEditor: () => Promise<void>;
  onPressIsPrivateProfileEditor: () => void;
};
export const ProfileEditorTemplate: React.FC<Props> = (props) => {
  const {
    meProfile,
    meFormattedGender,
    isOpenJobModal,
    setIsOpenJobModal,
    isLoadingRequestPostProfileImage,
    onPressNameEditor,
    onPressGenderEditor,
    onPressJobEditor,
    onPressProfileImageEditor,
    onPressIsPrivateProfileEditor,
  } = props;

  return (
    <ScrollView style={{ width: width, backgroundColor: COLORS.BEIGE }}>
      <Block style={[styles.profileContentBottom]}>
        <Block style={styles.profileTextBlock}>
          <ProfileEditorBlock
            onPress={onPressNameEditor}
            title={
              <Text size={16} color={COLORS.BLACK}>
                ユーザネーム
              </Text>
            }
            content={
              <Text
                size={14}
                color={COLORS.LIGHT_GRAY}
                style={styles.textHeight}
              >
                {meProfile.name}
              </Text>
            }
          />
        </Block>

        <Block style={styles.profileTextBlock}>
          <ProfileEditorBlock
            onPress={onPressGenderEditor}
            title={
              <Text size={16} color={COLORS.BLACK}>
                性別
              </Text>
            }
            content={
              <Text
                size={14}
                color={COLORS.LIGHT_GRAY}
                style={styles.textHeight}
              >
                {meFormattedGender.label}
              </Text>
            }
          />
        </Block>

        <Block style={styles.profileTextBlock}>
          <ProfileEditorBlock
            onPress={onPressJobEditor}
            title={
              <Text size={16} color={COLORS.BLACK}>
                職業
              </Text>
            }
            content={
              <Text
                size={14}
                color={COLORS.LIGHT_GRAY}
                style={styles.textHeight}
              >
                {meProfile.job.label}
              </Text>
            }
          />
        </Block>
        <JobEditorMenu
          isOpenJobModal={isOpenJobModal}
          setIsOpenJobModal={setIsOpenJobModal}
        />

        <Block style={styles.profileTextBlock}>
          <Text size={16} color={COLORS.BLACK}>
            プロフィール画像
          </Text>
          <ProfileEditorBlock
            onPress={onPressProfileImageEditor}
            content={
              <Block
                flex
                style={{
                  alignItems: "center",
                  width: "100%",
                  flex: editButtonRate.content,
                }}
              >
                <Avatar
                  hasBorder
                  size={150}
                  imageUri={meProfile.image}
                  style={styles.avatar}
                />
              </Block>
            }
            isImage
            isLoadingImage={isLoadingRequestPostProfileImage}
          />
        </Block>

        <Block style={styles.categoryContainer}>
          <Text size={16} bold color={COLORS.BLACK}>
            プロフィール公開設定
          </Text>
        </Block>

        <Block style={styles.profileTextBlock}>
          <ProfileEditorBlock
            onPress={onPressIsPrivateProfileEditor}
            title={
              <Text size={16} color={COLORS.BLACK}>
                公開設定
              </Text>
            }
            content={
              <Text
                size={14}
                color={COLORS.LIGHT_GRAY}
                style={styles.textHeight}
              >
                {meProfile.isPrivateProfile ? "公開しない" : "公開する"}
              </Text>
            }
          />
        </Block>
      </Block>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  catalogueItem: {
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    marginBottom: theme.SIZES.BASE / 2,
    borderRadius: 12,
    height: 24,
    backgroundColor: "#F69896",
  },
  profileWrapper: {
    marginTop: profileImageHeight,
    position: "relative",
  },
  profileContentBottom: {
    paddingHorizontal: theme.SIZES.BASE,
    paddingTop: 10,
    paddingBottom: theme.SIZES.BASE * 3,
    backgroundColor: COLORS.BEIGE,
    height: "100%",
  },
  profileTextBlock: {
    paddingVertical: 16,
  },
  avatar: {},

  textHeight: {
    lineHeight: 20,
  },
  categoryContainer: {
    width: width - 32,
    height: 48,
    justifyContent: "center",
  },
});

import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Block, Text, Button } from "galio-framework";

import { COLORS } from "src/constants/theme";
import { width } from "src/constants";
import { Avatar } from "src/components/atoms/Avatar";
import { MeProfile, Profile } from "src/types/Types.context";
import { formatGender } from "src/utils";
import { FavoriteUserList } from "src/components/templates/ProfileTemplate/organisms/FavoriteUserList";

type Props = {
  meProfile: MeProfile;
  favoriteUsers: Profile[];
  onTransitionProfileEditor: () => void;
};
export const ProfileTemplate: React.FC<Props> = (props) => {
  const { meProfile, onTransitionProfileEditor, favoriteUsers } = props;

  return (
    <ScrollView style={styles.container}>
      <Block flex>
        <Block row style={styles.profilePostBox}>
          <Avatar
            size={84}
            imageUri={meProfile.image}
            style={styles.profileImage}
          />
          <Block row flex style={styles.postContents}>
            <Block column center style={styles.postSpoke}>
              {/* 他者のマイページ且つ公開しない状態の場合はアイコン表示 */}
              {/* <IconExtra name="lock" family="Feather" size={20} color={COLORS.GRAY}/> */}
              <Text
                bold
                color={COLORS.BLACK}
                size={16}
                style={styles.textHeight}
              >
                {meProfile.numOfOwner}
              </Text>
              <Text size={14} color={COLORS.BLACK} style={styles.textHeight}>
                話した
              </Text>
            </Block>
            <Block column center style={styles.postListened}>
              {/* <IconExtra name="lock" family="Feather" size={20} color={COLORS.GRAY}/> */}
              <Text
                bold
                size={16}
                color={COLORS.BLACK}
                style={styles.textHeight}
              >
                {meProfile.numOfParticipated}
              </Text>
              <Text size={14} color={COLORS.BLACK} style={styles.textHeight}>
                聞いた
              </Text>
            </Block>
          </Block>
        </Block>
        <Block style={styles.profileInfoBox}>
          <Text bold size={16} color={COLORS.BLACK} style={styles.textHeight}>
            {meProfile.name}
          </Text>
          <Text size={14} color={COLORS.BLACK} style={styles.textHeight}>
            性別：
            {formatGender(meProfile.gender, meProfile.isSecretGender).label}
            {"   |   "}
            職業：{meProfile.job.label}
          </Text>
        </Block>
        <Button
          shadowless={true}
          color="transparent"
          opacity={0.6}
          style={styles.editProfileButton}
          onPress={() => {
            onTransitionProfileEditor();
          }}
        >
          <Text size={14} bold color={COLORS.BROWN}>
            プロフィールを編集
          </Text>
        </Button>
        <Block center style={styles.postHeader}>
          <Text bold size={16} color={COLORS.BLACK}>
            また相談したい人リスト
          </Text>
        </Block>
        <Block style={styles.postBody}>
          <FavoriteUserList users={favoriteUsers} />
        </Block>
      </Block>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: COLORS.BEIGE,
  },
  profilePostBox: {
    marginTop: 16,
    alignItems: "center",
  },
  profileImage: {
    width: 84,
    height: 84,
    borderRadius: 50,
  },
  postContents: {
    justifyContent: "center",
  },
  postSpoke: {
    width: 72,
    height: 40,
    justifyContent: "center",
  },
  postListened: {
    width: 72,
    height: 40,
    justifyContent: "center",
    marginLeft: 8,
  },
  textHeight: {
    lineHeight: 20,
  },
  profileInfoBox: {
    marginTop: 16,
  },
  editProfileButton: {
    width: width - 32,
    marginTop: 16,
    borderWidth: 2,
    borderColor: COLORS.BROWN,
    borderRadius: 4,
  },
  postHeader: {
    marginTop: 40,
  },
  postBody: {
    marginTop: 16,
  },
});

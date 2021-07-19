import React, { ReactElement, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Hr } from "src/components/atoms/Hr";
import { Icon } from "src/components/atoms/Icon";
import { getPermissionAsync, pickImage } from "src/utils/imagePicker";
import { Avatar } from "src/components/atoms/Avatar";
import {
  useProfileState,
  useProfileDispatch,
} from "src/contexts/ProfileContext";
import { useAuthDispatch, useAuthState } from "src/contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { ProfileEditorNavigationPros } from "src/types/Types";
import { formatGender } from "src/utils";
import { MenuModal } from "src/components/molecules/Menu";
import { requestPatchProfile } from "src/screens/ProfileInputScreen";
import { COLORS } from "src/constants/theme";
import { useRequestPostProfileImage } from "src/hooks/requests/useRequestMe";
import { width } from "src/constants";

const ProfileHr = () => <Hr h={1} mb={5} color={COLORS.BROWN_RGBA} />;
const profileImageHeight = 500;
const editButtonRate = { content: 9, button: 1 };

export const ProfileEditorScreen: React.FC = () => {
  const navigation = useNavigation<ProfileEditorNavigationPros>();
  const profileState = useProfileState();
  const profileDispatch = useProfileDispatch();
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();

  const user = profileState.profile;
  const {
    requestPostProfileImage,
    isLoadingRequestPostProfileImage,
  } = useRequestPostProfileImage();

  const [isOpenJobModal, setIsOpenJobModal] = useState(false);

  const formattedGender = formatGender(user.gender, user.isSecretGender);
  return (
    <ScrollView style={{ width: width, backgroundColor: COLORS.BEIGE }}>
      <Block style={[styles.profileContentBottom]}>
        <Block style={styles.profileTextBlock}>
          <Text
            size={16}
            bold
            color={COLORS.BLACK}
            style={{ marginBottom: 10 }}
          >
            ユーザネーム
          </Text>
          <EditorBlock
            onPress={() =>
              navigation.navigate("ProfileInput", {
                user: user,
                prevValue: user.name,
                screen: "InputName",
              })
            }
            content={
              <Text
                size={14}
                color={COLORS.GRAY}
                style={{ lineHeight: 18, flex: editButtonRate.content }}
              >
                {user.name}
              </Text>
            }
          />
        </Block>
        <ProfileHr />

        <Block style={styles.profileTextBlock}>
          <Text
            size={16}
            bold
            color={COLORS.BLACK}
            style={{ marginBottom: 10 }}
          >
            性別
          </Text>
          <EditorBlock
            onPress={() =>
              navigation.navigate("ProfileInput", {
                user: user,
                prevValue: formattedGender.key,
                screen: "InputGender",
              })
            }
            content={
              <Text
                size={14}
                color={COLORS.GRAY}
                style={{ lineHeight: 18, flex: editButtonRate.content }}
              >
                {formattedGender.label}
              </Text>
            }
          />
        </Block>
        <ProfileHr />

        <Block style={styles.profileTextBlock}>
          <Text
            size={16}
            bold
            color={COLORS.BLACK}
            style={{ marginBottom: 10 }}
          >
            職業
          </Text>
          <EditorBlock
            onPress={() => {
              setIsOpenJobModal(true);
            }}
            content={
              <Text
                size={14}
                color={COLORS.GRAY}
                style={{ lineHeight: 18, flex: editButtonRate.content }}
              >
                {user.job.label}
              </Text>
            }
          />
        </Block>
        <MenuModal
          isOpen={isOpenJobModal}
          setIsOpen={setIsOpenJobModal}
          items={
            profileState.profileParams?.job
              ? Object.values(profileState.profileParams.job).map((jobObj) => {
                  return {
                    label: jobObj.label,
                    onPress: () => {
                      if (authState.token) {
                        authDispatch({
                          type: "SET_IS_SHOW_SPINNER",
                          value: true,
                        });
                        requestPatchProfile(
                          authState.token,
                          { job: jobObj.key },
                          profileDispatch,
                          () => {
                            return void 0;
                          },
                          () => {
                            return void 0;
                          },
                          () => {
                            authDispatch({
                              type: "SET_IS_SHOW_SPINNER",
                              value: false,
                            });
                          }
                        );
                      }
                      setIsOpenJobModal(false);
                    },
                  };
                })
              : []
          }
        />
        <ProfileHr />

        <Block style={styles.profileTextBlock}>
          <Text
            size={16}
            bold
            color={COLORS.BLACK}
            style={{ marginBottom: 10 }}
          >
            プロフィール画像
          </Text>
          <EditorBlock
            onPress={async () => {
              const result = await getPermissionAsync();
              if (result) {
                // onLoad();
                pickImage().then((image) => {
                  if (image && authState.token) {
                    requestPostProfileImage(image);
                  }
                });
              }
            }}
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
                  imageUri={user.image}
                  style={styles.avatar}
                />
              </Block>
            }
            isImage
            isLoadingImage={isLoadingRequestPostProfileImage}
          />
        </Block>
      </Block>
    </ScrollView>
  );
};

type PropsEditorBlock = {
  onPress: () => void;
  content: ReactElement;
  isImage?: boolean;
  isLoadingImage?: boolean;
};
const EditorBlock: React.FC<PropsEditorBlock> = (props) => {
  const { onPress, content, isImage, isLoadingImage } = props;
  return isImage ? (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{ flex: 1, width: "100%" }}
    >
      <Block style={{ zIndex: -1 /* Androidで下記のiconが下に行くため */ }}>
        {content}
      </Block>
      <Block
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {isLoadingImage ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <Icon name="camera" family="font-awesome" color="white" size={40} />
        )}
      </Block>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={onPress}
      style={{ flex: 1, flexDirection: "row" }}
    >
      {content}
      <Block
        flex={editButtonRate.button}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Icon name="angle-right" family="font-awesome" color="gray" size={22} />
      </Block>
    </TouchableOpacity>
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
    alignItems: "baseline",
  },
  avatar: {},
});

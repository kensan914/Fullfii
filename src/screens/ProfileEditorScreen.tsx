import React, { ReactElement, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import Hr from "src/components/atoms/Hr";
import Icon from "src/components/atoms/Icon";
import { getPermissionAsync, pickImage } from "src/utils/imagePicker";
import Avatar from "src/components/atoms/Avatar";
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
          <EditorBlock
            onPress={() =>
              navigation.navigate("ProfileInput", {
                user: user,
                prevValue: user.name,
                screen: "InputName",
              })
            }
            title={
              <Text
              size={16}
              color={COLORS.BLACK}
              >
                ユーザネーム
              </Text>
            }
            content={
              <Text
              size={14} color={COLORS.LIGHT_GRAY} style={styles.textHeight}
              >
                {/* {user.name} */}
                匿名子
              </Text>
            }
          />
        </Block>

        <Block style={styles.profileTextBlock}>
          <EditorBlock
            onPress={() =>
              navigation.navigate("ProfileInput", {
                user: user,
                prevValue: formattedGender.key,
                screen: "InputGender",
              })
            }
            title={
              <Text
                size={16}
                color={COLORS.BLACK}
              >
                性別
              </Text>
            }
            content={
              <Text
              size={14} color={COLORS.LIGHT_GRAY} style={styles.textHeight}
              >
                {formattedGender.label}
              </Text>
            }
          />
        </Block>

        <Block style={styles.profileTextBlock}>
          <EditorBlock
            onPress={() => {
              setIsOpenJobModal(true);
            }}
            title={
              <Text
                size={16}
                color={COLORS.BLACK}
              >
                職業
              </Text>
            }
            content={
              <Text
              size={14} color={COLORS.LIGHT_GRAY} style={styles.textHeight}
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
            profileState.profileParams?.job &&
            Object.values(profileState.profileParams.job).map((jobObj) => {
              return {
                title: jobObj.label,
                onPress: () => {
                  if (authState.token) {
                    authDispatch({ type: "SET_IS_SHOW_SPINNER", value: true });
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
          }
        />

        <Block style={styles.profileTextBlock}>
          <Text
            size={16}
            color={COLORS.BLACK}
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
                  border
                  size={150}
                  image={user.image}
                  style={styles.avatar}
                />
              </Block>
            }
            isImage
            isLoadingImage={isLoadingRequestPostProfileImage}
          />
        </Block>

        <Block style={styles.categoryContainer} >
          <Text size={16} bold color={COLORS.BLACK}>
            プロフィール公開設定
          </Text>
        </Block>

        <Block style={styles.profileTextBlock}>
          <EditorBlock
            onPress={() =>
              navigation.navigate("ProfileInput", {
                user: user,
                prevValue: formattedGender.key,
                screen: "InputGender",
              })
            }
            title={
              <Text
                size={16}
                color={COLORS.BLACK}
              >
                公開設定
              </Text>
            }
            content={
              <Text
              size={14} color={COLORS.LIGHT_GRAY} style={styles.textHeight}
              >
                公開しない
              </Text>
            }
          />
        </Block>

        {/* <Block>
          <Text size={12} color={COLORS.BLACK}>
          「公開しない」に設定する場合、他ユーザーはあなたの名前、性別、職業、写真のみ閲覧することができます{"\n"}「公開する」に設定する場合、他ユーザーはあなたのプロフィール情報全てを閲覧することができます
          </Text>
        </Block> */}

      </Block>
    </ScrollView>
  );
};

type PropsEditorBlock = {
  onPress: () => void;
  title?: ReactElement;
  content: ReactElement;
  isImage?: boolean;
  isLoadingImage?: boolean;
};
const EditorBlock: React.FC<PropsEditorBlock> = (props) => {
  const { onPress, title, content, isImage, isLoadingImage } = props;
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
      style={{ flex: 1, width: width-32}}
    >
      <Block row space="between" style={styles.editContainer}>
        <Block>
          {title}
        </Block>
        <Block
          row
          center
        >
          {content}
          <Block style={styles.angleIcon} center>
          <Icon name="angle-right" family="font-awesome" color="gray" size={24} />
          </Block>
        </Block>
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
  },
  avatar: {},
  editContainer: {
    alignItems: "center"
  },
  textHeight: {
    lineHeight: 20
  },
  angleIcon: {
    height: 24,
    width: 24,
    marginLeft: 8
  },
  categoryContainer: {
    width: width-32,
    height: 48,
    justifyContent: "center"
  }
});

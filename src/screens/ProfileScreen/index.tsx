import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";

import { ProfileTemplate } from "src/components/templates/ProfileTemplate";
import { useProfileState } from "src/contexts/ProfileContext";
import { useListInList } from "src/screens/ProfileScreen/useListInList";
import { Tab } from "src/components/templates/ProfileTemplate/organisms/TabForTest";
import {
  ProfileRouteProp,
  PROFILE_VIEW_HEIGHT_TYPE,
  RenderScene,
  Routes,
  TAB_BAR_HEIGHT_TYPE,
} from "src/types/Types";
import { FavoriteUserList } from "src/components/templates/ProfileTemplate/organisms/FavoriteUserList";
import { MeProfile, Profile } from "src/types/Types.context";

type Props = {
  isMe: boolean;
};
export const ProfileScreen: React.FC<Props> = (props) => {
  const { isMe = false } = props;

  const route = useRoute<ProfileRouteProp>();
  const profileState = useProfileState();

  const profile: MeProfile | Profile =
    typeof route.params?.profile !== "undefined" && !isMe
      ? route.params.profile
      : profileState.profile;

  // const isMe = profile.id === profileState.profile.id && "me" in profile;

  // list in list
  const [PROFILE_VIEW_HEIGHT] = useState<PROFILE_VIEW_HEIGHT_TYPE>(224); // プロフィール
  const [TAB_BAR_HEIGHT] = useState<TAB_BAR_HEIGHT_TYPE>(48); // その下のタブバー
  const [PROFILE_BODY_HEIGHT] = useState(PROFILE_VIEW_HEIGHT + TAB_BAR_HEIGHT);
  const [routes] = useState<Routes>(
    isMe ? [{ key: "tab1", title: "また話したい人" }] : []
    // { key: "tab2", title: "独り言" },
  );
  const { tabIndex, animatedScrollY, onIndexChange, geneSceneProps } =
    useListInList(routes, PROFILE_VIEW_HEIGHT, PROFILE_BODY_HEIGHT);
  const renderScene: RenderScene = (props) => {
    const { route } = props;
    switch (route.key) {
      case "tab1": {
        return <FavoriteUserList {...props} {...geneSceneProps(route.key)} />;
      }
      case "tab2": {
        return <Tab {...props} {...geneSceneProps(route.key)} />;
      }
      default:
        return null;
    }
  };

  return (
    <ProfileTemplate
      profile={profile}
      isMe={isMe}
      routes={routes}
      tabIndex={tabIndex}
      animatedScrollY={animatedScrollY}
      onIndexChange={onIndexChange}
      renderScene={renderScene}
      PROFILE_VIEW_HEIGHT={PROFILE_VIEW_HEIGHT}
      TAB_BAR_HEIGHT={TAB_BAR_HEIGHT}
      PROFILE_BODY_HEIGHT={PROFILE_BODY_HEIGHT}
    />
  );
};

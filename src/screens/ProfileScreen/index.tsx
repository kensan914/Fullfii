import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";

import { ProfileTemplate } from "src/components/templates/ProfileTemplate";
import { useProfileState } from "src/contexts/ProfileContext";
import { Tab } from "src/components/templates/ProfileTemplate/organisms/TabForTest";
import {
  ProfileRouteProp,
  PROFILE_VIEW_HEIGHT_TYPE,
  RenderScene,
  TAB_BAR_HEIGHT_TYPE,
} from "src/types/Types";
import { FavoriteUserList } from "src/components/templates/ProfileTemplate/organisms/FavoriteUserList";
import { MeProfile, Profile } from "src/types/Types.context";
import { Routes, useTabInList } from "src/hooks/tabInList/useTabInList";
import {
  BOTTOM_TAB_BAR_HEIGHT,
  HEADER_HEIGHT_INCLUDE_STATUS_BAR,
  height,
} from "src/constants";

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

  // list in list
  const [PROFILE_VIEW_HEIGHT] = useState<PROFILE_VIEW_HEIGHT_TYPE>(224); // プロフィール
  const [TAB_BAR_HEIGHT] = useState<TAB_BAR_HEIGHT_TYPE>(48); // その下のタブバー
  const [PROFILE_BODY_HEIGHT] = useState(PROFILE_VIEW_HEIGHT + TAB_BAR_HEIGHT);
  const [routes] = useState<Routes<"tab1" | "tab2">>(
    isMe
      ? [
          { key: "tab1", title: "また話したい人" },
          // { key: "tab2", title: "独り言" },
        ]
      : []
  );

  const {
    tabIndex,
    animatedScrollY,
    onIndexChange,
    geneTabInListSettings,
    hiddenAnimatedViewStyle,
  } = useTabInList<"tab1" | "tab2">(
    routes,
    PROFILE_VIEW_HEIGHT,
    TAB_BAR_HEIGHT,
    height - (HEADER_HEIGHT_INCLUDE_STATUS_BAR + BOTTOM_TAB_BAR_HEIGHT)
  );
  const renderScene: RenderScene = (props) => {
    const { route } = props;
    switch (route.key) {
      case "tab1": {
        return (
          <FavoriteUserList
            {...props}
            tabInListSettings={geneTabInListSettings(route.key)}
            // {...geneSceneProps(route.key)}
          />
        );
      }
      case "tab2": {
        return (
          <Tab
            {...props}
            tabInListSettings={geneTabInListSettings(route.key)}
            // {...geneSceneProps(route.key)}
          />
        );
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
      hiddenAnimatedViewStyle={hiddenAnimatedViewStyle}
    />
  );
};

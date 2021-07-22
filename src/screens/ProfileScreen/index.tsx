import React, { useState } from "react";

import { ProfileTemplate } from "src/components/templates/ProfileTemplate";
import { useProfileState } from "src/contexts/ProfileContext";
import { Profile } from "src/types/Types.context";
import { useListInList } from "src/screens/ProfileScreen/useListInList";
import { Tab } from "src/components/templates/ProfileTemplate/organisms/TabForTest";
import {
  PROFILE_VIEW_HEIGHT_TYPE,
  RenderScene,
  Routes,
  TAB_BAR_HEIGHT_TYPE,
} from "src/types/Types";
import { FavoriteUserList } from "src/components/templates/ProfileTemplate/organisms/FavoriteUserList";

export const ProfileScreen: React.FC = () => {
  const profileState = useProfileState();

  const meProfile = profileState.profile;
  // const favoriteUsers: Profile[] = new Array(14).fill(meProfile);
  const favoriteUsers: Profile[] = []; // if empty

  // list in list
  const [PROFILE_VIEW_HEIGHT] = useState<PROFILE_VIEW_HEIGHT_TYPE>(224); // プロフィール
  const [TAB_BAR_HEIGHT] = useState<TAB_BAR_HEIGHT_TYPE>(48); // その下のタブバー
  const [PROFILE_BODY_HEIGHT] = useState(PROFILE_VIEW_HEIGHT + TAB_BAR_HEIGHT);
  const [routes] = useState<Routes>([
    { key: "tab1", title: "また話したい人" },
    { key: "tab2", title: "独り言" },
  ]);
  const { tabIndex, animatedScrollY, onIndexChange, geneSceneProps } =
    useListInList(routes, PROFILE_VIEW_HEIGHT, PROFILE_BODY_HEIGHT);
  const renderScene: RenderScene = (props) => {
    const { route } = props;
    switch (route.key) {
      case "tab1": {
        return (
          <FavoriteUserList
            users={favoriteUsers}
            {...props}
            {...geneSceneProps(route.key)}
          />
        );
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
      meProfile={meProfile}
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

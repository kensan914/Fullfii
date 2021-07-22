import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "galio-framework";

import { COLORS } from "src/constants/theme";
import { MeProfile } from "src/types/Types.context";
import { ProfileBody } from "src/components/templates/ProfileTemplate/organisms/ProfileBody";
import { TabBar, TabView } from "react-native-tab-view";
import {
  AnimatedScrollY,
  OnIndexChange,
  PROFILE_VIEW_HEIGHT_TYPE,
  RenderHeader,
  RenderScene,
  Routes,
  TAB_BAR_HEIGHT_TYPE,
} from "src/types/Types";

type Props = {
  meProfile: MeProfile;
  routes: Routes;
  tabIndex: number;
  animatedScrollY: AnimatedScrollY;
  onIndexChange: OnIndexChange;
  renderScene: RenderScene;
  PROFILE_VIEW_HEIGHT: PROFILE_VIEW_HEIGHT_TYPE;
  TAB_BAR_HEIGHT: TAB_BAR_HEIGHT_TYPE;
  PROFILE_BODY_HEIGHT: number;
};
export const ProfileTemplate: React.FC<Props> = (props) => {
  const {
    meProfile,
    routes,
    tabIndex,
    animatedScrollY,
    onIndexChange,
    renderScene,
    PROFILE_VIEW_HEIGHT,
    TAB_BAR_HEIGHT,
    PROFILE_BODY_HEIGHT,
  } = props;

  const renderHeader: RenderHeader = () => (props) =>
    (
      <ProfileBody
        meProfile={meProfile}
        animatedScrollY={animatedScrollY}
        renderTabBar={() => (
          <TabBar
            getLabelText={({ route }) => route.title}
            indicatorStyle={styles.indicator}
            style={[styles.tabBar, { height: TAB_BAR_HEIGHT }]}
            activeColor={COLORS.LIGHT_GRAY}
            inactiveColor={COLORS.LIGHT_GRAY}
            renderLabel={({ route, focused, color }) => (
              <Text bold={focused} size={12} style={{ color: color }}>
                {route.title}
              </Text>
            )}
            {...props}
          />
        )}
        PROFILE_VIEW_HEIGHT={PROFILE_VIEW_HEIGHT}
        PROFILE_BODY_HEIGHT={PROFILE_BODY_HEIGHT}
      />
    );

  return (
    <View style={{ flex: 1 }}>
      <TabView
        style={styles.container}
        navigationState={{
          index: tabIndex,
          routes: routes,
        }}
        renderScene={renderScene}
        renderTabBar={renderHeader()}
        onIndexChange={onIndexChange}
        swipeEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#edeef0",
  },
  tabBar: {
    backgroundColor: COLORS.BEIGE,
    elevation: 0,
  },
  indicator: {
    backgroundColor: COLORS.PINK,
    height: 3,
  },
  label: {
    margin: 0,
    marginTop: 6,
    marginBottom: 6,
    fontWeight: "400",
  },
});

//  for test

import React, { useState } from "react";
import { Text, Animated, View, StyleSheet } from "react-native";
import { SceneRendererProps } from "react-native-tab-view";
import { useAnimatedListProps } from "src/hooks/tabInList/useAnimatedListProps";
import { TabInListSettingsProps } from "src/hooks/tabInList/useTabInList";

export const Tab: React.FC<TabInListSettingsProps & SceneRendererProps> = (
  props
) => {
  const { route, tabInListSettings } = props;

  const { animatedFlatListProps } = useAnimatedListProps(tabInListSettings);

  const [dataSource] = useState(
    Array(20)
      .fill()
      .map((_, index) => ({ id: index }))
  );
  return (
    <Animated.FlatList
      {...animatedFlatListProps}
      style={styles.wrapper}
      data={dataSource}
      keyExtractor={(item) => item.id.toString()}
      tabRoute={route.key}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.id}</Text>
        </View>
      )}
      onEndReached={() => {}}
      onEndReachedThreshold={0.3}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
  },
  item: {
    height: 150,
    backgroundColor: "#fff",
    marginBottom: 20,
    shadowColor: "rgb(75, 89, 101)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
});

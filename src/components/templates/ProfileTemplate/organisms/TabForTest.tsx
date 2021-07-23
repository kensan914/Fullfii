//  for test

import React, { useState } from "react";
import { Text, Animated, View, StyleSheet } from "react-native";
import { useAnimatedFlatListProps } from "src/screens/ProfileScreen/useAnimatedFlatListProps";

export const Tab = React.forwardRef((props, ref) => {
  const {
    animatedScrollY,
    route,
    onUpdateOffsetY,
    PROFILE_VIEW_HEIGHT,
    PROFILE_BODY_HEIGHT,
  } = props;

  const { animatedFlatListProps } = useAnimatedFlatListProps(
    animatedScrollY,
    onUpdateOffsetY,
    PROFILE_VIEW_HEIGHT,
    PROFILE_BODY_HEIGHT
  );

  const [dataSource] = useState(
    Array(20)
      .fill()
      .map((_, index) => ({ id: index }))
  );
  return (
    <Animated.FlatList
      ref={ref}
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
    />
  );
});

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

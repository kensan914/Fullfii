//  for test

import React, { useState } from "react";
import { Text, Animated, View, StyleSheet } from "react-native";
import { height } from "src/constants";

export const Tab = React.forwardRef((props, ref) => {
  const { animatedScrollY, route, onUpdateOffsetY, PROFILE_BODY_HEIGHT } =
    props;

  const [dataSource] = useState(
    Array(20)
      .fill()
      .map((_, index) => ({ id: index }))
  );
  return (
    <Animated.FlatList
      ref={ref}
      style={styles.wrapper}
      data={dataSource}
      keyExtractor={(item) => item.id.toString()}
      tabRoute={route.key}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.id}</Text>
        </View>
      )}
      contentContainerStyle={{
        paddingTop: PROFILE_BODY_HEIGHT,
        minHeight: height - 48,
      }}
      onMomentumScrollEnd={(e) => {
        onUpdateOffsetY(e.nativeEvent.contentOffset.y);
      }}
      onScroll={Animated.event(
        [
          {
            nativeEvent: { contentOffset: { y: animatedScrollY } },
          },
        ],
        {
          useNativeDriver: true,
        }
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

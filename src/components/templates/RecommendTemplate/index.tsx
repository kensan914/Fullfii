import React from "react";
import { Block, theme, Text, Button} from "galio-framework";
import { ScrollView, FlatList, StyleSheet,  TextInput, TouchableHighlight, Platform, } from "react-native";

import { Forms, SubmitSettings } from "src/types/Types";
import { SubmitButton } from "src/components/atoms/SubmitButton";
import { width } from "src/constants";
import { COLORS } from "src/constants/colors";
import { Avatar } from "src/components/atoms/Avatar";
import { Icon } from "src/components/atoms/Icon";
import {RecommendRoomCard} from "src/components/templates/RecommendTemplate/organisms/RecommendRoomCard"

export const RecommendTemplate: React.FC = () => {

const data = [{ id:1, title: 'Title Text', key: 'item1' },
{ id:2,title: 'Title Text', key: 'item1' },
{ id:3,title: 'Title Text', key: 'item1' },
{ id:4,title: 'Title Text', key: 'item1' },
{ id:5,title: 'Title Text', key: 'item1' }]

  return (
    <ScrollView style={styles.container}>
      <Block center style={styles.adContainer}/>
      <Block row space="between" style={styles.cardsLabel}>
        <Text size={16} color={COLORS.BLACK} bold>プライベート</Text>
        <Button shadowless="true" color='transparent' style={styles.showAllText}>
          <Text size={14} color={COLORS.BROWN}>全てみる</Text>
        </Button>
      </Block>
      {/* <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <RecommendRoomCard/>
        <RecommendRoomCard/>
      </ScrollView> */}
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item, index,  }) => (
          <RecommendRoomCard
            key={item.key}
            item={item}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <Block row space="between" style={styles.cardsLabel}>
        <Text size={16} color={COLORS.BLACK} bold>今オンライン</Text>
        <Button shadowless="true" color='transparent' style={styles.showAllText}>
          <Text size={14} color={COLORS.BROWN}>全てみる</Text>
        </Button>
      </Block>
      {/* <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <RecommendRoomCard/>
        <RecommendRoomCard/>
      </ScrollView> */}
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item, index,  }) => (
          <RecommendRoomCard
            key={item.key}
            item={item}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <Block row space="between" style={styles.cardsLabel}>
        <Text size={16} color={COLORS.BLACK} bold>大学生</Text>
        <Button shadowless="true" color='transparent' style={styles.showAllText}>
          <Text size={14} color={COLORS.BROWN}>全てみる</Text>
        </Button>
      </Block>
      {/* <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <RecommendRoomCard/>
        <RecommendRoomCard/>
      </ScrollView> */}
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item, index,  }) => (
          <RecommendRoomCard
            key={item.key}
            item={item}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <Block row space="between" style={styles.cardsLabel}>
        <Text size={16} color={COLORS.BLACK} bold>恋愛 女性</Text>
        <Button shadowless="true" color='transparent' style={styles.showAllText}>
          <Text size={14} color={COLORS.BROWN}>全てみる</Text>
        </Button>
      </Block>
      {/* <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <RecommendRoomCard/>
        <RecommendRoomCard/>
      </ScrollView> */}
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item, index,  }) => (
          <RecommendRoomCard
            key={item.key}
            item={item}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,

  },
  adContainer: {
    width: width,
    height: 240,
    backgroundColor: COLORS.GREEN
  },
  cardsLabel: {
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 20

  },
  showAllText: {
    width: 60
  },
  list: {
    zIndex: 100
  }
});
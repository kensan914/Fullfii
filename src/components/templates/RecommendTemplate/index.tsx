import React from "react";
import { Block, theme, Text, Button} from "galio-framework";
import { ScrollView, FlatList, StyleSheet,  TextInput, TouchableHighlight, Platform, } from "react-native";

import { Forms, SubmitSettings } from "src/types/Types";
import { SubmitButton } from "src/components/atoms/SubmitButton";
import { width, height } from "src/constants";
import { COLORS } from "src/constants/colors";
import { Avatar } from "src/components/atoms/Avatar";
import { Icon } from "src/components/atoms/Icon";
import {RecommendRoomCard} from "src/components/templates/RecommendTemplate/organisms/RecommendRoomCard"
import {AdViewLgBanner} from "src/components/molecules/AdViewLgBanner"

import { ADMOB_UNIT_ID_NATIVE } from "src/constants/env";

export const RecommendTemplate: React.FC = () => {

const data = [{ id:1, title: 'Title Text', key: 'item1' },
{ id:2,title: 'Title Text', key: 'item1' },
{ id:3,title: 'Title Text', key: 'item1' },
{ id:4,title: 'Title Text', key: 'item1' },
{ id:5,title: 'Title Text', key: 'item1' },
{ id:6,title: 'Title Text', key: 'item1' }
]

const kind = [{name: "恋愛", data: data}, {name: "仕事", data: data}, {name: "人間関係", data: data}, {name: "学校", data: data}]



  return (
    <ScrollView style={styles.container}>
      <Block center style={styles.adContainer}>
        <AdViewLgBanner adUnitId={ADMOB_UNIT_ID_NATIVE.image}/>
      </Block>

      {kind.map((i) => (
        <>
          <Block row space="between" style={styles.cardsLabel}>
            <Text size={16} color={COLORS.BLACK} bold>{i.name}</Text>
            <Button shadowless="true" color='transparent' style={styles.showAllText}>
              <Text size={14} color={COLORS.BROWN}>全てみる</Text>
            </Button>
          </Block>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={i.data}
            renderItem={({ item, index,  }) => (
              <>
              {item.id==6
                ?
                <Button shadowless="true" color='transparent' style={styles.showAllContent}>
                  <Text size={14} color={COLORS.BROWN}>全てみる</Text>
                </Button>
              :
              <RecommendRoomCard
                key={item.key}
                item={item}
              />
            }
              </>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </>
      ))}



    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BEIGE,
  },
  adContainer: {
    width: width* 0.8,
    height: 210
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
  },
  showAllContent: {
    width: 80,
    height: "auto",
  }
});
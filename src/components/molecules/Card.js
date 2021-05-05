import React from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import Icon from "src/components/atoms/Icon";
import { COLORS } from "src/constants/theme";
import { ADMOB_UNIT_ID_NATIVE } from "src/constants/env";
import useAdView from "src/hooks/useAdView";
import { useChatState } from "src/contexts/ChatContext";

const { width } = Dimensions.get("screen");

/**
 *
 * @param {*} props
 * item = {title, color, content, borderColor, borderLess}
 * icon-base item = {icon, iconFamily, iconColor}
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Card = (props) => {
  const { item, style, onPress, countNum } = props;
  const titleSize = 16;
  const contentSize = 14;
  // const backgroundColor = !item.isAdmob ? item.color : COLORS.PINK;
  // const [mediaType, setMediaType] = useState("image");
  const adViewModule = useAdView();
  const chatState = useChatState();

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      {item.onPress ? (
        <Block flex={1} style={styles.card}>
          {
            <>
              <Block column>
                <Block row flex={0.4}>
                  <Block flex={0.9} style={{ height: 25 }}>
                    <Text
                      bold
                      color={COLORS.BLACK}
                      size={titleSize}
                      style={styles.title}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.title}
                    </Text>
                  </Block>
                  <Block flex={0.1} style={{ position: "relative" }}>
                    {Number.isInteger(countNum) && countNum > 0 ? (
                      <Block
                        style={[
                          styles.counter,
                          {
                            position: "absolute",
                            top: titleSize / 3 - 5,
                            right: titleSize / 3,
                            height: titleSize + 5,
                            borderRadius: (titleSize + 5) / 2,
                            minWidth: titleSize + 5,
                          },
                        ]}
                      >
                        <Text color="white" size={titleSize - 2}>
                          {countNum}
                        </Text>
                      </Block>
                    ) : (
                      <></>
                    )}
                  </Block>
                </Block>
                <Block row flex={0.6}>
                  <Block
                    flex={0.3}
                    style={{ alignItems: "center", marginRight: 15 }}
                  >
                    <Image
                      source={item.image}
                      style={{
                        width: 100,
                        height: 100,
                      }}
                    />
                  </Block>
                  <Block column flex={0.7}>
                    <Block style={{ paddingBottom: 30, paddingTop: 15 }}>
                      <Text
                        size={contentSize}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        color={COLORS.GRAY}
                      >
                        {item.content}
                      </Text>
                    </Block>
                    <Block row>
                      <Text color={COLORS.GRAY}>
                        {item.key in chatState.lengthParticipants
                          ? chatState.lengthParticipants[item.key]
                          : "- "}
                      </Text>
                      <Icon name="person" family="Ionicons" color="gray" />
                    </Block>
                  </Block>
                </Block>
              </Block>
            </>
          }
        </Block>
      ) : (
        <>
          {typeof adViewModule !== "undefined" && (
            <adViewModule.AdView
              media={false}
              type="image"
              index={1}
              adUnitId={ADMOB_UNIT_ID_NATIVE.image}
            />
          )}
        </>
      )}
    </TouchableWithoutFeedback>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    paddingVertical: 18,
    paddingHorizontal: 15,
    marginVertical: 5,
    position: "relative",
    width: width - theme.SIZES.BASE * 1.8,
    marginRight: "auto",
    marginLeft: "auto",
    minHeight: 150,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.26,
    shadowRadius: 0,
    elevation: 1,
  },
  bottomContent: {
    alignItems: "center",
  },
  counter: {
    backgroundColor: COLORS.ALERT,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
});

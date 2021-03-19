import React from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";

import Icon from "../atoms/Icon";
import { COLORS } from "../../constants/Theme";
import StatusIcon from "../atoms/StatusIcon";
import {
  ADMOB_BANNER_HEIGHT,
  ADMOB_BANNER_WIDTH,
  ADMOB_UNIT_ID_HOME,
  isExpo,
} from "../../constants/env";

import Admob from "../molecules/Admob";

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
  const titleSize = 17;
  const contentSize = 13;
  const backgroundColor = !item.isAdmob ? item.color : COLORS.PINK;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Block>
        {item.onPress ? (
          <LinearGradient
            // Background Linear Gradient
            colors={backgroundColor} //["#56ab2f", "#a8e063"]["#d4fc79", "#50cc7f"]
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={[
              styles.card,
              style,
              {
                minHeight: item.icon === "plus" ? 65 : 114,
                borderRadius: 5,
              },
              {
                backgroundColor: backgroundColor,
                shadowColor: backgroundColor,
              },
              item.borderColor && {
                borderWidth: 2,
                borderColor: item.borderColor,
              },
              item.borderLess ? {} : styles.shadow,
            ]}
          >
            {item.icon ? (
              <Block center flex justifyContent="center">
                <Icon
                  family={item.iconFamily ? item.iconFamily : "fontawesome"}
                  size={60}
                  name={item.icon}
                  color={item.iconColor ? item.iconColor : "white"}
                />
              </Block>
            ) : (
              <>
                <Image
                  source={item.image}
                  style={{
                    width: 110,
                    height: 120,
                    position: "absolute",
                    right: 5,
                    top: 30,
                    zIndex: 4,
                  }}
                />
                <Block flex style={styles.content}>
                  {/* {item.content &&
                    item.content.includes("話し相手が見つかりました！") && (
                      <StatusIcon />
                    )} */}
                  <Block
                    row
                    style={[styles.titleContainer, { height: titleSize + 5 }]}
                  >
                    <Text
                      bold
                      color="white"
                      size={titleSize}
                      style={styles.title}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.title}
                    </Text>
                  </Block>

                  {Number.isInteger(countNum) && countNum > 0 ? (
                    <Block
                      style={[
                        styles.counter,
                        {
                          position: "absolute",
                          top: titleSize / 3,
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

                  <Block style={styles.messageContainer}>
                    <Text
                      size={contentSize}
                      style={[styles.textPale, { lineHeight: contentSize + 2 }]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.content}
                    </Text>
                  </Block>
                </Block>
              </>
            )}
          </LinearGradient>
        ) : (
          <Block
            style={[
              styles.card,
              {
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                // minHeight: 90,
              },
            ]}
          >
            <Block style={styles.adMobBanner}>
              {!isExpo && <Admob adUnitId={ADMOB_UNIT_ID_HOME} />}
            </Block>
          </Block>
        )}
      </Block>
    </TouchableWithoutFeedback>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    borderWidth: 0,
    position: "relative",
    width: width - theme.SIZES.BASE * 1.8,
    marginRight: "auto",
    marginLeft: "auto",
  },
  content: {
    padding: theme.SIZES.BASE / 2,
    justifyContent: "space-between",
  },
  shadow: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.9,
    elevation: 2,
  },
  textPale: {
    color: "white",
  },
  messageContainer: {
    justifyContent: "flex-end",
    position: "relative",
    width: width * 0.62,
  },
  titleContainer: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {},
  counter: {
    backgroundColor: COLORS.ALERT,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  adMobBanner: {
    width: ADMOB_BANNER_WIDTH,
    height: ADMOB_BANNER_HEIGHT,
    zIndex: 2,
  },
});

import React from "react";
import { View } from "react-native";
import { Bubble, IMessage, BubbleProps } from "react-native-gifted-chat";
import "dayjs/locale/ja";
import { Text } from "galio-framework";

import { COLORS } from "src/constants/colors";
import { fmtfromDateToStr } from "src/utils";

export const GiftedBubble: React.FC<BubbleProps<IMessage>> = (props) => {
  const { currentMessage, previousMessage, nextMessage, position } = props;

  const currentCreatedAt = currentMessage?.createdAt;
  const previousCreatedAt = previousMessage?.createdAt;
  const nextCreatedAt = nextMessage?.createdAt;
  const currentUser = currentMessage?.user;
  const previousUser = previousMessage?.user;
  const nextUser = nextMessage?.user;

  const isSameAsPreviousCreatedAt =
    typeof currentCreatedAt !== "undefined" &&
    typeof currentCreatedAt !== "number" &&
    typeof currentCreatedAt !== "string" &&
    typeof previousCreatedAt !== "undefined" &&
    typeof previousCreatedAt !== "number" &&
    typeof previousCreatedAt !== "string" &&
    typeof currentUser !== "undefined" &&
    typeof previousUser !== "undefined" &&
    currentUser._id === previousUser._id &&
    currentCreatedAt.getFullYear() === previousCreatedAt.getFullYear() &&
    currentCreatedAt.getMonth() === previousCreatedAt.getMonth() &&
    currentCreatedAt.getDate() === previousCreatedAt.getDate() &&
    currentCreatedAt.getHours() === previousCreatedAt.getHours() &&
    currentCreatedAt.getMinutes() === previousCreatedAt.getMinutes();

  const isSameAsNextCreatedAt =
    typeof currentCreatedAt !== "undefined" &&
    typeof currentCreatedAt !== "number" &&
    typeof currentCreatedAt !== "string" &&
    typeof nextCreatedAt !== "undefined" &&
    typeof nextCreatedAt !== "number" &&
    typeof nextCreatedAt !== "string" &&
    typeof currentUser !== "undefined" &&
    typeof nextUser !== "undefined" &&
    currentUser._id === nextUser._id &&
    currentCreatedAt.getFullYear() === nextCreatedAt.getFullYear() &&
    currentCreatedAt.getMonth() === nextCreatedAt.getMonth() &&
    currentCreatedAt.getDate() === nextCreatedAt.getDate() &&
    currentCreatedAt.getHours() === nextCreatedAt.getHours() &&
    currentCreatedAt.getMinutes() === nextCreatedAt.getMinutes();

  const isFirst =
    !isSameAsPreviousCreatedAt || !(previousMessage && !previousMessage.system);
  const isEnd = !isSameAsNextCreatedAt || !(nextMessage && !nextMessage.system);

  const borderRadius = 22;
  return (
    <View style={{ flexDirection: "column" }}>
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: COLORS.WHITE,
          },
          left: {
            color: COLORS.BLACK,
          },
        }}
        wrapperStyle={{
          right: {
            backgroundColor: COLORS.BROWN,
            paddingRight: 4,
            paddingLeft: 4,
            paddingVertical: 4,
            borderRadius: borderRadius,
            borderTopRightRadius: isFirst ? borderRadius : 0,
            borderBottomRightRadius:
              isEnd &&
              !isFirst /* bubble要素が一つのみの時にただの丸になるのを防ぐ */
                ? borderRadius
                : 0,
          },
          left: {
            paddingRight: 4,
            paddingLeft: 4,
            paddingVertical: 4,
            backgroundColor: COLORS.WHITE,
            borderRadius: borderRadius,
            borderTopLeftRadius: isFirst ? borderRadius : 0,
            borderBottomLeftRadius:
              isEnd &&
              !isFirst /* bubble要素が一つのみの時にただの丸になるのを防ぐ */
                ? borderRadius
                : 0,
          },
        }}
      />

      {isEnd && currentCreatedAt && typeof currentCreatedAt !== "number" && (
        <View
          style={{
            marginTop: 2,
            marginBottom: 10,
            marginHorizontal: 2,
            flexDirection: "row",
            justifyContent: position === "right" ? "flex-end" : "flex-start",
          }}
        >
          <Text
            size={12}
            color={COLORS.GRAY}
            style={{
              textAlign: position,
            }}
          >
            {fmtfromDateToStr(currentCreatedAt, "hh:mm")}
          </Text>

          {position === "right" && currentMessage && !currentMessage.sent && (
            <Text
              size={12}
              color={COLORS.GRAY}
              style={{
                textAlign: position,
                marginLeft: 4,
              }}
            >
              送信中...
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

import React from "react";
import { Text, Block } from "galio-framework";

export const PushNotificationReminderTemplate: React.FC = () => {
  return (
    <Block flex>
      {new Array(40).fill(null).map((_, index) => {
        return (
          <Text key={index}>メッセージが来たらお知らせするよ({index})</Text>
        );
      })}
    </Block>
  );
};

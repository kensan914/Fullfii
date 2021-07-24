import React from "react";
import { Text, Block } from "galio-framework";

export const ExplanationRoomTemplate: React.FC = () => {
  return (
    <Block flex>
      {new Array(40).fill(null).map((_, index) => {
        return (
          <Text key={index}>
            あなたの悩みを話すためのルームを作ろう({index})
          </Text>
        );
      })}
    </Block>
  );
};

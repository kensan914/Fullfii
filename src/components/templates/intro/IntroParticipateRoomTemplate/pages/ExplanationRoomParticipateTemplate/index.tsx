import React from "react";
import { Text, Block } from "galio-framework";

export const ExplanationRoomParticipateTemplate: React.FC = () => {
  return (
    <Block flex>
      {new Array(40).fill(null).map((_, index) => {
        return <Text key={index}>共感できる悩みを聞いてあげよう({index})</Text>;
      })}
    </Block>
  );
};

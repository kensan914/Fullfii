import React from "react";
import { Text, Block } from "galio-framework";

export const ExplanationRoomParticipate2Template: React.FC = () => {
  return (
    <Block flex>
      {new Array(40).fill(null).map((_, index) => {
        return (
          <Text key={index}>悩みを聞くにはルームに入室しよう({index})</Text>
        );
      })}
    </Block>
  );
};

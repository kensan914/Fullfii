import React from "react";
import { Text, Block } from "galio-framework";

export const InputProfileTemplate: React.FC = () => {
  return (
    <Block flex>
      {new Array(40).fill(null).map((_, index) => {
        return <Text key={index}>プロフィールを作成しよう({index})</Text>;
      })}
    </Block>
  );
};

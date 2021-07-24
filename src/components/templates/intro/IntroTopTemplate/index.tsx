import React from "react";
import { Text, Button } from "galio-framework";

type Props = {
  navigateIntroCreateRoom: () => void;
  navigateIntroParticipateRoom: () => void;
  navigateIntroSignup: () => void;
};
export const IntroTopTemplate: React.FC<Props> = (props) => {
  const {
    navigateIntroCreateRoom,
    navigateIntroParticipateRoom,
    navigateIntroSignup,
  } = props;

  return (
    <>
      <Text>IntroTopTemplate</Text>
      <Button onPress={navigateIntroCreateRoom}>自分の悩みを話したい</Button>
      <Button onPress={navigateIntroParticipateRoom}>
        誰かの悩みを聞いてあげたい
      </Button>
      <Button onPress={navigateIntroSignup}>プロフィール作成へ進む</Button>
    </>
  );
};

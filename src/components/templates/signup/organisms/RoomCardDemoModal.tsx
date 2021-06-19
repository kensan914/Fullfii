import React, { Dispatch } from "react";

import { ROOM_CARD_DEMO_IMG } from "src/constants/imagePath";
import { ImageModal } from "src/components/molecules/ImageModal";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
};
export const RoomCardDemoModal: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen } = props;

  return (
    <ImageModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      imageSource={ROOM_CARD_DEMO_IMG}
      title={"あなたの悩みを話す場所です"}
      subTitle={`作成したルームは設定した公開範囲で\n他ユーザーに表示されます`}
    />
  );
};

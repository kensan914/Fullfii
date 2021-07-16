import React, { Dispatch } from "react";

import { PRIVATE_ROOM_DEMO_IMG } from "src/constants/imagePath";
import { ImageModal } from "src/components/molecules/ImageModal";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
};
export const PrivateRoomDemoModal: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen } = props;

  return (
    <ImageModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      imageSource={PRIVATE_ROOM_DEMO_IMG}
      title={"あなたに特別通知されたルームです"}
      subTitle={`他ユーザーがあなたを「また相談したい人リス\nト」に登録している状態でプライベートルームを\n作成した際に、ここに表示されます`}
    />
  );
};

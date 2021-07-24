import React, { Dispatch } from "react";

import { TALK_LIST_DEMO_IMG } from "src/constants/imagePath";
import { ImageModal } from "src/components/molecules/ImageModal";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
};
export const FavoriteUserDemoModal: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen } = props;

  return (
    <ImageModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      imageSource={TALK_LIST_DEMO_IMG}
      title={"信頼できる人に相談できます"}
      subTitle={`追加すると「また相談したい人」だけに\nルームを公開することができるようになります`}
    />
  );
};

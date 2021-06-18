import React, {useState} from "react";
import { IntroCreateRoomTemplate } from "src/components/templates/signup/IntroCreateRoomTemplate";
import { COLORS } from "src/constants/theme";
export const IntroCreateRoomScreen: React.FC = () => {
  const [content, setContent] = useState("");
  const [pressed, setPressed] = useState(false);
  const [openInformationModal, setOpenInformationModal] = useState(false)

  return <IntroCreateRoomTemplate
          content={content}
          setContent={setContent}
          pressed={pressed}
          setPressed={setPressed}
          openInformationModal={openInformationModal}
          setOpenInformationModal={setOpenInformationModal}
          />;
};

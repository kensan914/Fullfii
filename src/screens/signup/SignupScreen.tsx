import React, {useState} from "react";

import { SignupTemplate } from "src/components/templates/signup/SignupTemplate";
import { COLORS } from "src/constants/theme";


export const SignupScreen: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [pressed, setPressed] = useState(false);
  const [genderButtonColors, setGenderButtonColors] = useState([COLORS.WHITE, COLORS.BLACK])
  return <SignupTemplate
          userName={userName}
          setUserName={setUserName}
          pressed={pressed}
          setPressed={setPressed}
          genderButtonColors={genderButtonColors}
          setGenderButtonColors={setGenderButtonColors}
          />;
};

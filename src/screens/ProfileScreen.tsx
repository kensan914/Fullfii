import React, {useState} from "react";
import { ProfileTemplate } from "src/components/templates/ProfileTemplate";

export const ProfileScreen: React.FC = () => {
const [close, setClose] = useState(false)
  return <ProfileTemplate close={close} setClose={setClose}/>;
};

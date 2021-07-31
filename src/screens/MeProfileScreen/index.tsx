import React from "react";

import { ProfileScreen } from "src/screens/ProfileScreen";

export const MeProfileScreen: React.FC = () => {
  return <ProfileScreen isMe={true} />;
};

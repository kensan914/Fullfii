import { useEffect, useState } from "react";
import { COLORS } from "src/constants/colors";
import { Room, TalkingRoom } from "src/types/Types.context";

export const useRoomParticipantsNum = (
  room: TalkingRoom | Room
): {
  isMaxed: boolean;
  participantIconName: string;
  participantIconColor: string;
} => {
  const [isMaxed, setIsMaxed] = useState(false);
  useEffect(() => {
    setIsMaxed(room.participants.length >= room.maxNumParticipants);
  }, [room.participants.length]);

  const participantIconName = isMaxed ? "person" : "person-outline";
  const participantIconColor = isMaxed ? COLORS.GREEN : COLORS.LIGHT_GRAY;

  return {
    isMaxed,
    participantIconName,
    participantIconColor,
  };
};

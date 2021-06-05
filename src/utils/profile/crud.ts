import { MeProfile } from "src/types/Types.context";

/**
 * meProfile.isActiveがfalseの場合は、そもそも401エラーが返るので通常は使用しない
 * @param meProfile
 * @returns
 */
export const checkMeProfileIsActive = (meProfile: MeProfile): boolean => {
  if ("isActive" in meProfile) {
    return meProfile.isActive;
  } else {
    return true;
  }
};

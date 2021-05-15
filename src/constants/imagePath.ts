import broken_heart_img from "src/assets/images/homeTransparent/broken_heart.png";
import employment_img from "src/assets/images/homeTransparent/employment.png";
import goal_img from "src/assets/images/homeTransparent/goal.png";
import part_time_job_img from "src/assets/images/homeTransparent/part_time_job.png";
import relationships_img from "src/assets/images/homeTransparent/relationships.png";
import unrequited_love_img from "src/assets/images/homeTransparent/unrequited_love.png";
import want_to_talk_img from "src/assets/images/homeTransparent/want_to_talk.png";
import man_and_woman_img from "src/assets/images/createRoomModal/manAndWoman.png";
import men_img from "src/assets/images/createRoomModal/men.png";
import women_img from "src/assets/images/createRoomModal/women.png";

export const HOME_IMG: { [key: string]: string } = {
  a: broken_heart_img, //失恋
  b: unrequited_love_img, //片想い
  c: part_time_job_img, //アルバイト
  d: employment_img, //就職
  e: goal_img, //目標夢
  f: relationships_img, //人間関係
  g: want_to_talk_img, //話したい
  h: part_time_job_img,
};

export const DISCLOSURE_RANGE_IMAGE: { [key: string]: string } = {
  a: man_and_woman_img,
  b: men_img,
  c: women_img,
};

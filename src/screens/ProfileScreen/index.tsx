import { useNavigation } from "@react-navigation/native";
import React, {useState} from "react";
import { ProfileTemplate } from "src/components/templates/ProfileTemplate";

type userInfo = {
  name: string,
  gender: string,
  job: string,
  image: string,
  sumOfTalkedRoom: number,
  sumOfListenedRoom: number
};
type wantToTalkUsers = {
  name: string,
  image: string
}[]

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isList, setIsList] = useState(false);

  const onTransitionProfileEditor = () => {
    navigation.navigate("ProfileEditor");
  };

  const wantToTalkUsers: wantToTalkUsers = [
    {
      name: '匿名子',
      image: 'sample image',
    },
    {
      name: '匿名子2',
      image: 'sample image',
    },
    {
      name: '匿名子3',
      image: 'sample image',
    },
    {
      name: '匿名子4',
      image: 'sample image',
    },
    {
      name: '匿名子5',
      image: 'sample image',
    },
    {
      name: '匿名子6',
      image: 'sample image',
    },
    {
      name: '匿名子7',
      image: 'sample image',
    },
    {
      name: '匿名子8',
      image: 'sample image',
    },
    {
      name: '匿名子9',
      image: 'sample image',
    },
  ];

  const userInfo: userInfo = {
    name: "名無しさん",
    gender: "女性",
    job: "フリーター",
    image: "ddd",
    sumOfTalkedRoom: 24,
    sumOfListenedRoom: 5
  }

  return (
    <ProfileTemplate onTransitionProfileEditor={onTransitionProfileEditor} userInfo={userInfo} wantToTalkUsers={wantToTalkUsers} />
  );
};

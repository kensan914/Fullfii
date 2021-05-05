import React from "react";

import { useAuthDispatch } from "src/contexts/AuthContext";
import { GoToPage } from "src/types/Types";
import SignUpPageTemplate from "src/components/templates/signup/signupPages/SignUpPageTemplate";

type Props = {
  goToPage: GoToPage;
  progressNum: number;
};
const SignUpPageFirst: React.FC<Props> = (props) => {
  const { goToPage, progressNum } = props;
  const authDispatch = useAuthDispatch();
  const pressButton = () => {
    authDispatch({
      type: "TO_PROGRESS_SIGNUP",
      didProgressNum: progressNum,
      isFinished: false,
    });
    goToPage(progressNum + 1);
  };

  return (
    <SignUpPageTemplate
      title={"はじめまして" + "\n" + "ようこそ、Fullfiiへ"}
      subTitle="これから簡単な使い方の説明とプロフィールの作成を始めていきます。"
      isLoading={false}
      pressCallback={pressButton}
      buttonTitle="使い方を見る"
    />
  );
};

export default SignUpPageFirst;

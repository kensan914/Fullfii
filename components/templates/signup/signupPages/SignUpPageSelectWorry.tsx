import React, { useState } from "react";
import { Dimensions } from "react-native";

import SignUpPageTemplate from "./SignUpPageTemplate";
import { useAuthDispatch } from "../../../contexts/AuthContext";
import { useProfileState } from "../../../contexts/ProfileContext";
import BubbleList from "../../../organisms/BubbleList";
import { logEvent } from "../../../modules/firebase/logEvent";
import { hasProperty } from "../../../modules/support";
import { GoToPage, PressBubble } from "../../../types/Types";
import { GenreOfWorriesCollection } from "../../../types/Types.context";

const { height } = Dimensions.get("screen");

type Props = {
  goToPage: GoToPage;
  progressNum: number;
};
const SignUpPageSelectWorry: React.FC<Props> = (props) => {
  const { goToPage, progressNum } = props;
  const authDispatch = useAuthDispatch();
  const profileState = useProfileState();
  const minSelectWorryNum = 1;

  const [
    worriesCollection,
    setWorriesCollection,
  ] = useState<GenreOfWorriesCollection>({});
  const checkCanNext = () => {
    return Object.keys(worriesCollection).length >= minSelectWorryNum;
  };

  const pressButton = () => {
    authDispatch({
      type: "TO_PROGRESS_SIGNUP",
      didProgressNum: progressNum,
      isFinished: false,
    });
    authDispatch({
      type: "SET_WORRIES_BUFFER",
      worries: Object.values(worriesCollection),
    });
    logEvent("intro_worry_bubble", {
      worries: Object.values(worriesCollection)
        .map((worry) => {
          return worry?.label;
        })
        .join(", "),
    });

    goToPage(progressNum + 1);
  };

  const genreOfWorries = profileState.profileParams
    ? (JSON.parse(
        JSON.stringify(profileState.profileParams.genreOfWorries)
      ) as GenreOfWorriesCollection)
    : ({} as GenreOfWorriesCollection);

  const pressBubble: PressBubble = (key) => {
    const _worriesCollection = { ...worriesCollection };
    if (hasProperty(_worriesCollection, key)) {
      delete _worriesCollection[key];
    } else {
      _worriesCollection[key] = genreOfWorries[key];
    }
    setWorriesCollection(_worriesCollection);
  };

  const renderContents = () => {
    const iPhoneXHeight = 812;
    const isHigherDevice = height >= iPhoneXHeight;

    return (
      <BubbleList
        items={Object.values(genreOfWorries)}
        limitLines={isHigherDevice ? 3 : 3}
        diameter={isHigherDevice ? height / 10 : undefined}
        margin={isHigherDevice ? 3.0 : undefined}
        activeKeys={Object.keys(worriesCollection)}
        pressBubble={pressBubble}
      />
    );
  };

  return (
    <SignUpPageTemplate
      title="あなたの悩みをおしえて下さい"
      subTitle={`当てはまる悩みを選択してください。選んだ悩みは後で変更できます。`}
      contents={renderContents()}
      isLoading={false}
      pressCallback={pressButton}
      buttonTitle="プロフィールの作成に進む"
      checkCanNext={checkCanNext}
      statesRequired={[worriesCollection]}
    />
  );
};

export default SignUpPageSelectWorry;

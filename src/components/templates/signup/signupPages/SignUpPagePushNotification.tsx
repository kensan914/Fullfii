import React from "react";
import { Dimensions, Image } from "react-native";
import { Block } from "galio-framework";

import SignUpPageTemplate from "src/components/templates/signup/signupPages/SignUpPageTemplate";
import { useAuthDispatch } from "src/contexts/AuthContext";

const { width } = Dimensions.get("window");

type Props = {
  progressNum: number;
};
const SignUpPagePushNotification: React.FC<Props> = (props) => {
  const { progressNum } = props;
  const authDispatch = useAuthDispatch();
  const pressButton = () => {
    authDispatch({
      type: "TO_PROGRESS_SIGNUP",
      didProgressNum: progressNum,
      isFinished: true,
    });
  };

  const renderContents = () => {
    return (
      <Block
        flex
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: width,
        }}
      >
        <Image
          style={{
            width: "85%",
            resizeMode: "contain",
          }}
          source={require("src/assets/images/signup/pushNotificationDialog.png")}
        />
      </Block>
    );
  };

  return (
    <SignUpPageTemplate
      title={"通知を受け取る"}
      subTitle="話し相手が見つかった時やメッセージを受信した時にお知らせします。この機能はいつでも「設定」で変更できます。"
      isLoading={false}
      contents={renderContents()}
      pressCallback={pressButton}
      buttonTitle="受け取る"
      pressSubCallback={pressButton}
      subButtonTitle="受け取らない"
    />
  );
};

export default SignUpPagePushNotification;

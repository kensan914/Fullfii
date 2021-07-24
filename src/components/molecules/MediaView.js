import React from "react";
import { Dimensions } from "react-native";
import { MediaView } from "react-native-admob-native-ads";

import { logAdmob } from "src/utils";

export const MediaViews = ({ aspectRatio = 1.5 }) => {
  const onVideoPlay = () => {
    logAdmob("VIDEO", "PLAY", "Video is now playing");
  };

  const onVideoPause = () => {
    logAdmob("VIDEO", "PAUSED", "Video is now paused");
  };

  const onVideoProgress = (event) => {
    logAdmob("VIDEO", "PROGRESS UPDATE", event);
  };

  const onVideoEnd = () => {
    logAdmob("VIDEO", "ENDED", "Video end reached");
  };

  const onVideoMute = (muted) => {
    logAdmob("VIDEO", "MUTE", muted);
  };

  return (
    <MediaView
      style={{
        width: "100%",
        height: Dimensions.get("window").width / 1.5,
        backgroundColor: "white",
      }}
      onVideoPause={onVideoPause}
      onVideoPlay={onVideoPlay}
      onVideoEnd={onVideoEnd}
      onVideoProgress={onVideoProgress}
      onVideoMute={onVideoMute}
    />
  );
};

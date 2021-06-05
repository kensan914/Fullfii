import React from "react";
import { Dimensions } from "react-native";
import { MediaView } from "react-native-admob-native-ads";

import { Logger } from "src/constants";

export const MediaViews = ({ aspectRatio = 1.5 }) => {
  const onVideoPlay = () => {
    Logger("VIDEO", "PLAY", "Video is now playing");
  };

  const onVideoPause = () => {
    Logger("VIDEO", "PAUSED", "Video is now paused");
  };

  const onVideoProgress = (event) => {
    Logger("VIDEO", "PROGRESS UPDATE", event);
  };

  const onVideoEnd = () => {
    Logger("VIDEO", "ENDED", "Video end reached");
  };

  const onVideoMute = (muted) => {
    Logger("VIDEO", "MUTE", muted);
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

import { RefObject, useEffect, useRef, useState } from "react";

import { AnimatedTextMethods } from "src/components/templates/intro/organisms/AnimatedText";
import { AnimatedViewMethods } from "src/components/templates/intro/organisms/AnimatedView";
import { useAuthState } from "src/contexts/AuthContext";

export type IntroTopScene = "01" | "02";
export type IntroTopAnimationProps = {
  currentScene: IntroTopScene;
  animatedTextRefScene1_title: RefObject<AnimatedTextMethods>;
  animatedViewRefScene1_whole: RefObject<AnimatedViewMethods>;
  animatedViewRefScene1_comment: RefObject<AnimatedViewMethods>;
  animatedViewRefScene2_whole: RefObject<AnimatedViewMethods>;
  onPressScreen: () => void;
};
export const useIntroTopAnimation = (): IntroTopAnimationProps => {
  const authState = useAuthState();

  const [initCurrentScene] = useState<IntroTopScene>(
    authState.signupBuffer.introCreateRoom.isComplete ||
      authState.signupBuffer.introParticipateRoom.isComplete
      ? "02"
      : "01"
  );
  const [currentScene, _setCurrentScene] =
    useState<IntroTopScene>(initCurrentScene);
  const currentSceneRef = useRef(initCurrentScene);
  const setCurrentScene = (scene: IntroTopScene): void => {
    currentSceneRef.current = scene;
    _setCurrentScene(scene);
  };
  const [isReadyScene, _setIsReadyScene] = useState<boolean>(false);
  const isReadySceneRef = useRef(false);
  const setIsReadyScene = (_isReadyScene: boolean): void => {
    isReadySceneRef.current = _isReadyScene;
    _setIsReadyScene(_isReadyScene);
  };
  const animatedTextRefScene1_title = useRef<AnimatedTextMethods>(null);
  const [animatedTextScene1Id] = useState("ANIMATED_TEXT_SCENE_1");
  const animatedViewRefScene1_whole = useRef<AnimatedViewMethods>(null);
  const animatedViewRefScene1_comment = useRef<AnimatedViewMethods>(null);
  const animatedViewRefScene2_whole = useRef<AnimatedViewMethods>(null);

  useEffect(() => {
    if (initCurrentScene === "01") {
      animatedViewRefScene1_whole.current &&
        animatedViewRefScene1_whole.current.startInAnimation(() => void 0, {
          settingByType: { type: "FADE_IN" },
          duration: 0,
        });
      animatedTextRefScene1_title.current &&
        animatedTextRefScene1_title.current.startAnimation(
          animatedTextScene1Id,
          () => {
            animatedViewRefScene1_comment.current &&
              animatedViewRefScene1_comment.current.startInAnimation(
                () => {
                  setIsReadyScene(true);
                },
                { delayStartIntervalMs: 1000 }
              );
          },
          { delayStartIntervalMs: 600 }
        );
    } else if (initCurrentScene === "02") {
      animatedViewRefScene2_whole.current &&
        animatedViewRefScene2_whole.current.startInAnimation(() => void 0, {
          settingByType: { type: "FADE_IN" },
          duration: 0,
        });
    }
  }, []);

  const onPressScreen = () => {
    if (!isReadySceneRef.current) return;

    if (currentSceneRef.current === "01") {
      setIsReadyScene(false);
      animatedViewRefScene1_whole.current &&
        animatedViewRefScene1_whole.current.startOutAnimation(() => {
          setCurrentScene("02");
          animatedViewRefScene2_whole.current &&
            animatedViewRefScene2_whole.current.startInAnimation(() => void 0);
        });
    }
  };

  return {
    currentScene,
    animatedTextRefScene1_title,
    animatedViewRefScene1_whole,
    animatedViewRefScene1_comment,
    animatedViewRefScene2_whole,
    onPressScreen,
  };
};

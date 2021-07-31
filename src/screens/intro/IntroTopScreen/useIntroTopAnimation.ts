import { RefObject, useEffect, useRef, useState } from "react";

import { AnimatedViewMethods } from "src/components/templates/intro/organisms/AnimatedView";
import { useAuthState } from "src/contexts/AuthContext";

export type IntroTopScene = "01" | "02";
export type IntroTopAnimationProps = {
  currentScene: IntroTopScene;
  animatedViewRefScene1_title: RefObject<AnimatedViewMethods>;
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
  const animatedViewRefScene1_title = useRef<AnimatedViewMethods>(null);
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
      animatedViewRefScene1_title.current &&
        animatedViewRefScene1_title.current.startInAnimation(
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
    animatedViewRefScene1_title,
    animatedViewRefScene1_whole,
    animatedViewRefScene1_comment,
    animatedViewRefScene2_whole,
    onPressScreen,
  };
};

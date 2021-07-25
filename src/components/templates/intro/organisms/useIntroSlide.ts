import { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";

import { width } from "src/constants";
import { useAuthState } from "src/contexts/AuthContext";
import { GoToPage } from "src/types/Types";

/**
 * イントロスライドビューに必要なstate, functionを提供
 */
export const useIntroSlide = (): {
  initPage: number;
  currentPage: number;
  scrollViewRef: React.RefObject<ScrollView>;
  goToPage: GoToPage;
} => {
  // const authState = useAuthState();
  const [initPage] = useState(
    // didProgressNumは完了済みのページ番号なのでその次のページから(+1)
    1
  );
  const [currentPage, setCurrentPage] = useState(initPage);
  const scrollViewRef = useRef<ScrollView>(null);

  const goToPage: GoToPage = (toPageNum = currentPage + 1) => {
    scrollViewRef.current &&
      scrollViewRef.current.scrollTo({
        y: 0,
        x: width * (toPageNum - initPage),
        animated: true,
      });
    setCurrentPage(toPageNum);
  };

  useEffect(() => {
    // 既に完了しているページは省略(ex. didProgressNum===2 --> ThirdPageから)
    // const _pageStack = pageStack.slice(authState.signupBuffer.didProgressNum);
    // setPageStack(_pageStack);
  }, []);

  return { initPage, currentPage, scrollViewRef, goToPage };
};

import { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";

import { width } from "src/constants";
import { useAuthState } from "src/contexts/AuthContext";
import { GoToPage } from "src/types/Types";

/**
 * イントロスライドビューに必要なstate, functionを提供
 */
export const useIntroSlide = (
  pageLength: number
): {
  initPage: number;
  currentPage: number;
  bodyScrollViewRef: React.RefObject<ScrollView>;
  footerScrollViewRef: React.RefObject<ScrollView>;
  goToPage: GoToPage;
} => {
  // const authState = useAuthState();
  const [initPage] = useState(
    // didProgressNumは完了済みのページ番号なのでその次のページから(+1)
    1
  );
  const [currentPage, setCurrentPage] = useState(initPage);
  const bodyScrollViewRef = useRef<ScrollView>(null);
  const footerScrollViewRef = useRef<ScrollView>(null);

  const scroll = (
    scrollViewRef: React.RefObject<ScrollView>,
    toPageNum: number
  ) => {
    scrollViewRef.current &&
      scrollViewRef.current.scrollTo({
        y: 0,
        x: width * (toPageNum - initPage),
        animated: true,
      });
  };

  const goToPage: GoToPage = (toPageNum = currentPage + 1) => {
    if (0 < toPageNum && toPageNum <= pageLength) {
      scroll(bodyScrollViewRef, toPageNum);
      scroll(footerScrollViewRef, toPageNum);
      setCurrentPage(toPageNum);
    }
  };

  useEffect(() => {
    // 既に完了しているページは省略(ex. didProgressNum===2 --> ThirdPageから)
    // const _pageStack = pageStack.slice(authState.signupBuffer.didProgressNum);
    // setPageStack(_pageStack);
  }, []);

  return {
    initPage,
    currentPage,
    bodyScrollViewRef,
    footerScrollViewRef,
    goToPage,
  };
};

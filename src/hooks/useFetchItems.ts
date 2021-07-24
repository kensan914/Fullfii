import { Dispatch, useEffect, useRef, useState } from "react";

import { useAxios } from "src/hooks/useAxios";
import { URLJoin } from "src/utils";
import { TypeIoTsOfResData } from "src/types/Types";
import { useAuthState } from "src/contexts/AuthContext";

export const useFetchItems = <Item, ResData>(
  items: Item[],
  setItems: Dispatch<Item[]>,
  urlExcludePage: string,
  resDataIoTs: TypeIoTsOfResData | null,
  cvtJsonToObject: (resData: ResData) => Item[],
  getHasMore: (resData: ResData) => boolean
): {
  onEndReached: () => void;
  handleRefresh: () => void;
  isRefreshing: boolean;
  hasMore: boolean;
  isLoadingGetItems: boolean;
} => {
  const authState = useAuthState();

  const page = useRef(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isRefreshingRef = useRef(false);
  const isLoadingGetItemsRef = useRef(false); // 即時反映

  const { isLoading: isLoadingGetItems, request: requestGetItems } = useAxios(
    URLJoin(urlExcludePage, `?page=${page.current}`),
    "get",
    resDataIoTs,
    {
      thenCallback: (resData) => {
        const _resData = resData as ResData;
        const _hasMore = getHasMore(_resData);
        const _items = cvtJsonToObject(_resData);

        if (isRefreshingRef.current) {
          setItems([..._items]);
        } else {
          setItems([...items, ..._items]);
        }

        setHasMore(_hasMore);
      },
      finallyCallback: () => {
        page.current += 1;
        isRefreshingRef.current = false;
        isLoadingGetItemsRef.current = false;
      },
      token: authState.token ? authState.token : "",
      didRequestCallback: () => {
        isLoadingGetItemsRef.current = true;
      },
    }
  );

  useEffect(() => {
    setIsRefreshing(isRefreshingRef.current);
  }, [isRefreshingRef.current]);

  const onEndReached = () => {
    if (hasMore && !isLoadingGetItems && !isLoadingGetItemsRef.current) {
      requestGetItems({
        url: URLJoin(urlExcludePage, `?page=${page.current}`),
      });
    }
  };
  const handleRefresh = () => {
    if (!isLoadingGetItems && !isLoadingGetItemsRef.current) {
      page.current = 1;
      setHasMore(true);
      isRefreshingRef.current = true;
      requestGetItems({ url: URLJoin(urlExcludePage, `?page=${1}`) });
    }
  };

  return {
    onEndReached,
    handleRefresh,
    isRefreshing,
    hasMore,
    isLoadingGetItems,
  };
};

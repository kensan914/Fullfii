import { ReactNode, useEffect, useState } from "react";
import { isExpo } from "../../constants/env";

const useAdView = () => {
  const [adViewModule, setAdViewModule] = useState<ReactNode>();

  useEffect(() => {
    if (!isExpo) {
      import("../molecules/AdView").then((_adViewModule) => {
        setAdViewModule(_adViewModule);
      });
    }
  }, []);

  return adViewModule;
};

export default useAdView;

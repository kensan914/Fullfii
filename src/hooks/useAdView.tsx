import { ReactNode, useEffect, useState } from "react";

import { isExpo } from "src/constants/env";

const useAdView = (): ReactNode => {
  const [adViewModule, setAdViewModule] = useState<ReactNode>();

  useEffect(() => {
    if (!isExpo) {
      import("src/components/molecules/AdView").then((_adViewModule) => {
        setAdViewModule(_adViewModule);
      });
    }
  }, []);

  return adViewModule;
};

export default useAdView;

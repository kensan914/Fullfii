import React, { useState } from "react";

import { FilterHeaderMenu } from "src/navigations/Header/organisms/FilterHeaderMenu";

export type FilterKey = "all" | "speak" | "listen";
export const useFilterRoom = (): {
  filterKey: FilterKey;
  filterHeaderMenu: () => React.ReactNode;
} => {
  const [filterKey, setFilterKey] = useState<FilterKey>("all");

  const filterHeaderMenu = () => {
    return (
      <FilterHeaderMenu filterKey={filterKey} setFilterKey={setFilterKey} />
    );
  };

  return { filterKey, filterHeaderMenu };
};

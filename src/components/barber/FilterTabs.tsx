
import React from "react";
import { cn } from "@/lib/utils";

type FilterTabsProps = {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  filters: string[];
};

const FilterTabs = ({ activeFilter, setActiveFilter, filters }: FilterTabsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={cn(
            "filter-pill whitespace-nowrap",
            activeFilter === filter ? "active" : ""
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;

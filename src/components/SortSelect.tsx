import { SORT_LABELS } from "../sortBooks";
import type { SortKey } from "../sortBooks";
import { CONTROL_CLASSES } from "./Field";

type SortSelectProps = {
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
};

export default function SortSelect({ sort, onSortChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm whitespace-nowrap text-muted">
        Sort by
      </label>
      <select
        id="sort"
        value={sort}
        onChange={(event) => onSortChange(event.target.value as SortKey)}
        className={`${CONTROL_CLASSES} w-auto`}
      >
        {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(
          ([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          )
        )}
      </select>
    </div>
  );
}

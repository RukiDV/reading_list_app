import { STATUS_LABELS } from "../books";
import type { StatusFilter } from "../types";
import { CONTROL_CLASSES } from "./Field";
import Button from "./Button";
import ViewToggle from "./ViewToggle";
import type { ViewMode } from "./ViewToggle";

type ToolbarProps = {
  query: string;
  status: StatusFilter;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: StatusFilter) => void;
};

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...(Object.entries(STATUS_LABELS) as [StatusFilter, string][]).map(
    ([value, label]) => ({ value, label })
  ),
];

export default function Toolbar({
  query,
  status,
  view,
  onViewChange,
  onQueryChange,
  onStatusChange,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="sm:w-80">
        <label htmlFor="search" className="sr-only">
          Search by title
        </label>
        <input
          id="search"
          type="search"
          value={query}
          placeholder="Search by title..."
          onChange={(event) => onQueryChange(event.target.value)}
          className={CONTROL_CLASSES}
        />
      </div>
      <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => (
          <Button
            key={value}
            variant={status === value ? "primary" : "secondary"}
            aria-pressed={status === value}
            onClick={() => onStatusChange(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      <ViewToggle view={view} onViewChange={onViewChange} />
    </div>
  );
}

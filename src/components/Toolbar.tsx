import { STATUS_LABELS } from "@/books";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StatusFilter } from "@/types";
import type { SortKey } from "../sortBooks";
import SortSelect from "./SortSelect";
import ViewToggle from "./ViewToggle";
import type { ViewMode } from "./ViewToggle";

type ToolbarProps = {
  query: string;
  status: StatusFilter;
  view: ViewMode;
  sort: SortKey;
  onViewChange: (view: ViewMode) => void;
  onSortChange: (sort: SortKey) => void;
  onPickNext: () => void;
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
  sort,
  onViewChange,
  onSortChange,
  onPickNext,
  onQueryChange,
  onStatusChange,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="sm:w-80">
        <Label htmlFor="search" className="sr-only">
          Search by title
        </Label>
        <Input
          id="search"
          type="search"
          value={query}
          placeholder="Search by title..."
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => (
          <Button
            key={value}
            variant={status === value ? "default" : "outline"}
            aria-pressed={status === value}
            onClick={() => onStatusChange(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <SortSelect sort={sort} onSortChange={onSortChange} />
        <Button variant="outline" onClick={onPickNext}>
          Pick my next book
        </Button>
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>
    </div>
  );
}

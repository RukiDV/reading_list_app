import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_LABELS } from "../sortBooks";
import type { SortKey } from "../sortBooks";

type SortSelectProps = {
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
};

const SORT_ITEMS = (Object.entries(SORT_LABELS) as [SortKey, string][]).map(
  ([value, label]) => ({ value, label })
);

export default function SortSelect({ sort, onSortChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sort" className="whitespace-nowrap text-muted-foreground">
        Sort by
      </Label>
      <Select
        items={SORT_ITEMS}
        value={sort}
        onValueChange={(value) => onSortChange(value as SortKey)}
      >
        <SelectTrigger id="sort">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_ITEMS.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

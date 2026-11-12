import { STATUS_SOLID_CLASSES } from "../statusColors";
import type { Book } from "../types";

type BookSpineProps = {
  book: Book;
  selected: boolean;
  panelId: string;
  onSelect: (book: Book) => void;
};

const SPINE_WIDTHS = ["w-10", "w-12", "w-14"];
const SPINE_HEIGHTS = ["h-40", "h-44", "h-48"];

/** The same book always gets the same size, so the shelf does not jump around. */
function hash(text: string): number {
  let value = 0;
  for (const char of text) {
    value = (value * 31 + char.charCodeAt(0)) >>> 0;
  }
  return value;
}

export default function BookSpine({
  book,
  selected,
  panelId,
  onSelect,
}: BookSpineProps) {
  const seed = hash(book.id);
  const width = SPINE_WIDTHS[seed % SPINE_WIDTHS.length];
  const height = SPINE_HEIGHTS[Math.floor(seed / 3) % SPINE_HEIGHTS.length];
  const lift = selected
    ? "-translate-y-4 rotate-3"
    : "hover:-translate-y-2 focus-visible:-translate-y-2";

  return (
    <li className="flex h-(--shelf-row) items-end pb-(--shelf-board)">
      <button
        type="button"
        aria-label={`${book.title} by ${book.author}`}
        aria-expanded={selected}
        aria-controls={selected ? panelId : undefined}
        onClick={() => onSelect(book)}
        className={`${width} ${height} ${STATUS_SOLID_CLASSES[book.status]} ${lift} origin-bottom rounded-t-sm border-y-4 border-on-accent/30 px-1 py-2 font-serif text-sm font-semibold text-on-accent shadow-md writing-vertical motion-safe:transition-transform motion-safe:duration-300`}
      >
        <span className="block truncate">{book.title}</span>
      </button>
    </li>
  );
}

import { STATUS_LABELS } from "../books";
import { STATUS_SOLID_CLASSES } from "../statusColors";
import type { Book } from "../types";

type BookSpineProps = {
  book: Book;
  selected: boolean;
  panelId: string;
  onSelect: (book: Book) => void;
};

const SPINE_WIDTHS = ["w-8 sm:w-10", "w-10 sm:w-12", "w-12 sm:w-14", "w-14 sm:w-16"];
const SPINE_HEIGHTS = ["h-36 sm:h-44", "h-40 sm:h-48", "h-44 sm:h-52", "h-48 sm:h-56"];

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
  const height = SPINE_HEIGHTS[Math.floor(seed / 4) % SPINE_HEIGHTS.length];
  // Books you have not started lean on their neighbour. Five stars get a medal.
  const leans = book.status === "want-to-read";
  const favourite = book.rating === 5;
  const lift = selected
    ? "-translate-y-5 rotate-3 scale-105 shadow-2xl z-10"
    : `${leans ? "rotate-2" : ""} shadow-lg hover:-translate-y-2 focus-visible:-translate-y-2`;
  const label = `${book.title} by ${book.author}, ${STATUS_LABELS[book.status]}${
    book.rating ? `, rated ${book.rating} out of 5` : ""
  }`;

  return (
    <li
      className={`flex h-(--shelf-row) items-end pb-(--shelf-board) ${leans ? "mr-1.5" : ""}`}
    >
      <button
        type="button"
        aria-label={label}
        title={book.title}
        aria-expanded={selected}
        aria-controls={selected ? panelId : undefined}
        onClick={() => onSelect(book)}
        className={`${width} ${height} ${STATUS_SOLID_CLASSES[book.status]} ${lift} spine-finish relative origin-bottom rounded-t-sm pt-8 pr-1 ${favourite ? "pb-12" : "pb-8"} pl-1 font-serif text-sm sm:text-base font-semibold text-gold writing-vertical motion-safe:transition-all motion-safe:duration-300`}
      >
        {book.status === "reading" && (
          <span
            aria-hidden="true"
            className="absolute -top-3 right-2 h-6 w-2.5 bg-ribbon ribbon-end shadow-md"
          />
        )}
        <span className="block truncate">{book.title}</span>
        {favourite && (
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-1/2 flex size-5 -translate-x-1/2 items-center justify-center rounded-full bg-gold text-xs text-wood-dark shadow-md"
          >
            ★
          </span>
        )}
      </button>
    </li>
  );
}

import { STATUS_SOLID_CLASSES } from "../statusColors";
import type { Book } from "../types";

type BookCoverProps = { book: Book };

/** A cover that swings open when it appears (a 3D turn around its left edge). */
export default function BookCover({ book }: BookCoverProps) {
  return (
    <div
      aria-hidden="true"
      className="w-44 shrink-0 self-center perspective-distant sm:self-start"
    >
      <div
        className={`${STATUS_SOLID_CLASSES[book.status]} book-pages relative h-64 origin-left rounded-r-md border-l-8 border-on-accent/30 font-serif text-gold transform-3d motion-safe:animate-cover-open`}
      >
        <div className="flex h-full flex-col justify-between border border-gold/70 m-2 p-3">
          <p className="text-xl font-bold">{book.title}</p>
          <p className="text-sm">{book.author}</p>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-r-md bg-linear-to-br from-on-accent/25 via-transparent to-transparent" />
      </div>
    </div>
  );
}

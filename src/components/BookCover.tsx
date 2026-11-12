import { STATUS_SOLID_CLASSES } from "../statusColors";
import type { Book } from "../types";

type BookCoverProps = { book: Book };

/** A cover that swings open when it appears (a 3D turn around its left edge). */
export default function BookCover({ book }: BookCoverProps) {
  return (
    <div
      aria-hidden="true"
      className="w-40 shrink-0 self-center perspective-distant sm:self-start"
    >
      <div
        className={`${STATUS_SOLID_CLASSES[book.status]} flex h-56 origin-left flex-col justify-between rounded-r-md border-l-8 border-on-accent/30 p-4 font-serif text-on-accent shadow-lg transform-3d motion-safe:animate-cover-open`}
      >
        <p className="text-xl font-bold">{book.title}</p>
        <p className="text-sm">{book.author}</p>
      </div>
    </div>
  );
}

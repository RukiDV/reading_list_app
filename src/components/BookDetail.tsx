import { useEffect, useRef } from "react";

import type { Book } from "../types";
import BookCover from "./BookCover";
import Button from "./Button";
import Rating from "./Rating";
import StatusBadge from "./StatusBadge";

type BookDetailProps = {
  id: string;
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onClose: () => void;
};

export default function BookDetail({
  id,
  book,
  onEdit,
  onDelete,
  onClose,
}: BookDetailProps) {
  const ref = useRef<HTMLElement>(null);

  // On a small screen the panel is below the fold, so bring it into view.
  useEffect(() => {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    ref.current?.scrollIntoView?.({
      block: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      aria-label={`Details: ${book.title}`}
      className="mt-4 flex flex-col gap-4 rounded-lg bg-surface p-4 ring-1 ring-line motion-safe:animate-detail-in sm:flex-row"
    >
      <BookCover book={book} />
      <div className="flex flex-1 flex-col gap-2">
        <h2 className="text-xl font-semibold">{book.title}</h2>
        <p className="text-muted">{book.author}</p>
        <div className="flex items-center gap-4">
          <StatusBadge status={book.status} />
          <Rating rating={book.rating} />
        </div>
        {book.notes && <p className="text-ink">{book.notes}</p>}
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Button aria-label={`Edit ${book.title}`} onClick={() => onEdit(book)}>
            Edit
          </Button>
          <Button
            variant="danger"
            aria-label={`Delete ${book.title}`}
            onClick={() => onDelete(book)}
          >
            Delete
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </section>
  );
}

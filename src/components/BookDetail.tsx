import { useEffect, useRef } from "react";

import type { Book } from "../types";
import BookCover from "./BookCover";
import { Button } from "@/components/ui/button";
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
    // Move the focus into the panel, so the next Tab reaches Edit and Delete.
    ref.current?.focus({ preventScroll: true });
    ref.current?.scrollIntoView?.({
      block: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
      aria-label={`Details: ${book.title}`}
      className="mt-4 flex flex-col gap-4 rounded-lg bg-card p-4 text-card-foreground ring-1 ring-border motion-safe:animate-detail-in sm:flex-row"
    >
      <BookCover book={book} />
      <div className="flex flex-1 flex-col gap-2">
        <h2 className="text-xl font-semibold">{book.title}</h2>
        <p className="text-muted-foreground">{book.author}</p>
        <div className="flex items-center gap-4">
          <StatusBadge status={book.status} />
          <Rating rating={book.rating} />
        </div>
        {book.notes && <p>{book.notes}</p>}
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Button variant="outline" aria-label={`Edit ${book.title}`} onClick={() => onEdit(book)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            aria-label={`Delete ${book.title}`}
            onClick={() => onDelete(book)}
          >
            Delete
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </section>
  );
}

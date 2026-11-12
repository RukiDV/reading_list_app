import { useEffect, useId, useRef } from "react";

import type { Book } from "../types";
import BookDetail from "./BookDetail";
import BookSpine from "./BookSpine";
import ShelfLamp from "./ShelfLamp";
import ShelfPlaque from "./ShelfPlaque";

type BookShelfProps = {
  books: Book[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  /** Counts of all books, not only the ones in view. */
  stats: { total: number; done: number; reading: number };
  lampOn: boolean;
  onToggleLamp: () => void;
};

export default function BookShelf({
  books,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  stats,
  lampOn,
  onToggleLamp,
}: BookShelfProps) {
  const panelId = useId();
  const selected = books.find((book) => book.id === selectedId);
  const listRef = useRef<HTMLUListElement>(null);
  const hadSelection = useRef(false);

  const focusOpenSpine = () =>
    listRef.current?.querySelector<HTMLElement>('[aria-expanded="true"]')?.focus();

  // If the open book disappears (it was deleted), the focus would fall to the
  // page. Put it on the first book instead.
  useEffect(() => {
    if (hadSelection.current && !selected && document.activeElement === document.body) {
      listRef.current?.querySelector<HTMLElement>("button")?.focus();
    }
    hadSelection.current = Boolean(selected);
  }, [selected]);

  return (
    <div>
      <div className="relative wood rounded-t-lg p-2 pb-0 shadow-xl">
        <div className="relative rounded-t-md bg-shelf-back shadow-inner">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 shelf-glow"
          />
          <ShelfLamp on={lampOn} onToggle={onToggleLamp} />
          <ul
            ref={listRef}
            aria-label="Bookshelf"
            className="relative flex flex-wrap content-start gap-x-1 px-2 shelf-boards sm:px-4"
          >
            {books.map((book) => (
              <BookSpine
                key={book.id}
                book={book}
                selected={book.id === selectedId}
                panelId={panelId}
                onSelect={(clicked) =>
                  onSelect(clicked.id === selectedId ? null : clicked.id)
                }
              />
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center rounded-b-lg px-4 py-3 shadow-xl wood">
        <ShelfPlaque {...stats} />
      </div>
      {selected && (
        <BookDetail
          key={selected.id}
          id={panelId}
          book={selected}
          onEdit={onEdit}
          onDelete={onDelete}
          onClose={() => {
            focusOpenSpine();
            onSelect(null);
          }}
        />
      )}
    </div>
  );
}

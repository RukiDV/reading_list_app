import { useId } from "react";

import type { Book } from "../types";
import BookDetail from "./BookDetail";
import BookSpine from "./BookSpine";
import ShelfLamp from "./ShelfLamp";

type BookShelfProps = {
  books: Book[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  lampOn: boolean;
  onToggleLamp: () => void;
};

export default function BookShelf({
  books,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  lampOn,
  onToggleLamp,
}: BookShelfProps) {
  const panelId = useId();
  const selected = books.find((book) => book.id === selectedId);

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
      {selected && (
        <BookDetail
          key={selected.id}
          id={panelId}
          book={selected}
          onEdit={onEdit}
          onDelete={onDelete}
          onClose={() => onSelect(null)}
        />
      )}
    </div>
  );
}

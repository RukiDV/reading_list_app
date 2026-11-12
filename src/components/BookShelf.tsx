import { useId } from "react";

import type { Book } from "../types";
import BookDetail from "./BookDetail";
import BookSpine from "./BookSpine";

type BookShelfProps = {
  books: Book[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
};

export default function BookShelf({
  books,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
}: BookShelfProps) {
  const panelId = useId();
  const selected = books.find((book) => book.id === selectedId);

  return (
    <div>
      <ul
        aria-label="Bookshelf"
        className="flex flex-wrap content-start gap-x-1 rounded-t-lg bg-shelf-back px-4 shelf-boards"
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

import { useState } from "react";
import { toast } from "sonner";

import { filterBooks } from "./books";
import BookFormDialog from "./components/BookFormDialog";
import BookGrid from "./components/BookGrid";
import ConfirmDeleteDialog from "./components/ConfirmDeleteDialog";
import EmptyState from "./components/EmptyState";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import { Toaster } from "./components/ui/sonner";
import type { Book, NewBook, StatusFilter } from "./types";
import { useBooks } from "./useBooks";

type DialogState =
  | { type: "form"; book: Book | null }
  | { type: "delete"; book: Book }
  | null;

export default function App() {
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<DialogState>(null);

  const visibleBooks = filterBooks(books, { status, query });

  function handleSave(data: NewBook) {
    if (dialog?.type !== "form") return;
    if (dialog.book) {
      updateBook(dialog.book.id, data);
      toast("Book updated");
    } else {
      addBook(data);
      toast("Book added");
    }
    setDialog(null);
  }

  function handleDelete() {
    if (dialog?.type !== "delete") return;
    deleteBook(dialog.book.id);
    toast("Book deleted");
    setDialog(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <Header onAdd={() => setDialog({ type: "form", book: null })} />
      <main>
        <Toolbar
          query={query}
          status={status}
          onQueryChange={setQuery}
          onStatusChange={setStatus}
        />
        {visibleBooks.length === 0 ? (
          <EmptyState />
        ) : (
          <BookGrid
            books={visibleBooks}
            onEdit={(book) => setDialog({ type: "form", book })}
            onDelete={(book) => setDialog({ type: "delete", book })}
          />
        )}
      </main>
      {dialog?.type === "form" && (
        <BookFormDialog
          book={dialog.book}
          onSave={handleSave}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.type === "delete" && (
        <ConfirmDeleteDialog
          book={dialog.book}
          onConfirm={handleDelete}
          onClose={() => setDialog(null)}
        />
      )}
      <Toaster />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

import { filterBooks } from "./books";
import BookFormDialog from "./components/BookFormDialog";
import BookGrid from "./components/BookGrid";
import BookShelf from "./components/BookShelf";
import ConfirmDeleteDialog from "./components/ConfirmDeleteDialog";
import EmptyState from "./components/EmptyState";
import Header from "./components/Header";
import Toast from "./components/Toast";
import type { ToastMessage } from "./components/Toast";
import Toolbar from "./components/Toolbar";
import type { ViewMode } from "./components/ViewToggle";
import type { Book, NewBook, StatusFilter } from "./types";
import { useBooks } from "./useBooks";
import { useTheme } from "./useTheme";

type DialogState =
  | { type: "form"; book: Book | null }
  | { type: "delete"; book: Book }
  | null;

const TOAST_DURATION_MS = 3000;

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("shelf");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const nextToastId = useRef(0);

  // A new object for every message, so the timer restarts even for the same text.
  function showToast(text: string) {
    nextToastId.current += 1;
    setToast({ id: nextToastId.current, text });
  }

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const visibleBooks = filterBooks(books, { status, query });

  function handleSave(data: NewBook) {
    if (dialog?.type !== "form") return;
    if (dialog.book) {
      updateBook(dialog.book.id, data);
      showToast("Book updated");
    } else {
      addBook(data);
      showToast("Book added");
    }
    setDialog(null);
  }

  function handleDelete() {
    if (dialog?.type !== "delete") return;
    deleteBook(dialog.book.id);
    showToast("Book deleted");
    setDialog(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <Header theme={theme} onToggleTheme={toggleTheme} onAdd={() => setDialog({ type: "form", book: null })} />
      <main>
        <Toolbar
          query={query}
          status={status}
          view={view}
          onViewChange={setView}
          onQueryChange={setQuery}
          onStatusChange={setStatus}
        />
        {visibleBooks.length === 0 ? (
          <EmptyState />
        ) : view === "shelf" ? (
          <BookShelf
            books={visibleBooks}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onEdit={(book) => setDialog({ type: "form", book })}
            onDelete={(book) => setDialog({ type: "delete", book })}
            lampOn={theme === "dark"}
            onToggleLamp={toggleTheme}
          />
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
      <Toast toast={toast} />
    </div>
  );
}

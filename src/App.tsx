import { useState } from "react";
import { toast } from "sonner";

import { filterBooks } from "./books";
import { pickNextBook } from "./pickBook";
import { sortBooks } from "./sortBooks";
import type { SortKey } from "./sortBooks";
import BookFormDialog from "./components/BookFormDialog";
import BookGrid from "./components/BookGrid";
import BookShelf from "./components/BookShelf";
import ConfirmDeleteDialog from "./components/ConfirmDeleteDialog";
import EmptyState from "./components/EmptyState";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import { Toaster } from "./components/ui/sonner";
import type { ViewMode } from "./components/ViewToggle";
import type { Book, NewBook, StatusFilter } from "./types";
import { useBooks } from "./useBooks";
import { useTheme } from "./useTheme";

type DialogState =
  | { type: "form"; book: Book | null }
  | { type: "delete"; book: Book }
  | null;

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("added");
  const [view, setView] = useState<ViewMode>("shelf");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);

  const visibleBooks = sortBooks(filterBooks(books, { status, query }), sort);
  const stats = {
    total: books.length,
    done: books.filter((book) => book.status === "done").length,
    reading: books.filter((book) => book.status === "reading").length,
  };

  // Pull a random "want to read" book off the shelf. Clear the filters so it
  // is visible.
  function handlePickNext() {
    const pick = pickNextBook(books, selectedId);
    if (!pick) {
      toast("No books on your want-to-read list");
      return;
    }
    setStatus("all");
    setQuery("");
    setView("shelf");
    setSelectedId(pick.id);
  }

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
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onAdd={() => setDialog({ type: "form", book: null })}
      />
      <main>
        <Toolbar
          query={query}
          status={status}
          view={view}
          sort={sort}
          onViewChange={setView}
          onSortChange={setSort}
          onPickNext={handlePickNext}
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
            stats={stats}
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
      <Toaster theme={theme} />
    </div>
  );
}

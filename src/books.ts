import type { Book, Status, StatusFilter } from "./types";

export const STATUS_LABELS: Record<Status, string> = {
  "want-to-read": "Want to read",
  reading: "Reading",
  done: "Done",
};

type Filter = {
  status: StatusFilter;
  query: string;
};

export function filterBooks(books: Book[], { status, query }: Filter): Book[] {
  const normalizedQuery = query.trim().toLowerCase();
  return books.filter(
    (book) =>
      (status === "all" || book.status === status) &&
      book.title.toLowerCase().includes(normalizedQuery)
  );
}

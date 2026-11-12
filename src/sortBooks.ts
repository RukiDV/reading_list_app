import type { Book, Status } from "./types";

export type SortKey = "added" | "title" | "author" | "rating" | "status";

export const SORT_LABELS: Record<SortKey, string> = {
  added: "Newest first",
  title: "Title",
  author: "Author",
  rating: "Rating",
  status: "Status",
};

/** What you are reading comes first, then what is next, then what is done. */
const STATUS_ORDER: Record<Status, number> = {
  reading: 0,
  "want-to-read": 1,
  done: 2,
};

const byText = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });

/** Returns a sorted copy. The sort is stable: equal books keep their order. */
export function sortBooks(books: Book[], key: SortKey): Book[] {
  const copy = [...books];
  switch (key) {
    case "title":
      return copy.sort((a, b) => byText(a.title, b.title));
    case "author":
      return copy.sort((a, b) => byText(a.author, b.author));
    case "rating":
      // Best first, books without a rating last.
      return copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "status":
      return copy.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
    case "added":
      return copy;
  }
}

import type { Book } from "./types";

/**
 * Picks a random book from the "want to read" list. If more than one is left,
 * the book that is already open is not picked again. `random` can be replaced
 * in tests.
 */
export function pickNextBook(
  books: Book[],
  currentId: string | null,
  random: () => number = Math.random
): Book | undefined {
  const wanted = books.filter((book) => book.status === "want-to-read");
  const others = wanted.filter((book) => book.id !== currentId);
  const pool = others.length > 0 ? others : wanted;
  return pool[Math.floor(random() * pool.length)];
}

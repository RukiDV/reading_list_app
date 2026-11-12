import { describe, expect, test } from "vitest";

import { pickNextBook } from "./pickBook";
import { sortBooks } from "./sortBooks";
import type { Book } from "./types";

const book = (id: string, over: Partial<Book>): Book => ({
  id,
  title: id,
  author: "A",
  status: "done",
  rating: null,
  notes: "",
  ...over,
});

describe("sortBooks", () => {
  const books = [
    book("b", { title: "banana", author: "Zed", rating: 3, status: "done" }),
    book("a", { title: "Apple", author: "Amy", rating: null, status: "reading" }),
    book("c", { title: "cherry", author: "Bob", rating: 5, status: "want-to-read" }),
  ];

  test("added keeps the order and never changes the input", () => {
    const input = [...books];
    expect(sortBooks(input, "added").map((b) => b.id)).toEqual(["b", "a", "c"]);
    expect(input).toEqual(books);
  });

  test("title ignores the case", () => {
    expect(sortBooks(books, "title").map((b) => b.id)).toEqual(["a", "b", "c"]);
  });

  test("author", () => {
    expect(sortBooks(books, "author").map((b) => b.id)).toEqual(["a", "c", "b"]);
  });

  test("rating puts the best first and unrated last", () => {
    expect(sortBooks(books, "rating").map((b) => b.id)).toEqual(["c", "b", "a"]);
  });

  test("status puts reading first, then want to read, then done", () => {
    expect(sortBooks(books, "status").map((b) => b.id)).toEqual(["a", "c", "b"]);
  });
});

describe("pickNextBook", () => {
  const list = [
    book("x", { status: "want-to-read" }),
    book("y", { status: "want-to-read" }),
    book("z", { status: "done" }),
  ];

  test("only picks from the want-to-read books", () => {
    expect(pickNextBook(list, null, () => 0.99)?.id).toBe("y");
  });

  test("does not pick the open book again when there is a choice", () => {
    expect(pickNextBook(list, "x", () => 0)?.id).toBe("y");
  });

  test("picks the open book when it is the only one left", () => {
    expect(pickNextBook([list[0], list[2]], "x")?.id).toBe("x");
  });

  test("returns nothing without want-to-read books", () => {
    expect(pickNextBook([list[2]], null)).toBeUndefined();
  });
});

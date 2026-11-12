import { describe, expect, test } from "vitest";

import { filterBooks } from "./books";
import seed from "./seed.json";
import type { Book } from "./types";

const books = seed as Book[];

describe("filterBooks", () => {
  test("returns all books for the status 'all' and an empty query", () => {
    expect(filterBooks(books, { status: "all", query: "" })).toHaveLength(10);
  });

  test("filters by status", () => {
    const result = filterBooks(books, { status: "reading", query: "" });
    expect(result.map((book) => book.title)).toEqual([
      "Neuromancer",
      "Project Hail Mary",
    ]);
  });

  test("finds a title regardless of upper and lower case", () => {
    const result = filterBooks(books, { status: "all", query: "dune" });
    expect(result.map((book) => book.title)).toEqual(["Dune"]);
  });

  test("ignores spaces around the search text", () => {
    expect(filterBooks(books, { status: "all", query: " Dune " })).toHaveLength(
      1
    );
  });

  test("combines status and query", () => {
    expect(filterBooks(books, { status: "done", query: "the" })).toHaveLength(
      2
    );
    expect(filterBooks(books, { status: "reading", query: "dune" })).toEqual(
      []
    );
  });
});

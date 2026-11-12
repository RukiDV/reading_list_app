import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { STORAGE_KEY, useBooks } from "./useBooks";

const newBook = {
  title: "Piranesi",
  author: "Susanna Clarke",
  status: "want-to-read" as const,
  rating: null,
  notes: "",
};

describe("useBooks", () => {
  test("starts with the seed data", () => {
    const { result } = renderHook(() => useBooks());
    expect(result.current.books).toHaveLength(10);
  });

  test("adds a book at the top and gives it an id", () => {
    const { result } = renderHook(() => useBooks());
    act(() => {
      result.current.addBook(newBook);
    });
    expect(result.current.books).toHaveLength(11);
    expect(result.current.books[0]).toMatchObject(newBook);
    expect(result.current.books[0].id).toBeTruthy();
  });

  test("updates only the given fields of one book", () => {
    const { result } = renderHook(() => useBooks());
    act(() => {
      result.current.updateBook("b3", { status: "reading", rating: 4 });
    });
    const book = result.current.books.find((b) => b.id === "b3");
    expect(book).toMatchObject({
      title: "Gone Girl",
      status: "reading",
      rating: 4,
    });
  });

  test("deletes a book", () => {
    const { result } = renderHook(() => useBooks());
    act(() => {
      result.current.deleteBook("b1");
    });
    expect(result.current.books).toHaveLength(9);
    expect(result.current.books.some((b) => b.id === "b1")).toBe(false);
  });

  test("keeps the books after a reload", () => {
    const first = renderHook(() => useBooks());
    act(() => {
      first.result.current.deleteBook("b1");
    });
    first.unmount();

    const second = renderHook(() => useBooks());
    expect(second.result.current.books).toHaveLength(9);
  });

  test("falls back to the seed data when the storage is broken", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    const { result } = renderHook(() => useBooks());
    expect(result.current.books).toHaveLength(10);
  });
});

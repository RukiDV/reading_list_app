import { useEffect, useState } from "react";

import seed from "./seed.json";
import type { Book, NewBook } from "./types";

export const STORAGE_KEY = "reading-list:books";

function loadBooks(): Book[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Book[];
    }
  } catch {
    // Broken or blocked storage: fall back to the seed data.
  }
  return seed as Book[];
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>(loadBooks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  function addBook(newBook: NewBook): Book {
    const book: Book = { ...newBook, id: crypto.randomUUID() };
    setBooks((current) => [book, ...current]);
    return book;
  }

  function updateBook(id: string, changes: Partial<NewBook>) {
    setBooks((current) =>
      current.map((book) => (book.id === id ? { ...book, ...changes } : book))
    );
  }

  function deleteBook(id: string) {
    setBooks((current) => current.filter((book) => book.id !== id));
  }

  return { books, addBook, updateBook, deleteBook };
}

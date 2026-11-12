# Reading List: Specification

This specification describes **what** the app does, not **how** it is built. It does not mention any framework or styling approach. You build the app with different styling approaches today, and in a different framework tomorrow. The spec stays the same.

## Overview

A reading list. The reader keeps track of books and their reading status. The data stays in the browser (`localStorage`), there is no backend.

## Data model

```ts
type Status = "want-to-read" | "reading" | "done";

type Book = {
  id: string;
  title: string;
  author: string;
  status: Status;
  rating: number | null; // 1 to 5, null means "not rated"
  notes: string;
};
```

Labels shown to the reader: `want-to-read` = "Want to read", `reading` = "Reading", `done` = "Done".

## User stories

1. As a reader, I can see all my books as cards with title, author, status and rating.
2. As a reader, I can add a book with title, author, status, rating and notes.
3. As a reader, I can edit a book.
4. As a reader, I can delete a book after I confirmed it.
5. As a reader, I can filter the books by status.
6. As a reader, I can search the books by title.

## Screens and components

```
+--------------------------------------------------------+
|  Reading List                         [ + Add book ]   |  header
+--------------------------------------------------------+
|  [ Search by title...        ]   ( All | Want | ... )  |  toolbar
+--------------------------------------------------------+
|  +----------------+  +----------------+  +-----------+ |
|  | Dune           |  | The Hobbit     |  | ...       | |  book cards
|  | Frank Herbert  |  | J. R. R. Tolk. |  |           | |  (grid)
|  | [Done]  *****  |  | [Done]  ****   |  |           | |
|  | [Edit] [Delete]|  | [Edit] [Delete]|  |           | |
|  +----------------+  +----------------+  +-----------+ |
+--------------------------------------------------------+
```

- **Header** with the app title and the "Add book" button.
- **Toolbar** with a search field and the status filter ("All" plus the three statuses).
- **Book card** with title, author, a status badge, the rating, notes (if any), and the buttons "Edit" and "Delete".
- **Book form dialog**, used for adding and editing: title (required), author (required), status (select), rating (1 to 5 or none), notes (textarea). Buttons "Save" and "Cancel".
- **Delete confirmation dialog** with the book title and the buttons "Delete" and "Cancel".
- **Toast**, a short message after add, edit and delete, for example "Book added".
- **Empty state** with a friendly message when no books match the filter or search.

### Status colors

Use the same meaning in every version. The exact colors are up to the approach.

| Status       | Meaning  | Suggested color |
| ------------ | -------- | --------------- |
| Want to read | Not yet  | blue or gray    |
| Reading      | Ongoing  | yellow or amber |
| Done         | Finished | green           |

## Acceptance criteria

- [ ] All seed books are shown on the first visit.
- [ ] Adding, editing and deleting a book survive a page reload.
- [ ] The form does not save when title or author is empty and shows a message.
- [ ] Add and edit use a dialog. Delete asks for confirmation first.
- [ ] A toast appears after add, edit and delete.
- [ ] The filter and the search work together.
- [ ] The empty state appears when nothing matches.
- [ ] The layout works from 360px to 1280px: one column on small screens, more columns on large screens.
- [ ] Everything can be used with the keyboard only.
- [ ] A dialog opens with focus inside it, can be closed with Escape and returns the focus to the button that opened it.
- [ ] Text and buttons have enough contrast.

## What is already done

You do **not** need to write the logic. It is in the starter and tested:

- `src/useBooks.ts`: `books`, `addBook`, `updateBook`, `deleteBook`, with `localStorage`.
- `src/books.ts`: `filterBooks` and `STATUS_LABELS`.
- `src/types.ts` and `src/seed.json`.

Do not change these files. Build the view layer on top of them.

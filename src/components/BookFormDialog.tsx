import { useState } from "react";
import type { FormEvent } from "react";

import { STATUS_LABELS } from "../books";
import type { Book, NewBook, Status } from "../types";
import Button from "./Button";
import Dialog from "./Dialog";
import Field, { CONTROL_CLASSES } from "./Field";
import TextField from "./TextField";

type BookFormDialogProps = {
  /** The book to edit, or `null` to add a new one. */
  book: Book | null;
  onSave: (book: NewBook) => void;
  onClose: () => void;
};

export default function BookFormDialog({
  book,
  onSave,
  onClose,
}: BookFormDialogProps) {
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [status, setStatus] = useState<Status>(book?.status ?? "want-to-read");
  const [rating, setRating] = useState<number | null>(book?.rating ?? null);
  const [notes, setNotes] = useState(book?.notes ?? "");
  const [submitted, setSubmitted] = useState(false);

  const titleError = !title.trim() ? "Title is required." : undefined;
  const authorError = !author.trim() ? "Author is required." : undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (titleError || authorError) {
      // Move the focus to the first field with an error.
      const firstInvalidId = titleError ? "title" : "author";
      event.currentTarget
        .querySelector<HTMLInputElement>(`#${firstInvalidId}`)
        ?.focus();
      return;
    }
    onSave({
      title: title.trim(),
      author: author.trim(),
      status,
      rating,
      notes: notes.trim(),
    });
  }

  return (
    <Dialog title={book ? "Edit book" : "Add book"} onClose={onClose}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          id="title"
          label="Title"
          value={title}
          error={submitted ? titleError : undefined}
          onChange={setTitle}
        />
        <TextField
          id="author"
          label="Author"
          value={author}
          error={submitted ? authorError : undefined}
          onChange={setAuthor}
        />
        <Field id="status" label="Status">
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as Status)}
            className={CONTROL_CLASSES}
          >
            {(Object.entries(STATUS_LABELS) as [Status, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>
        </Field>
        <Field id="rating" label="Rating">
          <select
            id="rating"
            value={rating ?? ""}
            onChange={(event) =>
              setRating(event.target.value ? Number(event.target.value) : null)
            }
            className={CONTROL_CLASSES}
          >
            <option value="">Not rated</option>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </Field>
        <Field id="notes" label="Notes">
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className={CONTROL_CLASSES}
          />
        </Field>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

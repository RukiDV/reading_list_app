import { useState } from "react";
import type { FormEvent } from "react";

import { STATUS_LABELS } from "@/books";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Book, NewBook, Status } from "@/types";

type BookFormDialogProps = {
  /** The book to edit, or `null` to add a new one. */
  book: Book | null;
  onSave: (book: NewBook) => void;
  onClose: () => void;
};

const NOT_RATED = "none";
const STATUS_ITEMS = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));
const RATING_ITEMS = [
  { value: NOT_RATED, label: "Not rated" },
  ...[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) })),
];

export default function BookFormDialog({
  book,
  onSave,
  onClose,
}: BookFormDialogProps) {
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [status, setStatus] = useState<Status>(book?.status ?? "want-to-read");
  const [rating, setRating] = useState<string>(
    book?.rating ? String(book.rating) : NOT_RATED
  );
  const [notes, setNotes] = useState(book?.notes ?? "");
  const [submitted, setSubmitted] = useState(false);

  const titleError = submitted && !title.trim() ? "Title is required." : undefined;
  const authorError = submitted && !author.trim() ? "Author is required." : undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!title.trim() || !author.trim()) {
      // Move the focus to the first field with an error.
      const firstInvalidId = !title.trim() ? "title" : "author";
      event.currentTarget
        .querySelector<HTMLInputElement>(`#${firstInvalidId}`)
        ?.focus();
      return;
    }
    onSave({
      title: title.trim(),
      author: author.trim(),
      status,
      rating: rating === NOT_RATED ? null : Number(rating),
      notes: notes.trim(),
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{book ? "Edit book" : "Add book"}</DialogTitle>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={Boolean(titleError)}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                value={title}
                aria-invalid={Boolean(titleError)}
                aria-describedby={titleError ? "title-error" : undefined}
                onChange={(event) => setTitle(event.target.value)}
              />
              {titleError && <FieldError id="title-error">{titleError}</FieldError>}
            </Field>
            <Field data-invalid={Boolean(authorError)}>
              <FieldLabel htmlFor="author">Author</FieldLabel>
              <Input
                id="author"
                value={author}
                aria-invalid={Boolean(authorError)}
                aria-describedby={authorError ? "author-error" : undefined}
                onChange={(event) => setAuthor(event.target.value)}
              />
              {authorError && (
                <FieldError id="author-error">{authorError}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select
                items={STATUS_ITEMS}
                value={status}
                onValueChange={(value) => setStatus(value as Status)}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ITEMS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="rating">Rating</FieldLabel>
              <Select
                items={RATING_ITEMS}
                value={rating}
                onValueChange={(value) => setRating(value ?? NOT_RATED)}
              >
                <SelectTrigger id="rating" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RATING_ITEMS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

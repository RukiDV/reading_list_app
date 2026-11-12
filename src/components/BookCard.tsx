import type { Book } from "../types";
import Button from "./Button";
import Card from "./Card";
import Rating from "./Rating";
import StatusBadge from "./StatusBadge";

type BookCardProps = {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
};

export default function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <Card as="li" className="flex flex-col gap-2 p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{book.title}</h2>
      <p className="text-sm text-muted">{book.author}</p>
      <div className="flex items-center justify-between">
        <StatusBadge status={book.status} />
        <Rating rating={book.rating} />
      </div>
      {book.notes && <p className="text-sm text-ink">{book.notes}</p>}
      <div className="mt-auto flex gap-2 pt-2">
        <Button aria-label={`Edit ${book.title}`} onClick={() => onEdit(book)}>
          Edit
        </Button>
        <Button
          variant="danger"
          aria-label={`Delete ${book.title}`}
          onClick={() => onDelete(book)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}

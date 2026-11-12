import type { Book } from "../types";
import Button from "./Button";
import Rating from "./Rating";
import StatusBadge from "./StatusBadge";

type BookCardProps = {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
};

export default function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <li className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold">{book.title}</h2>
      <p className="text-sm text-slate-600">{book.author}</p>
      <div className="flex items-center justify-between">
        <StatusBadge status={book.status} />
        <Rating rating={book.rating} />
      </div>
      {book.notes && <p className="text-sm text-slate-700">{book.notes}</p>}
      <div className="mt-auto flex gap-2 pt-2">
        <Button onClick={() => onEdit(book)}>
          Edit<span className="sr-only">: {book.title}</span>
        </Button>
        <Button variant="danger" onClick={() => onDelete(book)}>
          Delete<span className="sr-only">: {book.title}</span>
        </Button>
      </div>
    </li>
  );
}

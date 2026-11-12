import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Book } from "@/types";
import Rating from "./Rating";
import StatusBadge from "./StatusBadge";

type BookCardProps = {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
};

export default function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <li className="flex">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <h2 className="text-base font-semibold">{book.title}</h2>
          </CardTitle>
          <CardDescription>{book.author}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <StatusBadge status={book.status} />
            <Rating rating={book.rating} />
          </div>
          {book.notes && <p className="text-sm">{book.notes}</p>}
        </CardContent>
        <CardFooter className="mt-auto gap-2">
          <Button
            variant="outline"
            aria-label={`Edit ${book.title}`}
            onClick={() => onEdit(book)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            aria-label={`Delete ${book.title}`}
            onClick={() => onDelete(book)}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
    </li>
  );
}

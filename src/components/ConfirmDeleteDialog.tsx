import type { Book } from "../types";
import Button from "./Button";
import Dialog from "./Dialog";

type ConfirmDeleteDialogProps = {
  book: Book;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDeleteDialog({
  book,
  onConfirm,
  onClose,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog title="Delete book" onClose={onClose}>
      <p>
        Do you really want to delete <strong>{book.title}</strong>?
      </p>
      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Dialog>
  );
}

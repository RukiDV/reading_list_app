import Card from "./Card";

export default function EmptyState() {
  return (
    <Card className="p-8 text-center">
      <p className="text-lg font-semibold">No books found</p>
      <p className="text-sm text-muted">
        Try another search or filter, or add a new book.
      </p>
    </Card>
  );
}

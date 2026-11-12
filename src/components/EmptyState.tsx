export default function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed p-12 text-center">
      <p className="text-lg font-semibold">No books found</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Try another search or filter, or add a new book.
      </p>
    </div>
  );
}

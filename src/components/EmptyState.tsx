export default function EmptyState() {
  return (
    <div className="rounded-lg bg-white p-8 text-center ring-1 ring-slate-200">
      <p className="text-lg font-semibold">No books found</p>
      <p className="text-sm text-slate-600">
        Try another search or filter, or add a new book.
      </p>
    </div>
  );
}

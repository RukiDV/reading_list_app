type ToastProps = { message: string | null };

/** The live region is always rendered so screen readers announce new messages. */
export default function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-4 flex justify-center px-4"
    >
      {message && (
        <p className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          {message}
        </p>
      )}
    </div>
  );
}

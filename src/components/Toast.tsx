export type ToastMessage = { id: number; text: string };

type ToastProps = { toast: ToastMessage | null };

/** The live region is always rendered so screen readers announce new messages. */
export default function Toast({ toast }: ToastProps) {
  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-4 flex justify-center px-4"
    >
      {toast && (
        // The key makes a repeated message a new element: it is announced again.
        <p
          key={toast.id}
          className="rounded-md bg-ink px-4 py-2 text-sm text-surface shadow-lg"
        >
          {toast.text}
        </p>
      )}
    </div>
  );
}

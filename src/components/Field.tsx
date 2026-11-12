import type { ReactNode } from "react";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

/** Shared classes for inputs, selects and textareas. */
export const CONTROL_CLASSES =
  "w-full rounded-md bg-surface px-3 py-2 text-sm ring-1 ring-inset ring-line-strong";

export default function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger-700">
          {error}
        </p>
      )}
    </div>
  );
}

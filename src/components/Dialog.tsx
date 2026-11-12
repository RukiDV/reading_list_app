import { useId, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";

type DialogProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Modal dialog on the native <dialog> element. The browser traps the focus,
 * closes on Escape and returns the focus to the button that opened it.
 * Mount it to open it, unmount it to close it.
 */
export default function Dialog({ title, onClose, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const onCloseRef = useRef(onClose);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      // React StrictMode runs this effect twice in development. The `close`
      // event of the first, cleaned-up run arrives after the dialog was
      // opened again, so ignore it while the dialog is open.
      if (!dialog.open) onCloseRef.current();
    };
    dialog.addEventListener("close", handleClose);
    dialog.showModal();
    return () => {
      dialog.removeEventListener("close", handleClose);
      // Closing before the node is removed lets the browser restore the focus.
      dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto w-full max-w-md rounded-lg p-0 backdrop:bg-ink/50"
    >
      <div className="flex flex-col gap-4 p-6">
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}

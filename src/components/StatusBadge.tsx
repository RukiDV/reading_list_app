import { STATUS_LABELS } from "../books";
import type { Status } from "../types";

type StatusBadgeProps = { status: Status };

const STATUS_CLASSES: Record<Status, string> = {
  "want-to-read": "bg-status-want-bg text-status-want-fg",
  reading: "bg-status-reading-bg text-status-reading-fg",
  done: "bg-status-done-bg text-status-done-fg",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

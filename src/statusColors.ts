import type { Status } from "./types";

/** Solid colors for book spines and covers, taken from the status tokens. */
export const STATUS_SOLID_CLASSES: Record<Status, string> = {
  "want-to-read": "bg-status-want-fg",
  reading: "bg-status-reading-fg",
  done: "bg-status-done-fg",
};

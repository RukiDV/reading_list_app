import type { Status } from "./types";

/** Solid colors for book spines and covers, the same in light and dark mode. */
export const STATUS_SOLID_CLASSES: Record<Status, string> = {
  "want-to-read": "bg-spine-want",
  reading: "bg-spine-reading",
  done: "bg-spine-done",
};

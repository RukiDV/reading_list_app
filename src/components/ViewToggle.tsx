import Button from "./Button";

export type ViewMode = "shelf" | "cards";

type ViewToggleProps = {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
};

const VIEWS: { value: ViewMode; label: string }[] = [
  { value: "shelf", label: "Shelf" },
  { value: "cards", label: "Cards" },
];

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div role="group" aria-label="View" className="flex gap-2">
      {VIEWS.map(({ value, label }) => (
        <Button
          key={value}
          variant={view === value ? "primary" : "secondary"}
          aria-pressed={view === value}
          onClick={() => onViewChange(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

import type { Theme } from "../useTheme";
import Button from "./Button";

type ThemeToggleProps = {
  theme: Theme;
  onToggle: () => void;
};

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <Button aria-pressed={theme === "dark"} onClick={onToggle}>
      Dark mode
    </Button>
  );
}

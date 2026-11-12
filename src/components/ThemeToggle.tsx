import type { Theme } from "../useTheme";
import { Button } from "@/components/ui/button";

type ThemeToggleProps = {
  theme: Theme;
  onToggle: () => void;
};

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <Button variant="outline" aria-pressed={theme === "dark"} onClick={onToggle}>
      Dark mode
    </Button>
  );
}

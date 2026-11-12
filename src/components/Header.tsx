import { Button } from "@/components/ui/button";
import type { Theme } from "../useTheme";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  theme: Theme;
  onToggleTheme: () => void;
  onAdd: () => void;
};

export default function Header({ theme, onToggleTheme, onAdd }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 py-4">
      <h1 className="text-2xl font-bold">Reading List</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <Button onClick={onAdd}>+ Add book</Button>
      </div>
    </header>
  );
}

import { Button } from "@/components/ui/button";

type HeaderProps = { onAdd: () => void };

export default function Header({ onAdd }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 py-4">
      <h1 className="text-2xl font-bold">Reading List</h1>
      <Button onClick={onAdd}>+ Add book</Button>
    </header>
  );
}

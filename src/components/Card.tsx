import type { ReactNode } from "react";

type CardProps = {
  as?: "div" | "li";
  className?: string;
  children: ReactNode;
};

export default function Card({
  as: Tag = "div",
  className = "",
  children,
}: CardProps) {
  return (
    <Tag className={`rounded-lg bg-surface ring-1 ring-line ${className}`}>
      {children}
    </Tag>
  );
}

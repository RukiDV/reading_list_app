import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-brand-600 text-on-accent hover:bg-brand-700",
  secondary:
    "bg-surface text-ink ring-1 ring-inset ring-line-strong hover:bg-surface-hover",
  danger: "bg-danger-600 text-on-accent hover:bg-danger-700",
};

export default function Button({
  variant = "secondary",
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    />
  );
}

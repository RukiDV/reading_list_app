/** A little pendant lamp that hangs from the top of the shelf. Decoration only. */
export default function ShelfLamp() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 72"
      className="pointer-events-none absolute top-0 right-10 h-14 w-10 origin-top motion-safe:animate-sway"
    >
      <line x1="24" y1="0" x2="24" y2="22" className="stroke-wood-dark" strokeWidth="2" />
      <path d="M10 52 L18 22 H30 L38 52 Z" className="fill-wood-dark" />
      <path d="M10 52 L18 22 H30 L38 52 Z" className="fill-gold/25" />
      <ellipse cx="24" cy="54" rx="14" ry="4" className="fill-lamp" />
      <ellipse cx="24" cy="62" rx="8" ry="5" className="fill-lamp/60" />
    </svg>
  );
}

type ShelfLampProps = {
  /** The lamp is on in dark mode. */
  on: boolean;
  onToggle: () => void;
};

/** A pendant lamp on the shelf. Pull it to switch between light and dark mode. */
export default function ShelfLamp({ on, onToggle }: ShelfLampProps) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label="Lamp"
      title={on ? "Switch the lamp off" : "Switch the lamp on"}
      onClick={onToggle}
      className="absolute top-0 right-10 z-10 group h-16 w-10 origin-top cursor-pointer rounded-b-lg motion-safe:animate-sway"
    >
      <svg aria-hidden="true" viewBox="0 0 48 76" className="h-full w-full">
        <line x1="24" y1="0" x2="24" y2="22" className="stroke-wood-dark" strokeWidth="2" />
        <path d="M10 52 L18 22 H30 L38 52 Z" className="fill-wood-dark" />
        <path d="M10 52 L18 22 H30 L38 52 Z" className="fill-gold/25" />
        <ellipse
          cx="24"
          cy="54"
          rx="14"
          ry="4"
          className={on ? "fill-lamp" : "fill-wood-light"}
        />
        {on && <ellipse cx="24" cy="62" rx="8" ry="5" className="fill-lamp/60" />}
        {/* The pull cord moves down while the lamp is pressed. */}
        <g className="motion-safe:transition-transform motion-safe:duration-150 group-active:translate-y-2">
          <line x1="38" y1="52" x2="38" y2="68" className="stroke-gold" strokeWidth="1.5" />
          <circle cx="38" cy="70" r="3" className="fill-gold" />
        </g>
      </svg>
    </button>
  );
}

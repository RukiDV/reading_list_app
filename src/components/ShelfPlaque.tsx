type ShelfPlaqueProps = {
  total: number;
  done: number;
  reading: number;
};

/** A brass plaque on the base of the shelf with the reading progress. */
export default function ShelfPlaque({ total, done, reading }: ShelfPlaqueProps) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1 rounded-sm border border-gold/60 bg-wood-dark px-4 py-2 text-center text-sm text-gold">
      <p>
        {done} of {total} books done
        {reading > 0 && <span> · {reading} reading</span>}
      </p>
      <progress
        aria-label="Books done"
        max={total}
        value={done}
        className="h-1.5 w-full appearance-none overflow-hidden rounded-full [&::-moz-progress-bar]:bg-gold [&::-webkit-progress-bar]:bg-wood [&::-webkit-progress-value]:bg-gold"
      />
    </div>
  );
}

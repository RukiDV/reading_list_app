type RatingProps = { rating: number | null };

const MAX_STARS = 5;

export default function Rating({ rating }: RatingProps) {
  if (rating === null) {
    return <span className="text-sm text-slate-600">Not rated</span>;
  }
  return (
    <span
      role="img"
      aria-label={`Rating: ${rating} out of ${MAX_STARS}`}
      className="text-amber-600"
    >
      {"★".repeat(rating)}
      <span className="text-slate-300">{"★".repeat(MAX_STARS - rating)}</span>
    </span>
  );
}

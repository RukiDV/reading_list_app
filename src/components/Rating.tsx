type RatingProps = { rating: number | null };

const MAX_STARS = 5;

export default function Rating({ rating }: RatingProps) {
  if (rating === null) {
    return <span className="text-sm text-muted-foreground">Not rated</span>;
  }
  return (
    <span
      role="img"
      aria-label={`Rating: ${rating} out of ${MAX_STARS}`}
      className="text-star"
    >
      {"★".repeat(rating)}
      <span className="text-star-empty">{"★".repeat(MAX_STARS - rating)}</span>
    </span>
  );
}

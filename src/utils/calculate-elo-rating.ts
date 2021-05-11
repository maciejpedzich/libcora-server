export default function calculateEloRating(
  currentUserRating: number,
  potentialMatchRating: number,
  score: number
) {
  const K_FACTOR =
    potentialMatchRating > 2400
      ? 16
      : potentialMatchRating < 2400 && potentialMatchRating > 2100
      ? 24
      : 32;

  const expectedMatchScore =
    1 / (1 + 10 ** ((currentUserRating - potentialMatchRating) / 400));

  const updatedMatchRating =
    potentialMatchRating + K_FACTOR * (score - expectedMatchScore);

  return updatedMatchRating;
}

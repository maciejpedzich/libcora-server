export default function calculateEloRating(
  currentUserRating: number,
  potentialMatchRating: number,
  score: number
) {
  const K_FACTOR =
    potentialMatchRating > 2000
      ? 16
      : potentialMatchRating < 2000 && potentialMatchRating > 1500
      ? 24
      : 32;

  const expectedMatchScore =
    1 / (1 + 10 ** ((currentUserRating - potentialMatchRating) / 400));

  const updatedMatchRating =
    potentialMatchRating + K_FACTOR * (score - expectedMatchScore);

  return updatedMatchRating;
}

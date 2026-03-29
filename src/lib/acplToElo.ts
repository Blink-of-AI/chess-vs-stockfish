/**
 * Maps Average Centipawn Loss (ACPL) to an estimated ELO range.
 * Based on empirical data from online chess analysis tools.
 */
const TABLE: Array<[acpl: number, elo: number]> = [
  [5,   2600],
  [10,  2400],
  [18,  2200],
  [28,  2000],
  [42,  1800],
  [62,  1600],
  [90,  1400],
  [130, 1200],
  [185, 1000],
  [260, 800],
];

export function acplToElo(acpl: number): number {
  if (acpl <= TABLE[0][0]) return TABLE[0][1];
  if (acpl >= TABLE[TABLE.length - 1][0]) return TABLE[TABLE.length - 1][1];

  for (let i = 0; i < TABLE.length - 1; i++) {
    const [a1, e1] = TABLE[i];
    const [a2, e2] = TABLE[i + 1];
    if (acpl >= a1 && acpl <= a2) {
      const t = (acpl - a1) / (a2 - a1);
      return Math.round(e1 + t * (e2 - e1));
    }
  }
  return 800;
}

export function eloToLabel(elo: number): string {
  if (elo >= 2400) return 'Grandmaster';
  if (elo >= 2200) return 'International Master';
  if (elo >= 2000) return 'FIDE Master';
  if (elo >= 1800) return 'Expert';
  if (elo >= 1600) return 'Advanced';
  if (elo >= 1400) return 'Intermediate';
  if (elo >= 1200) return 'Club Player';
  if (elo >= 1000) return 'Casual';
  return 'Beginner';
}

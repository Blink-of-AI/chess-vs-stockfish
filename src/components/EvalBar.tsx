'use client';

interface EvalBarProps {
  /** Score in centipawns from White's perspective. null = unknown. */
  score: number | null;
  flipped: boolean;
}

/** Convert raw centipawn score to a 0–100 percentage for white's share. */
function scoreToPercent(score: number): number {
  // Use a sigmoid so extreme scores compress toward 100/0
  // cp clamped to ±1500 before mapping
  const clamped = Math.max(-1500, Math.min(1500, score));
  return 50 + (50 * clamped) / (Math.abs(clamped) + 300);
}

function formatValue(score: number): string {
  if (Math.abs(score) >= 10000) {
    const moves = Math.abs(Math.abs(score) - 10000);
    return moves > 0 ? `M${moves}` : 'M';
  }
  return (Math.abs(score) / 100).toFixed(1);
}

export default function EvalBar({ score, flipped }: EvalBarProps) {
  // whitePercent: how much of the bar belongs to white (top when not flipped)
  const whitePercent = score === null ? 50 : scoreToPercent(score);
  // When board is flipped (player is black), bar visually flips too
  const topPercent = flipped ? whitePercent : 100 - whitePercent;
  const bottomPercent = 100 - topPercent;

  // Top segment color: when flipped, top = white side
  const topColor = flipped ? '#F0D9B5' : '#1a1a1a';
  const bottomColor = flipped ? '#1a1a1a' : '#F0D9B5';

  // Determine which side is winning and by how much
  const whiteWinning = (score ?? 0) > 0;
  const equal = score === null || score === 0;
  const value = score === null ? null : formatValue(score);

  // Top segment is winning when: flipped+whiteWinning OR !flipped+!whiteWinning
  const topIsWinning = flipped ? whiteWinning : !whiteWinning;

  // Only show a label if the segment is tall enough to fit it
  const TOP_MIN = 12;
  const BOT_MIN = 12;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 22,
        height: 'clamp(280px, 56vmin, 560px)',
        borderRadius: 3,
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        border: '1px solid #111',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
      }}
    >
      {/* Top segment */}
      <div
        style={{
          height: `${topPercent}%`,
          background: topColor,
          transition: 'height 0.4s ease',
          position: 'relative',
          minHeight: 0,
        }}
      >
        {value !== null && topPercent >= TOP_MIN && (
          <span
            style={{
              position: 'absolute',
              bottom: 2,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.55rem',
              fontWeight: 700,
              color: topColor === '#F0D9B5' ? '#1a1a1a' : '#F0D9B5',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.02em',
            }}
          >
            {equal ? '=' : topIsWinning ? `+${value}` : `-${value}`}
          </span>
        )}
      </div>

      {/* Bottom segment */}
      <div
        style={{
          height: `${bottomPercent}%`,
          background: bottomColor,
          transition: 'height 0.4s ease',
          position: 'relative',
          minHeight: 0,
        }}
      >
        {value !== null && bottomPercent >= BOT_MIN && (
          <span
            style={{
              position: 'absolute',
              top: 2,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.55rem',
              fontWeight: 700,
              color: bottomColor === '#F0D9B5' ? '#1a1a1a' : '#F0D9B5',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.02em',
            }}
          >
            {equal ? '=' : topIsWinning ? `-${value}` : `+${value}`}
          </span>
        )}
      </div>
    </div>
  );
}

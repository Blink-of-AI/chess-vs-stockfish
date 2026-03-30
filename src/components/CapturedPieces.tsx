import type { Color, PieceType } from '@/types';

const PIECE_VALUES: Record<string, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9,
};

const UNICODE: Record<string, string> = {
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};

// Sort by value descending
function sortPieces(pieces: string[]): string[] {
  return [...pieces].sort((a, b) => (PIECE_VALUES[b] ?? 0) - (PIECE_VALUES[a] ?? 0));
}

interface Props {
  pieces: string[];
  color: Color; // color of the pieces being displayed (the captured pieces belong to this color)
}

export default function CapturedPieces({ pieces, color }: Props) {
  const sorted = sortPieces(pieces);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        gap: 1,
        alignItems: 'center',
        overflow: 'hidden',
        maxWidth: 200,
        height: 20,
      }}
    >
      {sorted.map((p, i) => (
        <span
          key={i}
          style={{
            fontSize: '0.9rem',
            lineHeight: 1,
            color: color === 'w' ? '#FFFFFF' : '#1A1208',
            textShadow:
              color === 'w'
                ? '0 1px 2px rgba(0,0,0,0.8)'
                : '0 1px 1px rgba(255,255,255,0.2)',
            opacity: 0.85,
            userSelect: 'none',
          }}
          title={p.toUpperCase()}
        >
          {UNICODE[p] ?? p}
        </span>
      ))}
    </div>
  );
}

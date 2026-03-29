import type { PieceType, Color } from '@/types';

const UNICODE: Record<PieceType, string> = {
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
};

interface PieceProps {
  type: PieceType;
  color: Color;
}

export default function Piece({ type, color }: PieceProps) {
  return (
    <span
      style={{
        fontSize: 'clamp(22px, 5vmin, 48px)',
        lineHeight: 1,
        display: 'block',
        userSelect: 'none',
        color: color === 'w' ? '#FFFFFF' : '#1A1208',
        textShadow:
          color === 'w'
            ? '0 1px 3px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.7)'
            : '0 1px 2px rgba(255,255,255,0.3)',
        filter:
          color === 'w'
            ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))'
            : 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
        zIndex: 1,
        position: 'relative',
      }}
      aria-label={`${color === 'w' ? 'White' : 'Black'} ${type}`}
    >
      {UNICODE[type]}
    </span>
  );
}

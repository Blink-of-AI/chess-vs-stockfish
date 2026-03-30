'use client';
import type { PieceType, Color } from '@/types';

interface PieceProps {
  type: PieceType;
  color: Color;
}

// cburnett color scheme (Lichess default)
const W_FILL   = '#ffffff';
const B_FILL   = '#000000';
const STROKE   = '#000000';
const W_DETAIL = '#000000';
const B_DETAIL = '#ffffff';

function PawnSVG({ color }: { color: Color }) {
  const fill   = color === 'w' ? W_FILL : B_FILL;
  const detail = color === 'w' ? W_DETAIL : B_DETAIL;
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C16.83 16.5 15.5 18.59 15.5 21c0 2.03.94 3.84 2.41 5.03L16.5 27.5h12l-1.41-1.47C28.56 24.84 29.5 23.03 29.5 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
        fill={fill} stroke={STROKE} strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d="M15 32.75h15v-5.25H15z"
        fill={fill} stroke={STROKE} strokeWidth="1.5" strokeLinejoin="miter"
      />
      <path
        d="M11.5 37c0-2.31 1.77-4.25 4-4.25h14c2.23 0 4 1.94 4 4.25H11.5z"
        fill={fill} stroke={STROKE} strokeWidth="1.5"
      />
      {color === 'b' && (
        <path
          d="M17.5 26h10M15 30h15"
          fill="none" stroke={detail} strokeWidth="1" strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function RookSVG({ color }: { color: Color }) {
  const fill   = color === 'w' ? W_FILL : B_FILL;
  const detail = color === 'w' ? W_DETAIL : B_DETAIL;
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M9 39h27v-3H9zM12 36V32h21v4zM11 14V9h4v2h5V9h5v2h5V9h4v5z"
        fill={fill} stroke={STROKE} strokeWidth="1.5" strokeLinejoin="round"
      />
      <path
        d="M34 14l-3 3H14l-3-3z"
        fill={fill} stroke={STROKE} strokeWidth="1.5" strokeLinejoin="round"
      />
      <path
        d="M31 17v15H14V17z"
        fill={fill} stroke={STROKE} strokeWidth="1.5"
      />
      <path
        d="M14 17h17M14 20.5h17M14 24h17"
        fill="none" stroke={detail} strokeWidth="1" strokeLinecap="round"
      />
    </svg>
  );
}

function KnightSVG({ color }: { color: Color }) {
  const fill   = color === 'w' ? W_FILL : B_FILL;
  const detail = color === 'w' ? W_DETAIL : B_DETAIL;
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-11.5 8-25"
        fill={fill} stroke={STROKE} strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"
        fill={fill} stroke={STROKE} strokeWidth="1.5" strokeLinecap="round"
      />
      <circle cx="17" cy="23" r="1.5" fill={detail} />
      <path
        d="M14.5 30.5l1.5-2 1.5 1"
        fill="none" stroke={detail} strokeWidth="1" strokeLinecap="round"
      />
    </svg>
  );
}

function BishopSVG({ color }: { color: Color }) {
  const fill   = color === 'w' ? W_FILL : B_FILL;
  const detail = color === 'w' ? W_DETAIL : B_DETAIL;
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.8.96-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.2.46-2.32.47-3-.5 1.35-1.46 3-2 3-2z"
        fill={fill} stroke={STROKE} strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"
        fill={fill} stroke={STROKE} strokeWidth="1.5" strokeLinecap="round"
      />
      <circle cx="22.5" cy="8" r="2.5" fill={fill} stroke={STROKE} strokeWidth="1.5" />
      <path
        d="M17.5 26h10M15 30h15M22.5 15.5v5M20 18h5"
        fill="none" stroke={detail} strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  );
}

function QueenSVG({ color }: { color: Color }) {
  const fill   = color === 'w' ? W_FILL : B_FILL;
  const detail = color === 'w' ? W_DETAIL : B_DETAIL;
  const ballFill = color === 'w' ? W_FILL : B_DETAIL;
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <circle cx="6"    cy="12" r="2.75" fill={fill} stroke={STROKE} strokeWidth="1.5" />
      <circle cx="14"   cy="9"  r="2.75" fill={fill} stroke={STROKE} strokeWidth="1.5" />
      <circle cx="22.5" cy="8"  r="2.75" fill={fill} stroke={STROKE} strokeWidth="1.5" />
      <circle cx="31"   cy="9"  r="2.75" fill={fill} stroke={STROKE} strokeWidth="1.5" />
      <circle cx="39"   cy="12" r="2.75" fill={fill} stroke={STROKE} strokeWidth="1.5" />
      <path
        d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1L22.5 24.5 14.3 10.9 14 25 6.5 13.5z"
        fill={fill} stroke={STROKE} strokeWidth="1.5" strokeLinecap="butt"
      />
      <path
        d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1 2.5-1 2.5-1.5 1.5.5 2.5.5 2.5 6 2 16 2 22 0 0 0 2-1-.5-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"
        fill={fill} stroke={STROKE} strokeWidth="1.5" strokeLinecap="butt"
      />
      <path d="M11.5 30c3.5-1 20.5-1 22 0"  fill="none" stroke={detail} strokeWidth="1" />
      <path d="M12 33.5c4-1.5 17-1.5 21 0"  fill="none" stroke={detail} strokeWidth="1" />
      <path d="M11.5 37c4-2 18-2 22 0"       fill="none" stroke={detail} strokeWidth="1" />
      {color === 'b' && (
        <>
          <circle cx="6"    cy="12" r="1.5" fill={ballFill} />
          <circle cx="14"   cy="9"  r="1.5" fill={ballFill} />
          <circle cx="22.5" cy="8"  r="1.5" fill={ballFill} />
          <circle cx="31"   cy="9"  r="1.5" fill={ballFill} />
          <circle cx="39"   cy="12" r="1.5" fill={ballFill} />
        </>
      )}
    </svg>
  );
}

function KingSVG({ color }: { color: Color }) {
  const fill   = color === 'w' ? W_FILL : B_FILL;
  const detail = color === 'w' ? W_DETAIL : B_DETAIL;
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M22.5 11.63V6M20 8h5"
        fill="none" stroke={color === 'w' ? STROKE : B_DETAIL} strokeWidth="1.5" strokeLinejoin="miter"
      />
      <path
        d="M22.5 25c0 0 4.5-7.5 3-10.5 0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5z"
        fill={fill} stroke={STROKE} strokeWidth="1.5" strokeLinejoin="miter"
      />
      <path
        d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4v3.5v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z"
        fill={fill} stroke={STROKE} strokeWidth="1.5" strokeLinecap="butt"
      />
      <path d="M11.5 30c5.5-3 15.5-3 21 0"  fill="none" stroke={detail} strokeWidth="1.5" />
      <path d="M11.5 33.5c5.5-3 15.5-3 21 0" fill="none" stroke={detail} strokeWidth="1.5" />
      <path d="M11.5 37c5.5-3 15.5-3 21 0"   fill="none" stroke={detail} strokeWidth="1.5" />
    </svg>
  );
}

const PIECE_COMPONENTS: Record<PieceType, React.ComponentType<{ color: Color }>> = {
  p: PawnSVG,
  r: RookSVG,
  n: KnightSVG,
  b: BishopSVG,
  q: QueenSVG,
  k: KingSVG,
};

export default function Piece({ type, color }: PieceProps) {
  const PieceSVG = PIECE_COMPONENTS[type];
  return (
    <div
      style={{
        width: 'clamp(30px, 6vmin, 56px)',
        height: 'clamp(30px, 6vmin, 56px)',
        userSelect: 'none',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
        zIndex: 1,
        position: 'relative',
      }}
      aria-label={`${color === 'w' ? 'White' : 'Black'} ${type}`}
    >
      <PieceSVG color={color} />
    </div>
  );
}

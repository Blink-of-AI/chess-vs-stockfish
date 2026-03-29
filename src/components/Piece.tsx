'use client';
import type { PieceType, Color } from '@/types';

interface PieceProps {
  type: PieceType;
  color: Color;
}

const S = '#000';

function Defs({ id, color }: { id: string; color: Color }) {
  return color === 'w' ? (
    <defs>
      <radialGradient id={id} cx="38%" cy="32%" r="62%">
        <stop offset="0%" stopColor="#fffdf0" />
        <stop offset="48%" stopColor="#ede1c2" />
        <stop offset="100%" stopColor="#c4a04e" />
      </radialGradient>
      <radialGradient id={id + 'd'} cx="38%" cy="32%" r="62%">
        <stop offset="0%" stopColor="#e8dbb0" />
        <stop offset="100%" stopColor="#a07828" />
      </radialGradient>
    </defs>
  ) : (
    <defs>
      <radialGradient id={id} cx="38%" cy="32%" r="62%">
        <stop offset="0%" stopColor="#7a5535" />
        <stop offset="48%" stopColor="#3a1c08" />
        <stop offset="100%" stopColor="#0a0300" />
      </radialGradient>
      <radialGradient id={id + 'd'} cx="38%" cy="32%" r="62%">
        <stop offset="0%" stopColor="#8a6a48" />
        <stop offset="100%" stopColor="#1a0a02" />
      </radialGradient>
    </defs>
  );
}

function f(id: string) { return `url(#${id})`; }
function ds(color: Color) { return color === 'w' ? '#a07828' : '#8a6a48'; }

function PawnSVG({ color }: { color: Color }) {
  const id = `p${color}`;
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <Defs id={id} color={color} />
      <path d="M 22,9 C 19.79,9 18,10.79 18,13 C 18,13.89 18.29,14.71 18.78,15.38 C 16.83,16.5 15.5,18.59 15.5,21 C 15.5,23.03 16.44,24.84 17.91,26.03 L 16.5,27.5 L 28.5,27.5 L 27.09,26.03 C 28.56,24.84 29.5,23.03 29.5,21 C 29.5,18.59 28.17,16.5 26.22,15.38 C 26.71,14.71 27,13.89 27,13 C 27,10.79 25.21,9 23,9 Z" fill={f(id)} stroke={S} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M 15,32.75 L 30,32.75 L 30,27.5 L 15,27.5 Z" fill={f(id)} stroke={S} strokeWidth="1.5" strokeLinejoin="miter"/>
      <path d="M 11.5,37 C 11.5,34.69 13.27,32.75 15.5,32.75 L 29.5,32.75 C 31.73,32.75 33.5,34.69 33.5,37 L 11.5,37 Z" fill={f(id)} stroke={S} strokeWidth="1.5"/>
    </svg>
  );
}

function RookSVG({ color }: { color: Color }) {
  const id = `r${color}`;
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <Defs id={id} color={color} />
      <path d="M 9,39 L 36,39 L 36,36 L 9,36 Z" fill={f(id)} stroke={S} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M 12,36 L 12,32 L 33,32 L 33,36 Z" fill={f(id)} stroke={S} strokeWidth="1.5"/>
      <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 Z" fill={f(id)} stroke={S} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M 34,14 L 31,17 L 14,17 L 11,14 Z" fill={f(id)} stroke={S} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M 31,17 L 31,32 L 14,32 L 14,17 Z" fill={f(id)} stroke={S} strokeWidth="1.5"/>
    </svg>
  );
}

function KnightSVG({ color }: { color: Color }) {
  const id = `n${color}`;
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <Defs id={id} color={color} />
      <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill={f(id)} stroke={S} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" fill={f(id)} stroke={S} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="17" cy="23" r="1.5" fill={ds(color)}/>
      <path d="M 14,30 L 14,32 L 16,31" stroke={ds(color)} strokeWidth="0.5" fill="none"/>
    </svg>
  );
}

function BishopSVG({ color }: { color: Color }) {
  const id = `b${color}`;
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <Defs id={id} color={color} />
      <g fill={f(id)} stroke={S} strokeWidth="1.5" strokeLinecap="round">
        <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.2,38.96 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.8,38.96 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 Z"/>
        <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 Z"/>
        <path d="M 25,8 A 2.5,2.5 0 1 1 20,8 A 2.5,2.5 0 1 1 25,8 Z"/>
      </g>
      <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" fill="none" stroke={ds(color)} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function QueenSVG({ color }: { color: Color }) {
  const id = `q${color}`;
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <Defs id={id} color={color} />
      <g fill={f(id)} stroke={S} strokeWidth="1.5">
        <circle cx="6" cy="12" r="2.75"/>
        <circle cx="14" cy="9" r="2.75"/>
        <circle cx="22.5" cy="8" r="2.75"/>
        <circle cx="31" cy="9" r="2.75"/>
        <circle cx="39" cy="12" r="2.75"/>
        <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 22.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 Z" strokeLinecap="butt"/>
        <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11.5,38.5 11.5,38.5 C 17.5,40.5 27.5,40.5 33.5,38.5 C 33.5,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 Z"/>
        <path d="M 11.5,30 C 15,29 30,29 33.5,30" fill="none" stroke={ds(color)}/>
        <path d="M 12,33.5 C 18,32.5 27,32.5 33,33.5" fill="none" stroke={ds(color)}/>
      </g>
    </svg>
  );
}

function KingSVG({ color }: { color: Color }) {
  const id = `k${color}`;
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <Defs id={id} color={color} />
      <g fill={f(id)} stroke={S} strokeWidth="1.5">
        <path d="M 22.5,11.63 L 22.5,6" strokeLinejoin="miter"/>
        <path d="M 20,8 L 25,8" strokeLinejoin="miter"/>
        <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25 Z"/>
        <path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,30 Z"/>
        <path d="M 11.5,30 C 17,27 27,27 32.5,30" stroke={ds(color)} fill="none"/>
        <path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5" stroke={ds(color)} fill="none"/>
        <path d="M 11.5,37 C 17,34 27,34 32.5,37" stroke={ds(color)} fill="none"/>
      </g>
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
        filter:
          color === 'w'
            ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))'
            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
        zIndex: 1,
        position: 'relative',
      }}
      aria-label={`${color === 'w' ? 'White' : 'Black'} ${type}`}
    >
      <PieceSVG color={color} />
    </div>
  );
}

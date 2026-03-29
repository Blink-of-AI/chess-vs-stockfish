'use client';
import type { Color } from '@/types';
import Piece from './Piece';

interface Props {
  color: Color;
  onSelect: (piece: string) => void;
}

const PIECES = ['q', 'r', 'b', 'n'] as const;
const LABELS: Record<string, string> = {
  q: 'Queen',
  r: 'Rook',
  b: 'Bishop',
  n: 'Knight',
};

export default function PromotionModal({ color, onSelect }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 8,
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          boxShadow: '0 16px 60px rgba(0,0,0,0.9)',
          border: '1px solid var(--surface-2)',
        }}
      >
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          Promote pawn
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          {PIECES.map(p => (
            <button
              key={p}
              onClick={() => onSelect(p)}
              title={LABELS[p]}
              style={{
                width: 76,
                height: 76,
                background: 'var(--surface-2)',
                border: '2px solid transparent',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                transition: 'border-color 0.15s, background 0.15s, transform 0.1s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'var(--accent-dim)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.background = 'var(--surface-2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Piece type={p} color={color} />
              <span
                style={{
                  fontSize: '0.6rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                {LABELS[p]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

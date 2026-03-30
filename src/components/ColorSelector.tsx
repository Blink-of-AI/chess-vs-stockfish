'use client';
import type { Color } from '@/types';

interface Props {
  onSelect: (color: Color) => void;
  stockfishReady: boolean;
  stockfishError?: string | null;
}

export default function ColorSelector({ onSelect, stockfishReady, stockfishError }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '40px',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: 'var(--text)',
            letterSpacing: '-0.03em',
            marginBottom: 8,
            lineHeight: 1,
          }}
        >
          Chess
        </h1>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          vs AI
        </p>
      </div>

      {/* Board preview decoration */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          width: 64,
          height: 64,
          borderRadius: 4,
          overflow: 'hidden',
          opacity: 0.6,
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(i => (
          <div
            key={i}
            style={{
              background:
                (Math.floor(i / 4) + (i % 4)) % 2 === 0
                  ? 'var(--board-light)'
                  : 'var(--board-dark)',
            }}
          />
        ))}
      </div>

      {!stockfishReady ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {stockfishError ? (
            <p style={{ color: '#EF4444', fontSize: '0.85rem', textAlign: 'center', maxWidth: 280 }}>
              {stockfishError}
            </p>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: 'pulse 1.5s infinite',
                }}
              />
              Loading AI engine…
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Choose your color
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            {/* White button */}
            <button
              onClick={() => onSelect('w')}
              style={{
                padding: '14px 28px',
                background: 'var(--board-light)',
                color: '#3a2a10',
                border: '1px solid #c8a87a',
                borderRadius: 4,
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.03em',
                transition: 'transform 0.1s, box-shadow 0.1s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>♔</span>
              White
            </button>

            {/* Black button */}
            <button
              onClick={() => onSelect('b')}
              style={{
                padding: '14px 28px',
                background: 'var(--board-dark)',
                color: '#f0d9b5',
                border: '1px solid #8c6030',
                borderRadius: 4,
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.03em',
                transition: 'transform 0.1s, box-shadow 0.1s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>♚</span>
              Black
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

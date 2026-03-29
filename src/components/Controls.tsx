'use client';
import type React from 'react';

interface Props {
  phase: string;
  drawOfferState: string;
  onResign: () => void;
  onOfferDraw: () => void;
  onNewGame: () => void;
}

export default function Controls({ phase, drawOfferState, onResign, onOfferDraw, onNewGame }: Props) {
  const isPlaying = phase === 'playing' || phase === 'thinking';
  const canAct = phase === 'playing';

  const btnBase: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: 3,
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.04em',
    border: 'none',
    transition: 'opacity 0.15s, transform 0.1s',
    outline: 'none',
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        minWidth: 'clamp(280px, 56vmin, 560px)',
        justifyContent: 'flex-end',
        marginTop: 4,
      }}
    >
      {isPlaying && (
        <>
          <button
            onClick={onOfferDraw}
            disabled={!canAct || drawOfferState !== 'idle'}
            style={{
              ...btnBase,
              background: 'var(--surface-2)',
              color: 'var(--text)',
              opacity: !canAct || drawOfferState !== 'idle' ? 0.4 : 1,
              cursor: !canAct || drawOfferState !== 'idle' ? 'not-allowed' : 'pointer',
            }}
            title="Offer draw"
          >
            ½&nbsp;Draw
          </button>
          <button
            onClick={onResign}
            disabled={!canAct}
            style={{
              ...btnBase,
              background: 'var(--surface-2)',
              color: '#EF4444',
              opacity: !canAct ? 0.4 : 1,
              cursor: !canAct ? 'not-allowed' : 'pointer',
            }}
            title="Resign"
          >
            ⚑&nbsp;Resign
          </button>
        </>
      )}

      {phase === 'game-over' && (
        <button
          onClick={onNewGame}
          style={{
            ...btnBase,
            background: 'var(--accent)',
            color: '#1A1208',
            padding: '10px 28px',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(200,169,81,0.3)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(200,169,81,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(200,169,81,0.3)';
          }}
        >
          New Game
        </button>
      )}
    </div>
  );
}

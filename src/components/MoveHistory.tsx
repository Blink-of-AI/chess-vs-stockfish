'use client';
import { useEffect, useRef } from 'react';
import type { Move } from 'chess.js';
import type { Color } from '@/types';

interface Props {
  history: Move[];
  playerColor: Color;
}

export default function MoveHistory({ history, playerColor }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest move
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history.length]);

  const pairs: [Move, Move | null][] = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push([history[i], history[i + 1] ?? null]);
  }

  // Last move index for highlighting
  const lastMoveIndex = history.length - 1;

  return (
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: 6,
        padding: 16,
        maxHeight: 'clamp(200px, 56vmin, 560px)',
        overflowY: 'auto',
        border: '1px solid var(--surface-2)',
      }}
    >
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.68rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        Moves
      </p>

      {pairs.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', opacity: 0.6 }}>
          Game in progress…
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '28px 1fr 1fr',
            gap: '2px 8px',
            alignItems: 'center',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '0.82rem',
          }}
        >
          {pairs.map(([white, black], i) => {
            const whiteIndex = i * 2;
            const blackIndex = i * 2 + 1;
            const isWhiteLast = whiteIndex === lastMoveIndex;
            const isBlackLast = blackIndex === lastMoveIndex;

            return [
              <span key={`n-${i}`} style={{ color: 'var(--text-muted)', textAlign: 'right', fontSize: '0.75rem' }}>
                {i + 1}.
              </span>,
              <span
                key={`w-${i}`}
                style={{
                  color: isWhiteLast ? 'var(--accent)' : 'var(--text)',
                  fontWeight: isWhiteLast ? 700 : 400,
                  padding: '2px 4px',
                  borderRadius: 2,
                  background: isWhiteLast ? 'rgba(200,169,81,0.1)' : 'transparent',
                  transition: 'background 0.2s',
                }}
              >
                {white.san}
              </span>,
              <span
                key={`b-${i}`}
                style={{
                  color: isBlackLast ? 'var(--accent)' : black ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: isBlackLast ? 700 : 400,
                  padding: '2px 4px',
                  borderRadius: 2,
                  background: isBlackLast ? 'rgba(200,169,81,0.1)' : 'transparent',
                  transition: 'background 0.2s',
                }}
              >
                {black?.san ?? ''}
              </span>,
            ];
          })}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

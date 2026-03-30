'use client';
import { useEffect, useState } from 'react';

interface GameRecord {
  id: number;
  played_at: string;
  player_color: string;
  result: string;
  end_reason: string;
  move_count: number;
}

const REASON_LABEL: Record<string, string> = {
  checkmate: 'Checkmate',
  stalemate: 'Stalemate',
  'draw-insufficient': 'Insufficient material',
  'draw-repetition': 'Repetition',
  'draw-fifty-moves': '50-move rule',
  'draw-agreement': 'Draw agreed',
  resignation: 'Resignation',
};

function resultLabel(record: GameRecord): { text: string; color: string } {
  const playerColor = record.player_color === 'w' ? 'w' : 'b';
  if (record.result === 'draw') return { text: '½–½', color: 'var(--text-muted)' };
  if (record.result === playerColor) return { text: 'Win', color: '#4ade80' };
  return { text: 'Loss', color: '#f87171' };
}

export default function GameHistory() {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/games')
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setGames(data.games ?? []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: 6,
        padding: '14px 16px',
        minWidth: 0,
        height: 220,
        overflowY: 'auto',
      }}
    >
      <h2
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        Recent Games
      </h2>

      {loading && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Loading…</p>
      )}

      {error && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic' }}>
          History unavailable
        </p>
      )}

      {!loading && !error && games.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No games yet.</p>
      )}

      {!loading && !error && games.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {games.map(g => {
            const { text: resultText, color: resultColor } = resultLabel(g);
            const date = new Date(g.played_at).toLocaleDateString(undefined, {
              month: 'short', day: 'numeric',
            });
            return (
              <div
                key={g.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 8px',
                  background: 'var(--surface-2)',
                  borderRadius: 4,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: resultColor,
                      }}
                    >
                      {resultText}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      {g.player_color === 'w' ? 'White' : 'Black'} · {g.move_count} moves
                    </span>
                  </div>
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.7rem',
                      marginTop: 1,
                    }}
                  >
                    {REASON_LABEL[g.end_reason] ?? g.end_reason}
                  </div>
                </div>
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.7rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {date}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';
import { acplToElo, eloToLabel } from '@/lib/acplToElo';

interface EloResultProps {
  acpl: number | null;
  analysisProgress: { done: number; total: number } | null;
}

export default function EloResult({ acpl, analysisProgress }: EloResultProps) {
  const isAnalysing = analysisProgress !== null && acpl === null;

  return (
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: 6,
        padding: '14px 16px',
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
        Performance Rating
      </h2>

      {isAnalysing && analysisProgress && (
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: 8,
            }}
          >
            Analysing moves… {analysisProgress.done}/{analysisProgress.total}
          </div>
          {/* Progress bar */}
          <div
            style={{
              height: 4,
              background: 'var(--surface-2)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(analysisProgress.done / analysisProgress.total) * 100}%`,
                background: 'var(--accent)',
                transition: 'width 0.3s ease',
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      )}

      {acpl !== null && (() => {
        const elo = acplToElo(acpl);
        const label = eloToLabel(elo);
        // colour based on level
        const color =
          elo >= 2200 ? '#f59e0b'
          : elo >= 1800 ? '#34d399'
          : elo >= 1400 ? '#60a5fa'
          : 'var(--text-muted)';

        return (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                {elo}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                estimated
              </span>
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
              }}
            >
              Avg. centipawn loss: {acpl}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

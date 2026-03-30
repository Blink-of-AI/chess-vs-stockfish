'use client';

export interface DifficultyLevel {
  id: number;
  name: string;
  elo: number;
  skill: number;
  movetime: number;
}

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { id: 1, name: 'Novice',       elo: 500,  skill: 0,  movetime: 200  },
  { id: 2, name: 'Beginner',     elo: 1000, skill: 4,  movetime: 500  },
  { id: 3, name: 'Intermediate', elo: 1500, skill: 8,  movetime: 1000 },
  { id: 4, name: 'Advanced',     elo: 2000, skill: 14, movetime: 1500 },
  { id: 5, name: 'Master',       elo: 3200, skill: 20, movetime: 3000 },
];

interface Props {
  value: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
}

export default function DifficultySelector({ value, onChange }: Props) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: 6,
        padding: '14px 16px',
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
          marginBottom: 10,
        }}
      >
        Difficulty
      </p>
      <select
        value={value.id}
        onChange={e => {
          const level = DIFFICULTY_LEVELS.find(l => l.id === Number(e.target.value));
          if (level) onChange(level);
        }}
        style={{
          width: '100%',
          background: 'var(--surface-2)',
          color: 'var(--text)',
          border: 'none',
          borderRadius: 3,
          padding: '7px 10px',
          fontSize: '0.82rem',
          fontWeight: 600,
          cursor: 'pointer',
          outline: 'none',
          fontFamily: 'inherit',
        }}
      >
        {DIFFICULTY_LEVELS.map(level => (
          <option key={level.id} value={level.id}>
            {level.name} — ~{level.elo} ELO
          </option>
        ))}
      </select>
    </div>
  );
}

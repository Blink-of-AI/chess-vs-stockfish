'use client';
import { useEffect, useState } from 'react';
import type { Color } from '@/types';

interface Props {
  onSelect: (color: Color, username: string) => void;
  stockfishReady: boolean;
  stockfishError?: string | null;
}

export default function ColorSelector({ onSelect, stockfishReady, stockfishError }: Props) {
  const [username, setUsername] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    fetch('/api/username')
      .then(r => r.json())
      .then(data => {
        if (data.username) setUsername(data.username);
      })
      .catch(() => {});
  }, []);

  function handleSelect(color: Color) {
    const name = username.trim();
    if (name) {
      fetch('/api/username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name }),
      }).catch(() => {});
    }
    onSelect(color, name);
  }

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
            color: 'var(--accent)',
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
              Loading engine…
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          {/* Username input */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <label
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Your name
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Anonymous"
              maxLength={50}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${inputFocused ? 'var(--accent)' : 'var(--text-muted)'}`,
                color: 'var(--text)',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '4px 2px',
                width: 180,
                textAlign: 'center',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit',
              }}
            />
          </div>

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
              onClick={() => handleSelect('w')}
              style={{
                padding: '14px 28px',
                background: 'var(--board-light)',
                color: '#1A1208',
                border: 'none',
                borderRadius: 4,
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.03em',
                transition: 'transform 0.1s, box-shadow 0.1s',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.5)';
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>♔</span>
              White
            </button>

            {/* Black button */}
            <button
              onClick={() => handleSelect('b')}
              style={{
                padding: '14px 28px',
                background: '#1A1208',
                color: 'var(--board-light)',
                border: '2px solid var(--board-dark)',
                borderRadius: 4,
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.03em',
                transition: 'transform 0.1s, box-shadow 0.1s',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.5)';
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

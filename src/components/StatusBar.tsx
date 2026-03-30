import type { ChessGameState } from '@/hooks/useChessGame';

interface Props {
  state: ChessGameState;
}

const REASON_LABELS: Record<string, string> = {
  checkmate: 'Checkmate',
  stalemate: 'Stalemate',
  'draw-insufficient': 'Insufficient material',
  'draw-repetition': 'Threefold repetition',
  'draw-fifty-moves': '50-move rule',
  'draw-agreement': 'Draw by agreement',
  resignation: 'Resignation',
};

export default function StatusBar({ state }: Props) {
  const { phase, turn, playerColor, inCheck, result, drawOfferState } = state;

  let message = '';
  let textColor = 'var(--text-muted)';
  let showPulse = false;

  if (phase === 'game-over' && result) {
    const reason = REASON_LABELS[result.reason] || result.reason;
    if (result.winner === 'draw') {
      message = `Draw — ${reason}`;
      textColor = 'var(--accent)';
    } else if (result.winner === playerColor) {
      message = `You win! — ${reason}`;
      textColor = '#22C55E';
    } else {
      message = `AI wins — ${reason}`;
      textColor = '#EF4444';
    }
  } else if (drawOfferState === 'pending') {
    message = 'Evaluating draw offer…';
    showPulse = true;
  } else if (drawOfferState === 'declined') {
    message = 'AI declines the draw';
    textColor = '#EF4444';
  } else if (phase === 'thinking') {
    message = 'AI is thinking…';
    showPulse = true;
  } else if (inCheck) {
    message = 'Check!';
    textColor = '#EF4444';
  } else if (phase === 'playing') {
    message = turn === playerColor ? 'Your turn' : "AI's turn";
    textColor = turn === playerColor ? 'var(--text)' : 'var(--text-muted)';
  } else if (phase === 'promotion') {
    message = 'Choose promotion piece';
    textColor = 'var(--accent)';
  }

  return (
    <div
      style={{
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.82rem',
        fontWeight: 600,
        color: textColor,
        letterSpacing: '0.02em',
        minWidth: 'clamp(280px, 56vmin, 560px)',
        gap: 8,
        transition: 'color 0.3s',
      }}
    >
      {showPulse && (
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'currentColor',
            animation: 'pulse 1.5s infinite',
          }}
        />
      )}
      {message}
    </div>
  );
}

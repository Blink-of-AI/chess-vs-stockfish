'use client';
import { useEffect, useCallback, useState } from 'react';
import { useChessGame } from '@/hooks/useChessGame';
import { useStockfish } from '@/hooks/useStockfish';
import Board from '@/components/Board';
import ColorSelector from '@/components/ColorSelector';
import Controls from '@/components/Controls';
import MoveHistory from '@/components/MoveHistory';
import PromotionModal from '@/components/PromotionModal';
import StatusBar from '@/components/StatusBar';
import CapturedPieces from '@/components/CapturedPieces';
import EvalBar from '@/components/EvalBar';
import type { Color } from '@/types';

export default function Home() {
  const game = useChessGame();
  const { ready, getBestMove, evaluatePosition } = useStockfish();
  const { state } = game;
  const [evalScore, setEvalScore] = useState<number | null>(null);

  // Trigger computer move when it's the engine's turn
  useEffect(() => {
    if (state.phase !== 'thinking' || !ready || !state.playerColor) return;
    getBestMove(state.fen, (move) => {
      game.makeComputerMove(move);
    }, 1500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.fen, ready]);

  // Update eval bar after each move (runs on player's turn so it doesn't compete with getBestMove)
  useEffect(() => {
    if (state.phase !== 'playing' || !ready) return;
    evaluatePosition(state.fen, setEvalScore, setEvalScore);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.fen, ready]);

  // Clear eval on game over
  useEffect(() => {
    if (state.phase === 'game-over') setEvalScore(null);
  }, [state.phase]);

  const handleDrawOffer = useCallback(() => {
    if (game.canClaimDraw()) {
      game.acceptDraw();
      return;
    }
    game.setDrawOfferPending();
    evaluatePosition(state.fen, (score) => {
      // score is from white's perspective (centipawns)
      const computerColor: Color = state.playerColor === 'w' ? 'b' : 'w';
      const scoreForComputer = computerColor === 'w' ? score : -score;
      if (scoreForComputer <= 100) {
        game.acceptDraw();
      } else {
        game.declineDraw();
      }
    });
  }, [state.fen, state.playerColor, game, evaluatePosition]);

  if (state.phase === 'color-selection') {
    return <ColorSelector onSelect={game.startGame} stockfishReady={ready} />;
  }

  const isPlayerTurn = state.phase === 'playing' && state.turn === state.playerColor;
  const flipped = state.playerColor === 'b';

  // Opponent's captured pieces shown above board (from player's POV)
  const capturedByPlayer = state.playerColor === 'w' ? state.capturedByWhite : state.capturedByBlack;
  const capturedByOpponent = state.playerColor === 'w' ? state.capturedByBlack : state.capturedByWhite;
  const opponentColor: Color = state.playerColor === 'w' ? 'b' : 'w';
  const playerColorSafe = state.playerColor ?? 'w';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '16px',
        gap: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          width: '100%',
          maxWidth: '900px',
        }}
      >
        {/* Eval bar + Board column */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch', flexShrink: 0 }}>
          {/* Eval bar */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 0 }}>
            {/* Spacer to align bar with board (skip the opponent info + status bar rows) */}
            <div style={{ height: 'calc(0.75rem * 1.5 + 6px + 1.1rem * 1.5 + 6px)' }} />
            <EvalBar score={evalScore} flipped={flipped} />
          </div>

          {/* Board column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            {/* Opponent info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 'clamp(280px, 56vmin, 560px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  Stockfish 16
                </span>
                {state.phase === 'thinking' && (
                  <span style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="thinking-dot"
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: 'var(--accent)',
                          display: 'inline-block',
                        }}
                      />
                    ))}
                  </span>
                )}
              </div>
              <CapturedPieces pieces={capturedByOpponent} color={opponentColor} />
            </div>

            <StatusBar state={state} />

            <Board
              fen={state.fen}
              selectedSquare={state.selectedSquare}
              legalMoves={state.legalMoves}
              lastMove={state.lastMove}
              inCheck={state.inCheck}
              playerColor={playerColorSafe}
              flipped={flipped}
              interactive={isPlayerTurn}
              onSquareClick={game.selectSquare}
            />

            {/* Player info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 'clamp(280px, 56vmin, 560px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  You ({state.playerColor === 'w' ? 'White' : 'Black'})
                </span>
              </div>
              <CapturedPieces pieces={capturedByPlayer} color={playerColorSafe} />
            </div>

            <Controls
              phase={state.phase}
              drawOfferState={state.drawOfferState}
              onResign={game.resign}
              onOfferDraw={handleDrawOffer}
              onNewGame={game.newGame}
            />
          </div>
        </div>

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minWidth: 0 }}>
          <MoveHistory history={state.history} playerColor={playerColorSafe} />
        </div>
      </div>

      {state.phase === 'promotion' && state.promotionPending && (
        <PromotionModal
          color={playerColorSafe}
          onSelect={game.completePromotion}
        />
      )}
    </div>
  );
}

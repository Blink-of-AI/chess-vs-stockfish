'use client';
import { useEffect, useCallback, useRef, useState } from 'react';
import { useChessGame } from '@/hooks/useChessGame';
import { useStockfish } from '@/hooks/useStockfish';
import Board from '@/components/Board';
import ColorSelector from '@/components/ColorSelector';
import Controls from '@/components/Controls';
import MoveHistory from '@/components/MoveHistory';
import PromotionModal from '@/components/PromotionModal';
import StatusBar from '@/components/StatusBar';
import CapturedPieces from '@/components/CapturedPieces';
import GameHistory from '@/components/GameHistory';
import EvalBar from '@/components/EvalBar';
import type { Color } from '@/types';

export default function Home() {
  const game = useChessGame();
  const { ready, error: stockfishError, getBestMove, evaluatePosition } = useStockfish();
  const { state } = game;
  const savedGameRef = useRef<string | null>(null);
  const [evalScore, setEvalScore] = useState<number | null>(null);
  const evalFenRef = useRef<string | null>(null);
  const [username, setUsername] = useState('');

  // Trigger computer move when it's the engine's turn
  useEffect(() => {
    if (state.phase !== 'thinking' || !ready || !state.playerColor) return;
    getBestMove(state.fen, (move) => {
      game.makeComputerMove(move);
    }, 1500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.fen, ready]);

  // Evaluate position when Stockfish is idle (player's turn or game over)
  useEffect(() => {
    if (state.phase === 'color-selection') {
      setEvalScore(null);
      evalFenRef.current = null;
      return;
    }
    const isActive = state.phase === 'playing' || state.phase === 'game-over';
    if (!isActive || !ready || !state.playerColor) return;
    if (evalFenRef.current === state.fen) return;
    evalFenRef.current = state.fen;
    const turn = state.turn;
    evaluatePosition(state.fen, (score) => {
      // Stockfish reports score from the side-to-move perspective.
      // Normalize to white's perspective for the EvalBar.
      setEvalScore(turn === 'b' ? -score : score);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.fen, state.phase, ready]);

  // Save completed game to NeonDB
  useEffect(() => {
    if (state.phase !== 'game-over' || !state.result || !state.playerColor) return;
    const gameKey = `${state.fen}-${state.result.reason}`;
    if (savedGameRef.current === gameKey) return;
    savedGameRef.current = gameKey;

    fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerColor: state.playerColor,
        result: state.result.winner,
        endReason: state.result.reason,
        moves: state.history.map(m => m.san).join(' '),
        moveCount: state.history.length,
        username: username || null,
      }),
    }).catch(() => {
      // Non-critical — silently ignore save failures
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return <ColorSelector onSelect={(color, name) => { setUsername(name); game.startGame(color); }} stockfishReady={ready} stockfishError={stockfishError} />;
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
        minHeight: '100vh',
        padding: '32px 16px',
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
        {/* Board column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {/* Opponent info */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 'clamp(280px, 56vmin, 560px)', height: 28, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                AI
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <EvalBar score={evalScore} flipped={flipped} />
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
              onMovePiece={game.movePiece}
            />
          </div>

          {/* Player info */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 'clamp(280px, 56vmin, 560px)', height: 28, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {username || 'You'} ({state.playerColor === 'w' ? 'White' : 'Black'})
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

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minWidth: 0 }}>
          <MoveHistory history={state.history} playerColor={playerColorSafe} />
          <GameHistory />
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

import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import type { Square, Move } from 'chess.js';
import type { Color, GamePhase, GameResult, EndReason } from '@/types';

export interface ChessGameState {
  fen: string;
  turn: Color;
  phase: GamePhase;
  playerColor: Color | null;
  selectedSquare: Square | null;
  legalMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  result: GameResult | null;
  inCheck: boolean;
  history: Move[];
  promotionPending: { from: Square; to: Square } | null;
  capturedByWhite: string[];
  capturedByBlack: string[];
  drawOfferState: 'idle' | 'pending' | 'declined';
}

function checkGameStatus(game: Chess): GameResult | null {
  if (game.isCheckmate()) return { winner: game.turn() === 'w' ? 'b' : 'w', reason: 'checkmate' };
  if (game.isStalemate()) return { winner: 'draw', reason: 'stalemate' };
  if (game.isInsufficientMaterial()) return { winner: 'draw', reason: 'draw-insufficient' };
  if (game.isThreefoldRepetition()) return { winner: 'draw', reason: 'draw-repetition' };
  if (game.isDraw()) return { winner: 'draw', reason: 'draw-fifty-moves' };
  return null;
}

function getCaptured(game: Chess): { byWhite: string[]; byBlack: string[] } {
  const byWhite: string[] = [];
  const byBlack: string[] = [];
  for (const move of game.history({ verbose: true })) {
    if (move.captured) {
      if (move.color === 'w') byWhite.push(move.captured);
      else byBlack.push(move.captured);
    }
  }
  return { byWhite, byBlack };
}

const makeInitialState = (chess: Chess): ChessGameState => ({
  fen: chess.fen(),
  turn: 'w',
  phase: 'color-selection',
  playerColor: null,
  selectedSquare: null,
  legalMoves: [],
  lastMove: null,
  result: null,
  inCheck: false,
  history: [],
  promotionPending: null,
  capturedByWhite: [],
  capturedByBlack: [],
  drawOfferState: 'idle',
});

export function useChessGame() {
  const [chess] = useState(() => new Chess());
  const [state, setState] = useState<ChessGameState>(() => makeInitialState(chess));

  const startGame = useCallback((color: Color) => {
    chess.reset();
    setState({
      ...makeInitialState(chess),
      phase: color === 'b' ? 'thinking' : 'playing',
      playerColor: color,
    });
  }, [chess]);

  const selectSquare = useCallback((square: Square) => {
    setState(prev => {
      if (prev.phase !== 'playing') return prev;
      if (prev.turn !== prev.playerColor) return prev;

      const piece = chess.get(square);
      const { selectedSquare } = prev;

      if (selectedSquare) {
        const moves = chess.moves({ square: selectedSquare, verbose: true });
        const targetMove = moves.find(m => m.to === square);

        if (targetMove) {
          // Check if promotion
          if (targetMove.flags.includes('p')) {
            return { ...prev, promotionPending: { from: selectedSquare, to: square }, phase: 'promotion' };
          }
          // Make move
          const result = chess.move({ from: selectedSquare, to: square });
          if (!result) return prev;
          const gameResult = checkGameStatus(chess);
          const { byWhite, byBlack } = getCaptured(chess);
          return {
            ...prev,
            fen: chess.fen(),
            turn: chess.turn() as Color,
            phase: gameResult ? 'game-over' : 'thinking',
            selectedSquare: null,
            legalMoves: [],
            lastMove: { from: selectedSquare, to: square },
            result: gameResult,
            inCheck: chess.inCheck(),
            history: chess.history({ verbose: true }),
            capturedByWhite: byWhite,
            capturedByBlack: byBlack,
          };
        }

        // Click on own piece => reselect
        if (piece && piece.color === prev.playerColor) {
          const legalMoves = chess.moves({ square, verbose: true }).map(m => m.to as Square);
          return { ...prev, selectedSquare: square, legalMoves };
        }
        // Deselect
        return { ...prev, selectedSquare: null, legalMoves: [] };
      }

      // No square selected yet
      if (piece && piece.color === prev.playerColor) {
        const legalMoves = chess.moves({ square, verbose: true }).map(m => m.to as Square);
        return { ...prev, selectedSquare: square, legalMoves };
      }
      return prev;
    });
  }, [chess]);

  const completePromotion = useCallback((promotionPiece: string) => {
    setState(prev => {
      if (!prev.promotionPending) return prev;
      const { from, to } = prev.promotionPending;
      const result = chess.move({ from, to, promotion: promotionPiece as 'q' | 'r' | 'b' | 'n' });
      if (!result) return prev;
      const gameResult = checkGameStatus(chess);
      const { byWhite, byBlack } = getCaptured(chess);
      return {
        ...prev,
        fen: chess.fen(),
        turn: chess.turn() as Color,
        phase: gameResult ? 'game-over' : 'thinking',
        selectedSquare: null,
        legalMoves: [],
        lastMove: { from, to },
        result: gameResult,
        inCheck: chess.inCheck(),
        history: chess.history({ verbose: true }),
        promotionPending: null,
        capturedByWhite: byWhite,
        capturedByBlack: byBlack,
      };
    });
  }, [chess]);

  const makeComputerMove = useCallback((uciMove: string) => {
    const from = uciMove.slice(0, 2) as Square;
    const to = uciMove.slice(2, 4) as Square;
    const promotion = uciMove.length > 4 ? uciMove[4] : undefined;
    setState(prev => {
      try {
        chess.move({ from, to, promotion: promotion as 'q' | 'r' | 'b' | 'n' | undefined });
      } catch {
        return { ...prev, phase: 'playing' };
      }
      const gameResult = checkGameStatus(chess);
      const { byWhite, byBlack } = getCaptured(chess);
      return {
        ...prev,
        fen: chess.fen(),
        turn: chess.turn() as Color,
        phase: gameResult ? 'game-over' : 'playing',
        lastMove: { from, to },
        result: gameResult,
        inCheck: chess.inCheck(),
        history: chess.history({ verbose: true }),
        capturedByWhite: byWhite,
        capturedByBlack: byBlack,
      };
    });
  }, [chess]);

  const resign = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'playing' && prev.phase !== 'thinking') return prev;
      return {
        ...prev,
        phase: 'game-over',
        result: { winner: prev.playerColor === 'w' ? 'b' : 'w', reason: 'resignation' },
      };
    });
  }, []);

  const canClaimDraw = useCallback((): boolean => {
    return chess.isDraw() || chess.isStalemate() || chess.isInsufficientMaterial() || chess.isThreefoldRepetition();
  }, [chess]);

  const acceptDraw = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'game-over',
      result: { winner: 'draw', reason: 'draw-agreement' },
      drawOfferState: 'idle',
    }));
  }, []);

  const declineDraw = useCallback(() => {
    setState(prev => ({ ...prev, drawOfferState: 'declined' }));
    setTimeout(() => {
      setState(prev => ({ ...prev, drawOfferState: 'idle' }));
    }, 3000);
  }, []);

  const setDrawOfferPending = useCallback(() => {
    setState(prev => ({ ...prev, drawOfferState: 'pending' }));
  }, []);

  const newGame = useCallback(() => {
    chess.reset();
    setState(makeInitialState(chess));
  }, [chess]);

  return {
    state,
    startGame,
    selectSquare,
    completePromotion,
    makeComputerMove,
    resign,
    canClaimDraw,
    acceptDraw,
    declineDraw,
    setDrawOfferPending,
    newGame,
    chess,
  };
}

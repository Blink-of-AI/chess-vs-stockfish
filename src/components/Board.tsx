'use client';
import type { Square } from 'chess.js';
import { Chess } from 'chess.js';
import type { Color, PieceType } from '@/types';
import Piece from './Piece';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

interface BoardProps {
  fen: string;
  selectedSquare: Square | null;
  legalMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  inCheck: boolean;
  playerColor: Color;
  flipped: boolean;
  interactive: boolean;
  onSquareClick: (sq: Square) => void;
}

export default function Board({
  fen,
  selectedSquare,
  legalMoves,
  lastMove,
  inCheck,
  playerColor,
  flipped,
  interactive,
  onSquareClick,
}: BoardProps) {
  const chess = new Chess(fen);

  const files = flipped ? [...FILES].reverse() : FILES;
  const ranks = flipped ? [...RANKS].reverse() : RANKS;

  // Find king square for check highlight
  let kingSquare: string | null = null;
  if (inCheck) {
    const turn = chess.turn();
    for (const sq of chess.board().flat()) {
      if (sq && sq.type === 'k' && sq.color === turn) {
        kingSquare = sq.square;
        break;
      }
    }
  }

  return (
    <div
      className="relative select-none"
      style={{
        boxShadow: '0 8px 40px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)',
        border: '3px solid #1a1a1a',
        borderRadius: 2,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          width: 'clamp(280px, 56vmin, 560px)',
          height: 'clamp(280px, 56vmin, 560px)',
        }}
      >
        {ranks.map((rank, ri) =>
          files.map((file, fi) => {
            const sq = `${file}${rank}` as Square;
            const fileIndex = FILES.indexOf(file);
            const rankIndex = RANKS.indexOf(rank);
            const isLight = (fileIndex + rankIndex) % 2 === 0;
            const piece = chess.get(sq);
            const isSelected = selectedSquare === sq;
            const isLegalMove = legalMoves.includes(sq);
            const isLastMove = lastMove && (lastMove.from === sq || lastMove.to === sq);
            const isKingInCheck = kingSquare === sq;

            const bg = isLight ? 'var(--board-light)' : 'var(--board-dark)';

            return (
              <div
                key={sq}
                onClick={() => interactive && onSquareClick(sq)}
                style={{
                  background: bg,
                  position: 'relative',
                  cursor:
                    interactive && (piece?.color === playerColor || isLegalMove)
                      ? 'pointer'
                      : 'default',
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Last move highlight */}
                {isLastMove && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'var(--highlight-last)',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Selected square highlight */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'var(--highlight-select)',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* King in check highlight */}
                {isKingInCheck && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'var(--highlight-check)',
                      pointerEvents: 'none',
                      borderRadius: '50%',
                    }}
                  />
                )}

                {/* Legal move dot (empty square) */}
                {isLegalMove && !piece && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '30%',
                      height: '30%',
                      borderRadius: '50%',
                      background: 'var(--dot-color)',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Legal move ring (capture square) */}
                {isLegalMove && piece && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      boxShadow: 'inset 0 0 0 4px rgba(0,0,0,0.25)',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Piece */}
                {piece && <Piece type={piece.type as PieceType} color={piece.color as Color} />}

                {/* Rank label (left edge) */}
                {fi === 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      left: 3,
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      lineHeight: 1,
                      color: isLight ? 'var(--board-dark)' : 'var(--board-light)',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {rank}
                  </span>
                )}

                {/* File label (bottom row) */}
                {ri === 7 && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      right: 3,
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      lineHeight: 1,
                      color: isLight ? 'var(--board-dark)' : 'var(--board-light)',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {file}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
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
  onMovePiece: (from: Square, to: Square) => void;
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
  onMovePiece,
}: BoardProps) {
  const chess = new Chess(fen);

  const [dragSource, setDragSource] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

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
        border: '20px solid #3d1f0d',
        background: 'linear-gradient(135deg, #5c2d0a 0%, #3d1f0d 40%, #2d1508 100%)',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5), 0 8px 40px rgba(0,0,0,0.8)',
        borderRadius: 4,
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
            const isDragSource = dragSource === sq;
            const isDragOver = dragOver === sq;
            const isDraggable = interactive && !!piece && piece.color === playerColor;

            const bg = isLight
              ? 'radial-gradient(circle at 30% 30%, #f5dfa0 0%, #e8c97a 40%, #d4b060 100%)'
              : 'radial-gradient(circle at 30% 30%, #b8834a 0%, #9a6b38 40%, #7a5028 100%)';

            return (
              <div
                key={sq}
                draggable={isDraggable}
                onClick={() => interactive && !isDragSource && onSquareClick(sq)}
                onDragStart={(e) => {
                  if (!isDraggable) return;
                  e.dataTransfer.effectAllowed = 'move';
                  // Use a transparent 1x1 pixel as the drag image so the piece
                  // stays visible at its original position during drag.
                  const ghost = document.createElement('canvas');
                  ghost.width = 1;
                  ghost.height = 1;
                  e.dataTransfer.setDragImage(ghost, 0, 0);
                  setDragSource(sq);
                  onSquareClick(sq); // select piece to show legal move dots
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOver !== sq) setDragOver(sq);
                }}
                onDragLeave={(e) => {
                  // Only clear when leaving the square itself, not a child element
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOver(prev => (prev === sq ? null : prev));
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragSource && dragSource !== sq) {
                    onMovePiece(dragSource as Square, sq);
                  }
                  setDragSource(null);
                  setDragOver(null);
                }}
                onDragEnd={() => {
                  // Drag cancelled (no drop target) — deselect via click on source
                  if (dragSource) onSquareClick(dragSource as Square);
                  setDragSource(null);
                  setDragOver(null);
                }}
                style={{
                  background: bg,
                  position: 'relative',
                  cursor: isDraggable
                    ? isDragSource ? 'grabbing' : 'grab'
                    : interactive && isLegalMove
                    ? 'pointer'
                    : 'default',
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isDragSource ? 0.45 : 1,
                  transition: 'opacity 0.1s',
                }}
              >
                {/* Last move highlight */}
                {isLastMove && (
                  <div style={{ position: 'absolute', inset: 0, background: 'var(--highlight-last)', pointerEvents: 'none' }} />
                )}

                {/* Selected / drag-source highlight */}
                {(isSelected || isDragSource) && (
                  <div style={{ position: 'absolute', inset: 0, background: 'var(--highlight-select)', pointerEvents: 'none' }} />
                )}

                {/* King in check */}
                {isKingInCheck && (
                  <div style={{ position: 'absolute', inset: 0, background: 'var(--highlight-check)', pointerEvents: 'none', borderRadius: '50%' }} />
                )}

                {/* Drag-over highlight */}
                {isDragOver && dragSource && dragSource !== sq && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,85,30,0.45)', pointerEvents: 'none' }} />
                )}

                {/* Legal move dot (empty square) */}
                {isLegalMove && !piece && (
                  <div style={{ position: 'absolute', width: '30%', height: '30%', borderRadius: '50%', background: 'var(--dot-color)', pointerEvents: 'none' }} />
                )}

                {/* Legal move ring (capture) */}
                {isLegalMove && piece && (
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: 'inset 0 0 0 4px rgba(0,0,0,0.25)', pointerEvents: 'none' }} />
                )}

                {/* Piece */}
                {piece && (
                  <div style={{ pointerEvents: 'none' }}>
                    <Piece type={piece.type as PieceType} color={piece.color as Color} />
                  </div>
                )}

                {/* Rank label */}
                {fi === 0 && (
                  <span style={{ position: 'absolute', top: 2, left: 3, fontSize: '0.6rem', fontWeight: 700, lineHeight: 1, color: isLight ? 'var(--board-dark)' : 'var(--board-light)', pointerEvents: 'none', userSelect: 'none' }}>
                    {rank}
                  </span>
                )}

                {/* File label */}
                {ri === 7 && (
                  <span style={{ position: 'absolute', bottom: 2, right: 3, fontSize: '0.6rem', fontWeight: 700, lineHeight: 1, color: isLight ? 'var(--board-dark)' : 'var(--board-light)', pointerEvents: 'none', userSelect: 'none' }}>
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

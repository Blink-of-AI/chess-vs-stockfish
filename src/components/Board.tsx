'use client';
import { useState, useRef } from 'react';
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

interface DragState {
  sq: Square;
  pieceType: PieceType;
  pieceColor: Color;
  x: number;
  y: number;
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
  const gridRef = useRef<HTMLDivElement>(null);

  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragOver, setDragOver] = useState<Square | null>(null);

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

  function getSquareAtPoint(clientX: number, clientY: number): Square | null {
    const grid = gridRef.current;
    if (!grid) return null;
    const rect = grid.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
    const fileIdx = Math.floor((x / rect.width) * 8);
    const rankIdx = Math.floor((y / rect.height) * 8);
    if (fileIdx < 0 || fileIdx > 7 || rankIdx < 0 || rankIdx > 7) return null;
    return `${files[fileIdx]}${ranks[rankIdx]}` as Square;
  }

  function handlePointerDown(e: React.PointerEvent, sq: Square) {
    const piece = chess.get(sq);
    const isDraggable = interactive && !!piece && piece.color === playerColor;
    if (!isDraggable) return;
    e.preventDefault();
    onSquareClick(sq);
    setDragState({
      sq,
      pieceType: piece.type as PieceType,
      pieceColor: piece.color as Color,
      x: e.clientX,
      y: e.clientY,
    });
    setDragOver(null);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragState) return;
    setDragState(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
    const over = getSquareAtPoint(e.clientX, e.clientY);
    setDragOver(over !== dragState.sq ? over : null);
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!dragState) return;
    const target = getSquareAtPoint(e.clientX, e.clientY);
    if (target && target !== dragState.sq) {
      onMovePiece(dragState.sq, target);
    }
    setDragState(null);
    setDragOver(null);
  }

  function handlePointerLeave() {
    if (!dragState) return;
    setDragState(null);
    setDragOver(null);
  }

  const squareSize = gridRef.current
    ? gridRef.current.getBoundingClientRect().width / 8
    : 0;

  return (
    <div
      className="relative select-none"
      style={{
        padding: '28px',
        background: 'linear-gradient(145deg, #a0622a 0%, #7c4a1e 35%, #6a3c18 65%, #8c5424 100%)',
        boxShadow: 'inset 0 0 12px rgba(0,0,0,0.35), inset 0 2px 3px rgba(255,200,120,0.12), 0 6px 32px rgba(0,0,0,0.35)',
        borderRadius: 4,
      }}
    >
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          width: 'clamp(280px, 56vmin, 560px)',
          height: 'clamp(280px, 56vmin, 560px)',
          cursor: dragState ? 'grabbing' : 'default',
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
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
            const isDragSource = dragState?.sq === sq;
            const isDragOver = dragOver === sq;
            const isDraggable = interactive && !!piece && piece.color === playerColor;

            const bg = isLight ? '#f0d9b5' : '#b58863';

            return (
              <div
                key={sq}
                onClick={() => interactive && !isDragSource && onSquareClick(sq)}
                onPointerDown={(e) => handlePointerDown(e, sq)}
                style={{
                  background: bg,
                  position: 'relative',
                  cursor: dragState
                    ? 'grabbing'
                    : isDraggable
                    ? 'grab'
                    : interactive && isLegalMove
                    ? 'pointer'
                    : 'default',
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isDragSource ? 0.35 : 1,
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
                {isDragOver && dragState && dragState.sq !== sq && (
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

      {/* Floating piece following cursor during drag */}
      {dragState && squareSize > 0 && (
        <div
          style={{
            position: 'fixed',
            left: dragState.x - squareSize * 0.5,
            top: dragState.y - squareSize * 0.5,
            width: squareSize,
            height: squareSize,
            pointerEvents: 'none',
            zIndex: 1000,
            opacity: 0.9,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
          }}
        >
          <Piece type={dragState.pieceType} color={dragState.pieceColor} />
        </div>
      )}
    </div>
  );
}

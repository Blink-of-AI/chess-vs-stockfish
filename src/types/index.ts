export type Color = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export type GamePhase =
  | 'color-selection'
  | 'playing'
  | 'thinking'
  | 'promotion'
  | 'game-over';

export type EndReason =
  | 'checkmate'
  | 'stalemate'
  | 'draw-insufficient'
  | 'draw-repetition'
  | 'draw-fifty-moves'
  | 'draw-agreement'
  | 'resignation';

export interface GameResult {
  winner: Color | 'draw';
  reason: EndReason;
}

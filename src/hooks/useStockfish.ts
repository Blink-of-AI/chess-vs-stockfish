'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const [ready, setReady] = useState(false);
  const onBestMoveRef = useRef<((move: string) => void) | null>(null);
  const onEvalRef = useRef<((score: number) => void) | null>(null);
  const modeRef = useRef<'bestmove' | 'eval' | null>(null);
  const evalDepthRef = useRef<number>(10);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const wasmPath = encodeURIComponent('/stockfish-nnue-16-single.wasm');
    const workerUrl = `/stockfish-nnue-16-single.js#${wasmPath},worker`;

    let worker: Worker;
    try {
      worker = new Worker(workerUrl);
    } catch (err) {
      console.error('Failed to create Stockfish worker:', err);
      return;
    }

    worker.onmessage = (e: MessageEvent) => {
      const line: string = typeof e.data === 'string' ? e.data : String(e.data ?? '');
      if (!line) return;

      if (line === 'uciok') {
        worker.postMessage('setoption name Skill Level value 15');
        worker.postMessage('isready');
      }
      if (line === 'readyok') {
        setReady(true);
      }
      if (modeRef.current === 'bestmove' && line.startsWith('bestmove')) {
        const parts = line.split(' ');
        const move = parts[1];
        if (move && move !== '(none)') {
          const cb = onBestMoveRef.current;
          onBestMoveRef.current = null;
          modeRef.current = null;
          cb?.(move);
        }
      }
      if (modeRef.current === 'eval' && line.startsWith('info depth')) {
        const cpMatch = line.match(/score cp (-?\d+)/);
        const mateMatch = line.match(/score mate (-?\d+)/);
        const depthMatch = line.match(/depth (\d+)/);
        if (depthMatch && parseInt(depthMatch[1], 10) >= evalDepthRef.current) {
          let score: number | null = null;
          if (cpMatch) score = parseInt(cpMatch[1], 10);
          else if (mateMatch) score = parseInt(mateMatch[1], 10) > 0 ? 10000 : -10000;
          if (score !== null) {
            worker.postMessage('stop');
            const cb = onEvalRef.current;
            onEvalRef.current = null;
            modeRef.current = null;
            cb?.(score);
          }
        }
      }
    };

    worker.onerror = (e) => {
      console.error('Stockfish worker error:', e);
    };

    worker.postMessage('uci');
    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
      setReady(false);
    };
  }, []);

  const getBestMove = useCallback(
    (fen: string, cb: (move: string) => void, movetime = 1500) => {
      const w = workerRef.current;
      if (!w || !ready) return;
      modeRef.current = 'bestmove';
      onBestMoveRef.current = cb;
      w.postMessage(`position fen ${fen}`);
      w.postMessage(`go movetime ${movetime}`);
    },
    [ready]
  );

  const evaluatePosition = useCallback(
    (fen: string, cb: (score: number) => void, depth = 12) => {
      const w = workerRef.current;
      if (!w || !ready) return;
      evalDepthRef.current = depth;
      modeRef.current = 'eval';
      onEvalRef.current = cb;
      w.postMessage(`position fen ${fen}`);
      w.postMessage(`go depth ${depth}`);
    },
    [ready]
  );

  /**
   * Analyse a sequence of {before, after} FEN pairs (player moves only).
   * Evaluates each position before and after the move at the given depth,
   * then calls onComplete with the computed ACPL (average centipawn loss).
   * onProgress fires after each move with how many are done so far.
   */
  const analyzePlayerMoves = useCallback(
    (
      moves: Array<{ before: string; after: string }>,
      onComplete: (acpl: number) => void,
      onProgress?: (done: number, total: number) => void,
      depth = 6,
    ) => {
      if (!workerRef.current || !ready || moves.length === 0) {
        onComplete(0);
        return;
      }

      const losses: number[] = [];
      let moveIdx = 0;
      let scoreBefore = 0;
      let evalPhase: 'before' | 'after' = 'before';

      const runNext = () => {
        if (moveIdx >= moves.length) {
          const acpl =
            losses.length > 0
              ? losses.reduce((a, b) => a + b, 0) / losses.length
              : 0;
          onComplete(Math.round(acpl));
          return;
        }

        const fen =
          evalPhase === 'before'
            ? moves[moveIdx].before
            : moves[moveIdx].after;

        evaluatePosition(fen, (score) => {
          if (evalPhase === 'before') {
            scoreBefore = score;
            evalPhase = 'after';
            runNext();
          } else {
            // score is from the opponent's perspective (their turn after player moved)
            const scoreForPlayer = -score;
            const cpl = Math.max(0, scoreBefore - scoreForPlayer);
            // Cap individual move loss at 500cp so single blunders don't dominate
            losses.push(Math.min(500, cpl));
            evalPhase = 'before';
            moveIdx++;
            onProgress?.(moveIdx, moves.length);
            runNext();
          }
        }, depth);
      };

      runNext();
    },
    [ready, evaluatePosition],
  );

  return { ready, getBestMove, evaluatePosition, analyzePlayerMoves };
}

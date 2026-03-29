'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const [ready, setReady] = useState(false);
  const onBestMoveRef = useRef<((move: string) => void) | null>(null);
  const onEvalRef = useRef<((score: number) => void) | null>(null);
  const modeRef = useRef<'bestmove' | 'eval' | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let worker: Worker;
    try {
      // Load via a shim so importScripts resolves paths relative to /
      worker = new Worker('/stockfish-worker.js');
    } catch (err) {
      console.error('Failed to create Stockfish worker:', err);
      setError('Failed to load engine');
      return;
    }

    // Timeout: if not ready in 20s, surface an error
    const timeout = setTimeout(() => {
      setError('Engine failed to load — try refreshing');
    }, 20000);

    worker.onmessage = (e: MessageEvent) => {
      const line: string = typeof e.data === 'string' ? e.data : String(e.data ?? '');
      if (!line) return;

      if (line === 'uciok') {
        worker.postMessage('setoption name Skill Level value 15');
        worker.postMessage('isready');
      }
      if (line === 'readyok') {
        clearTimeout(timeout);
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
        if (depthMatch && parseInt(depthMatch[1], 10) >= 10) {
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
      clearTimeout(timeout);
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
    (fen: string, cb: (score: number) => void) => {
      const w = workerRef.current;
      if (!w || !ready) return;
      modeRef.current = 'eval';
      onEvalRef.current = cb;
      w.postMessage(`position fen ${fen}`);
      w.postMessage('go depth 12');
    },
    [ready]
  );

  return { ready, error, getBestMove, evaluatePosition };
}

'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onBestMoveRef = useRef<((move: string) => void) | null>(null);
  const onEvalRef = useRef<((score: number) => void) | null>(null);
  const modeRef = useRef<'bestmove' | 'eval' | null>(null);
  // Set to true when we send `stop` ourselves so the resulting `bestmove`
  // response from the engine is discarded rather than misrouted.
  const discardNextBestMove = useRef(false);
  const recoveryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skillLevelRef = useRef(14); // Advanced by default

  function clearRecovery() {
    if (recoveryTimerRef.current !== null) {
      clearTimeout(recoveryTimerRef.current);
      recoveryTimerRef.current = null;
    }
  }

  // Stop any in-progress search before starting a new one.
  // The `bestmove` the engine emits in response to `stop` is flagged for discard.
  function stopCurrent(w: Worker) {
    if (modeRef.current !== null) {
      discardNextBestMove.current = true;
      w.postMessage('stop');
      modeRef.current = null;
      onBestMoveRef.current = null;
      onEvalRef.current = null;
      clearRecovery();
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let worker: Worker;
    try {
      worker = new Worker('/stockfish-worker.js');
    } catch (err) {
      console.error('Failed to create Stockfish worker:', err);
      setError('Failed to load engine');
      return;
    }

    const initTimeout = setTimeout(() => {
      setError('Engine failed to load — try refreshing');
    }, 20000);

    worker.onmessage = (e: MessageEvent) => {
      const line: string = typeof e.data === 'string' ? e.data : String(e.data ?? '');
      if (!line) return;

      if (line === 'uciok') {
        worker.postMessage(`setoption name Skill Level value ${skillLevelRef.current}`);
        worker.postMessage('isready');
      }

      if (line === 'readyok') {
        clearTimeout(initTimeout);
        setReady(true);
      }

      if (line.startsWith('bestmove')) {
        // This `bestmove` is the engine's response to a `stop` we sent —
        // discard it so it doesn't leak into the next request.
        if (discardNextBestMove.current) {
          discardNextBestMove.current = false;
          return;
        }
        if (modeRef.current === 'bestmove') {
          clearRecovery();
          const parts = line.split(' ');
          const move = parts[1];
          const cb = onBestMoveRef.current;
          onBestMoveRef.current = null;
          modeRef.current = null;
          // `bestmove (none)` means the position has no legal moves — clear
          // state so the game doesn't freeze waiting for a callback.
          if (move && move !== '(none)') {
            cb?.(move);
          }
        }
      }

      if (modeRef.current === 'eval' && line.startsWith('info depth')) {
        const depthMatch = line.match(/depth (\d+)/);
        if (depthMatch && parseInt(depthMatch[1], 10) >= 10) {
          const cpMatch = line.match(/score cp (-?\d+)/);
          const mateMatch = line.match(/score mate (-?\d+)/);
          let score: number | null = null;
          if (cpMatch) score = parseInt(cpMatch[1], 10);
          else if (mateMatch) score = parseInt(mateMatch[1], 10) > 0 ? 10000 : -10000;
          if (score !== null) {
            // Stop the search; flag its `bestmove` response for discard.
            discardNextBestMove.current = true;
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
      clearTimeout(initTimeout);
      clearRecovery();
      worker.terminate();
      workerRef.current = null;
      setReady(false);
    };
  }, []);

  const getBestMove = useCallback(
    (fen: string, cb: (move: string) => void, movetime = 1500) => {
      const w = workerRef.current;
      if (!w || !ready) return;
      stopCurrent(w);
      modeRef.current = 'bestmove';
      onBestMoveRef.current = cb;
      w.postMessage(`setoption name Skill Level value ${skillLevelRef.current}`);
      w.postMessage(`position fen ${fen}`);
      w.postMessage(`go movetime ${movetime}`);

      // Safety net: if no bestmove arrives within movetime + 5 s, send stop
      // to force the engine to respond and unblock the game.
      recoveryTimerRef.current = setTimeout(() => {
        if (modeRef.current === 'bestmove') {
          console.warn('Stockfish recovery: no bestmove received, sending stop');
          discardNextBestMove.current = false; // we want the next bestmove
          w.postMessage('stop');
        }
      }, movetime + 5000);
    },
    [ready]
  );

  const evaluatePosition = useCallback(
    (fen: string, cb: (score: number) => void) => {
      const w = workerRef.current;
      if (!w || !ready) return;
      stopCurrent(w);
      modeRef.current = 'eval';
      onEvalRef.current = cb;
      w.postMessage(`position fen ${fen}`);
      w.postMessage('go depth 12');
    },
    [ready]
  );

  const setSkillLevel = useCallback((level: number) => {
    skillLevelRef.current = level;
    const w = workerRef.current;
    if (w) w.postMessage(`setoption name Skill Level value ${level}`);
  }, []);

  return { ready, error, getBestMove, evaluatePosition, setSkillLevel };
}

import { useEffect, useRef } from 'react';

export function usePolling(fn: () => void, intervalMs: number): void {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const start = () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(fn, intervalMs);
    };

    const stop = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    start();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fn, intervalMs]);
}

import { useEffect, useRef } from 'react';

export function usePolling(fn: () => void, intervalMs: number): void {
  const intervalIdRef = useRef<number | null>(null);

  useEffect(() => {
    const start = () => {
      if (intervalIdRef.current !== null) return;
      intervalIdRef.current = window.setInterval(fn, intervalMs);
    };

    const stop = () => {
      if (intervalIdRef.current !== null) {
        window.clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        stop();
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

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useShortcuts() {
  const [helpOpen, setHelpOpen] = useState(false);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const gPressed = useRef(false);
  const gTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;

      if (event.key === '?') {
        event.preventDefault();
        setHelpOpen(true);
        return;
      }

      if (event.key === '/') {
        event.preventDefault();
        const searchInput = document.querySelector<HTMLElement>('[data-search-input]');
        searchInput?.focus();
        return;
      }

      if (event.key === 'g') {
        if (gPressed.current) {
          clearTimeout(gTimeout.current);
          gPressed.current = false;
          navigateRef.current('/grid');
          return;
        }
        gPressed.current = true;
        gTimeout.current = setTimeout(() => {
          gPressed.current = false;
        }, 800);
        return;
      }

      if (gPressed.current) {
        clearTimeout(gTimeout.current);
        gPressed.current = false;
        if (event.key === 'i') {
          navigateRef.current('/issues');
        } else if (event.key === 'd') {
          navigateRef.current('/dashboard');
        }
      }
    };

    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      clearTimeout(gTimeout.current);
    };
  }, []);

  return { helpOpen, setHelpOpen };
}

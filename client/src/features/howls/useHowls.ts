import { useEffect, useState } from 'react';
import { getHowls } from './api';
import type { Howl } from './types';

export function useHowls() {
  const [howls, setHowls] = useState<Howl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getHowls()
      .then((data) => {
        if (!cancelled) {
          setHowls(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load howls');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { howls, loading, error };
}

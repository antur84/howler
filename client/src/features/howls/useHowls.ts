import { useCallback, useEffect, useState } from 'react';
import type { User } from '../auth';
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

  const addHowl = useCallback((user: User, content: string) => {
    const newHowl: Howl = {
      id: crypto.randomUUID(),
      author: {
        displayName: user.name,
        username: user.email.split('@')[0],
      },
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setHowls((prev) => [newHowl, ...prev]);
  }, []);

  return { howls, loading, error, addHowl };
}

import { useEffect, useState } from 'react';
import { getHowls } from './api';
import { HowlCard } from './HowlCard';
import './HowlFeed.css';
import type { Howl } from './types';

export function HowlFeed() {
  const [howls, setHowls] = useState<Howl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getHowls()
      .then((data) => {
        if (!cancelled) setHowls(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load howls');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="howl-feed">
      <h2 className="howl-feed-header">Howls 🐺</h2>
      {loading && <p className="howl-feed-loading">Loading howls…</p>}
      {error && <p className="howl-feed-error">{error}</p>}
      {!loading && !error && howls.map((h) => <HowlCard key={h.id} howl={h} />)}
    </section>
  );
}

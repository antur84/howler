import { HowlCard } from './HowlCard';
import './HowlFeed.css';
import { useHowls } from './useHowls';

export function HowlFeed() {
  const { howls, loading, error } = useHowls();

  return (
    <section className="howl-feed">
      <h2 className="howl-feed-header">Howls 🐺</h2>
      {loading && <p className="howl-feed-loading">Loading howls…</p>}
      {error && <p className="howl-feed-error">{error}</p>}
      {!loading && !error && howls.map((h) => <HowlCard key={h.id} howl={h} />)}
    </section>
  );
}

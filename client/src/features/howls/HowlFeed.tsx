import type { User } from '../auth';
import { ComposeHowl } from './ComposeHowl';
import { HowlCard } from './HowlCard';
import { useHowls } from './useHowls';

interface HowlFeedProps {
  user?: User | null;
}

export function HowlFeed({ user }: HowlFeedProps) {
  const { howls, loading, error, addHowl } = useHowls();

  return (
    <section className="max-w-[600px] mx-auto bg-bg overflow-hidden flex flex-col gap-4">
      <h2 className="px-5 py-4 font-bold text-xl text-text-h">Howls 🐺</h2>
      {user && <ComposeHowl user={user} onHowl={(content) => addHowl(user, content)} />}
      {loading && <p className="p-8 text-center text-text">Loading howls…</p>}
      {error && <p className="p-8 text-center text-red-500">{error}</p>}
      {!loading && !error && howls.map((h) => <HowlCard key={h.id} howl={h} />)}
    </section>
  );
}

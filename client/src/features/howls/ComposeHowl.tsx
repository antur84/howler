import { useState } from 'react';
import type { User } from '../auth';

interface ComposeHowlProps {
  user: User;
  onHowl: (content: string) => void;
}

export function ComposeHowl({ user, onHowl }: ComposeHowlProps) {
  const [content, setContent] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      return;
    }
    onHowl(trimmed);
    setContent('');
  }

  return (
    <form onSubmit={handleSubmit} className="px-5 py-4 border border-border rounded-sm">
      <div className="flex items-center gap-2 mb-2">
        <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
        <span className="font-bold text-text-h text-sm">{user.name}</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Bark at the moon 🐺"
        maxLength={280}
        rows={3}
        className="w-full resize-none rounded border border-border bg-transparent px-3 py-2 text-text-h placeholder:text-text focus:border-accent focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-text">{content.length}/280</span>
        <button
          type="submit"
          disabled={!content.trim()}
          className="rounded bg-accent px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40"
        >
          Howl
        </button>
      </div>
    </form>
  );
}

import type { Howl } from './types';

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) {
    return `${diffSec}s`;
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin}m`;
  }
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) {
    return `${diffHr}h`;
  }
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d`;
}

interface HowlCardProps {
  howl: Howl;
}

export function HowlCard({ howl }: HowlCardProps) {
  return (
    <article className="px-5 py-4 border border-border rounded-sm">
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="font-bold text-text-h text-[0.95rem]">
          {howl.author.displayName}
        </span>
        <span className="text-text text-sm">@{howl.author.username}</span>
        <span className="text-text text-sm">·</span>
        <time className="text-text text-sm" dateTime={howl.createdAt}>
          {formatRelativeTime(howl.createdAt)}
        </time>
      </div>
      <p className="text-text-h leading-[1.45] mb-2">{howl.content}</p>
      <div className="flex items-center gap-1 text-text text-sm">
        <span className="cursor-pointer transition-colors hover:text-accent">
          ♥ {howl.likes}
        </span>
      </div>
    </article>
  );
}

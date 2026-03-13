import './HowlCard.css'
import type { Howl } from './types'

function formatRelativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffSec = Math.floor((now - then) / 1000)

  if (diffSec < 60) return `${diffSec}s`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d`
}

interface HowlCardProps {
  howl: Howl
}

export function HowlCard({ howl }: HowlCardProps) {
  return (
    <article className="howl-card">
      <div className="howl-header">
        <span className="howl-display-name">{howl.author.displayName}</span>
        <span className="howl-username">{howl.author.username}</span>
        <span className="howl-separator" />
        <time className="howl-timestamp" dateTime={howl.createdAt}>
          {formatRelativeTime(howl.createdAt)}
        </time>
      </div>
      <p className="howl-content">{howl.content}</p>
      <div className="howl-footer">
        <span className="howl-likes">♥ {howl.likes}</span>
      </div>
    </article>
  )
}

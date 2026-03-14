import type { Howl } from './types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export async function getHowls(): Promise<Howl[]> {
  const res = await fetch(`${API_BASE}/howls`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to load howls');
  }
  return res.json();
}

export async function createHowl(content: string): Promise<Howl> {
  const res = await fetch(`${API_BASE}/howls`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    throw new Error('Failed to create howl');
  }
  return res.json();
}

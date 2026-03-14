const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export async function verifyGoogleCredential(credential: string) {
  const res = await fetch(`${API_BASE}/auth/google/verify`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  if (!res.ok) {
    throw new Error('verification failed');
  }
  return res.json();
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function logout() {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

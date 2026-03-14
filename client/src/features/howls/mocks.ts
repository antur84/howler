import type { Howl } from './types';

const mockHowls: Howl[] = [
  {
    id: '1',
    author: { displayName: 'Luna Starfield', username: 'lunastar' },
    content: 'Just deployed my first app to production. The thrill is real! 🚀',
    createdAt: '2026-03-13T08:30:00Z',
    likes: 24,
  },
  {
    id: '2',
    author: { displayName: 'Dev McDeveloper', username: 'devmcdev' },
    content: 'Hot take: tabs are superior to spaces and I will not be taking questions at this time.',
    createdAt: '2026-03-13T07:15:00Z',
    likes: 108,
  },
  {
    id: '3',
    author: { displayName: 'Casey Compiler', username: 'caseycomp' },
    content: 'Spent 3 hours debugging only to find a missing semicolon. Classic Thursday.',
    createdAt: '2026-03-13T06:00:00Z',
    likes: 56,
  },
  {
    id: '4',
    author: { displayName: 'Aria Nguyen', username: 'ariang' },
    content: 'The new React docs are incredible. Finally understanding Suspense after all this time.',
    createdAt: '2026-03-12T22:45:00Z',
    likes: 73,
  },
  {
    id: '5',
    author: { displayName: 'Max Overflow', username: 'maxover' },
    content: 'Who else writes "TODO: fix later" knowing full well that later never comes?',
    createdAt: '2026-03-12T18:30:00Z',
    likes: 201,
  },
];

export function fetchMockHowls(): Promise<Howl[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockHowls), 300);
  });
}

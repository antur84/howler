import { fetchMockHowls } from './mocks'
import type { Howl } from './types'

export async function getHowls(): Promise<Howl[]> {
  // TODO: Replace with real API call, e.g.:
  // const res = await fetch('/api/howls')
  // return res.json()
  return fetchMockHowls()
}

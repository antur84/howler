export interface HowlAuthor {
  displayName: string
  username: string
}

export interface Howl {
  id: string
  author: HowlAuthor
  content: string
  createdAt: string
  likes: number
}

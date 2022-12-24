export interface MusicItem {
  userId: string
  musicId: string
  createdAt: string
  musicName: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}

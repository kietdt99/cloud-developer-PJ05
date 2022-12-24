/**
 * Fields in a request to update a single MUSIC item.
 */
export interface UpdateMusicRequest {
  musicName: string
  dueDate: string
  done: boolean
}
import { apiEndpoint } from '../config'
import { Music } from '../types/Music';
import { CreateMusicRequest } from '../types/CreateMusicRequest';
import Axios from 'axios'
import { UpdateMusicRequest } from '../types/UpdateMusicRequest';

export async function getMusics(idToken: string): Promise<Music[]> {
  console.log('Fetching musics')

  const response = await Axios.get(`${apiEndpoint}/musics`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Musics:', response.data)
  return response.data.items
}

export async function createMusic(
  idToken: string,
  newMusic: CreateMusicRequest
): Promise<Music> {
  const response = await Axios.post(`${apiEndpoint}/musics`,  JSON.stringify(newMusic), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchMusic(
  idToken: string,
  musicId: string,
  updatedMusic: UpdateMusicRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/musics/${musicId}`, JSON.stringify(updatedMusic), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteMusic(
  idToken: string,
  musicId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/musics/${musicId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  musicId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/musics/${musicId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}

export async function downloadImage(idToken: string, musicId: string): Promise<any> {
  const response = await Axios.get(`${apiEndpoint}/musics/${musicId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

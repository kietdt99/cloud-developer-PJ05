import { MusicsAccess } from '../dataLayer/musicsAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { MusicItem } from '../models/MusicItem'
import { CreateMusicRequest } from '../requests/CreateMusicRequest'
import { UpdateMusicRequest } from '../requests/UpdateMusicRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

const logger = createLogger('musics')

const musicsAccess = new MusicsAccess()
const attachmentUtil = new AttachmentUtils()

export async function getMusics(userId: string) {
  logger.info(`Retrieving all musics for user ${userId}`)
  return await musicsAccess.getAllMusics(userId)
}

export async function getMusicById(musicId: string) {
  logger.info(`Retrieving music by ${musicId}`)
  return await musicsAccess.getMusicById(musicId)
}

export async function createMusic(
  userId: string,
  createMusicRequest: CreateMusicRequest
): Promise<MusicItem> {
  const musicId = uuid.v4()

  const newItem: MusicItem = {
    userId,
    musicId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: null,
    ...createMusicRequest
  }

  await musicsAccess.createMusic(newItem)

  return newItem
}

async function checkMusic(userId: string, musicId: string) {
  const existItem = await musicsAccess.getMusicItem(userId, musicId)
  if (!existItem) {
    throw new createError.NotFound(`Music with id: ${musicId} not found`)
  }

  if (existItem.userId !== userId) {
    throw new createError.BadRequest('User not authorized to update item')
  }
}

export async function updateMusic(
  userId: string,
  musicId: string,
  updateRequest: UpdateMusicRequest
) {
  await checkMusic(userId, musicId)

  musicsAccess.updateMusicItem(userId, musicId, updateRequest)
}

export async function deleteMusic(userId: string, musicId: string) {
  await checkMusic(userId, musicId)

  musicsAccess.deleteMusicItem(userId, musicId)
}

export async function updateAttachmentUrl(
  userId: string,
  musicId: string,
  attachmentId: string
) {
  await checkMusic(userId, musicId)

  const url = await attachmentUtil.getAttachmentUrl(attachmentId)

  await musicsAccess.updateAttachmentUrl(userId, musicId, url)
}

export async function generateAttachmentUrl(id: string): Promise<string> {
  return await attachmentUtil.getUploadUrl(id)
}

export const downloadMusicImage = (musicId: string): string => {
  logger.info('Starting download image with musicId: ', musicId)
  return attachmentUtil.downloadImage(musicId)
}

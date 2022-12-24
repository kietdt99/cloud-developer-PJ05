import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getMusicById } from '../../businessLogic/musics'
import { getUserId } from '../utils';

const logger = createLogger('GetImageHandler')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const musicId = event.pathParameters?.musicId
    if (!musicId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid musicId param' })
      }
    }
    logger.info(`getImageHandler receives request to download image with musicId: ${musicId}`)
    const image = getMusicById(musicId)
    return {
      statusCode: 200,
      body: JSON.stringify({ item: image })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

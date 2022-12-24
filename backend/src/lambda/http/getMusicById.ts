import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { getMusics } from '../../businessLogic/musics'

const logger = createLogger('GetImageHandler')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const musicId = event.pathParameters?.musicId
    if (!musicId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid musicId param' })
      }
    }
    logger.info(getImageHandler receives request to download image with musicId: ${musicId})
    const image = await getMusics(getUserId(event))
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

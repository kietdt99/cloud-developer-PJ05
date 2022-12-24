import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getMusicById, getMusics } from '../../businessLogic/musics'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    const musics = await getMusicById(getUserId(event), event.pathParameters.musicId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: musics
      })
    }
  })
handler.use(
  cors({
    credentials: true
  })
)

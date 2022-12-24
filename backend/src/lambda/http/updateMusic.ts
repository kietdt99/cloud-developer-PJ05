import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateMusic } from '../../businessLogic/musics'
import { UpdateMusicRequest } from '../../requests/UpdateMusicRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const updatedMusic: UpdateMusicRequest = JSON.parse(event.body)

    await updateMusic(getUserId(event), event.pathParameters.musicId, updatedMusic)

    return {
      statusCode: 200,
      body: ''
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )

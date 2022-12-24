import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getMusics } from '../../businessLogic/musics'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    const musics = await getMusics(getUserId(event))

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

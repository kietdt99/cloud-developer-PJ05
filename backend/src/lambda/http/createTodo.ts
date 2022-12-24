import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateMusicRequest } from '../../requests/CreateMusicRequest'
import { getUserId } from '../utils';
import { createMusic } from '../../businessLogic/musics'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    const newMusic: CreateMusicRequest = JSON.parse(event.body)

    const newItem = await createMusic(getUserId(event), newMusic);

    return {
      statusCode: 201,
      body: JSON.stringify({item: newItem})
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
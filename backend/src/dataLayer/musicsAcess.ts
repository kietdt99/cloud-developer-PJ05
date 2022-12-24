import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { MusicItem } from '../models/MusicItem'
import { MusicUpdate } from '../models/MusicUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('MusicsAccess')

export class MusicsAccess {
    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly musicsTable = process.env.MUSICS_TABLE
    ) {}
  
    async getMusicItem(userId: string, musicId: string): Promise<MusicItem> {
      return (
        await this.docClient
          .get({
            TableName: this.musicsTable,
            Key: {
              userId,
              musicId
            }
          })
          .promise()
      ).Item as MusicItem
    }
  
    async getAllMusics(userId: string): Promise<MusicItem[]> {
      logger.info('Getting all musics')
      const result = await this.docClient
        .query({
          TableName: this.musicsTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          }
        })
        .promise()
  
      return result.Items as MusicItem[]
    }
  
    async createMusic(musicItem: MusicItem): Promise<MusicItem> {
      logger.info('Create a new music')
      await this.docClient
        .put({
          TableName: this.musicsTable,
          Item: musicItem
        })
        .promise()
      return musicItem
    }
  
    async updateMusicItem(userId: string, musicId: string, musicUpdate: MusicUpdate) {
      logger.info(`Updating music ${musicId} with ${JSON.stringify(musicUpdate)}`)
      await this.docClient
        .update({
          TableName: this.musicsTable,
          Key: {
            userId,
            musicId
          },
          UpdateExpression: 'set #musicName = :musicName, dueDate = :dueDate, done = :done',
          ExpressionAttributeNames: {
            '#musicName': 'musicName'
          },
          ExpressionAttributeValues: {
            ':musicName': musicUpdate.musicName,
            ':dueDate': musicUpdate.dueDate,
            ':done': musicUpdate.done
          }
        })
        .promise()
    }
  
    async deleteMusicItem(userId: string, musicId: string) {
      logger.info(`deleting music ${musicId}`)
      await this.docClient
        .delete({
          TableName: this.musicsTable,
          Key: {
            userId,
            musicId
          }
        })
        .promise()
    }
  
    async updateAttachmentUrl(userId: string, musicId: string, newUrl: string) {
      logger.info(
        `Updating ${newUrl} attachment URL for music ${musicId} in table ${this.musicsTable}`
      )
  
      await this.docClient
        .update({
          TableName: this.musicsTable,
          Key: {
            userId,
            musicId
          },
          UpdateExpression: 'set attachmentUrl = :attachmentUrl',
          ExpressionAttributeValues: {
            ':attachmentUrl': newUrl
          }
        })
        .promise()
    }
  }
  
  function createDynamoDBClient(): DocumentClient {
    if (process.env.IS_OFFLINE) {
      logger.info('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }
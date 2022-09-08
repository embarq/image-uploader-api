import { GetObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from './storage'

export const getFile = async (name: string): Promise<ReadableStream | void> => {
  const req = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: name
  })
  const res = await s3Client.send(req)

  return res.Body
}

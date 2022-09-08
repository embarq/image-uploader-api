import fs from 'fs'
import assert from 'assert'
import path from 'path'
import stream from 'stream'
import { CompleteMultipartUploadOutput } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { randomBytes } from 'crypto'
import { s3Client } from './storage'

export const upload = async (src: string, fileName: string): Promise<{ url: string, fileName: string }> => {
  const { ext, name } = path.parse(fileName)
  const distFileName = [
    encodeURIComponent(name),
    '.',
    randomBytes(8).toString('base64url'),
    ext
  ].join('')
  const reader = fs.createReadStream(src)
  const payload = new stream.PassThrough()

  reader
    .pipe(payload)
    .on('error', console.error)

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: distFileName,
      Body: payload
    },
  })

  const { Key, Location }: CompleteMultipartUploadOutput = await upload.done()

  assert(Key)
  assert(Location)

  return {
    url: Location,
    fileName: Key,
  }
}

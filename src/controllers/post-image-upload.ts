import fs from 'fs'
import stream from 'stream'
import path from 'path'
import { randomBytes } from 'crypto'
import { Context } from 'koa'
import { s3Client } from '../lib/storage'
import { Upload } from '@aws-sdk/lib-storage'
import * as imageEntity from '../entities/image'
import { CompleteMultipartUploadOutput } from '@aws-sdk/client-s3'
import assert from 'assert'

export const handleImageUpload = async (ctx: Context) => {
  if (ctx.request.files == null) {
    ctx.status = 400
    ctx.body = {
      status: 'error',
      code: 'invalid_request'
    }
    return
  }

  const files = ctx.request.files.files

  if (Array.isArray(files) && files.length > 1) {
    ctx.status = 400
    ctx.body = {
      status: 'error',
      code: 'file_upload_limit_exceeded'
    }
    return
  }

  const file = Array.isArray(files) ? files[0] : files
  const ALLOWED_IMAGE_TYPES = [
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
  ]

  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype!)) {
    ctx.status = 400
    ctx.body = {
      status: 'error',
      code: 'file_upload_invalid_file_type',
      detail: {
        src_file_name: file.originalFilename,
        src_file_type: file.mimetype,
      }
    }
    return
  }

  const { ext, name } = path.parse(file.originalFilename!)
  const distFileName = [encodeURIComponent(name), '.', randomBytes(8).toString('base64url'), ext].join('')
  const reader = fs.createReadStream(file.filepath)
  const next = new stream.PassThrough()

  reader
    .pipe(next)
    .on('error', console.error)

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: distFileName,
      Body: next
    },
  })


  try {
    const res: CompleteMultipartUploadOutput = await upload.done()

    assert(res.Location)

    const data = await imageEntity.create({
      name: distFileName,
      url: res.Location,
    })

    ctx.body = {
      status: 'success',
      payload: {
        ...data
      },
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500
    ctx.body = {
      status: 'error',
      code: 'unknown'
    }
  }
}

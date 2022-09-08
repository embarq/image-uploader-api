import { Context } from 'koa'
import assert from 'assert'
import { upload } from '../lib/file-upload'
import * as imageEntity from '../entities/image'

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

  try {
    assert(file.originalFilename)

    const { url, fileName } = await upload(file.filepath, file.originalFilename)

    const data = await imageEntity.create({
      name: fileName,
      url,
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

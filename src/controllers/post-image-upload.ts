import { Context } from 'koa'
import assert from 'assert'
import { upload } from '../lib/file-upload'
import * as imageEntity from '../entities/image'

export const handleImageUpload = async (ctx: Context) => {
  if (ctx.request.files == null) {
    ctx.throw(400, 'missing_file')
  }

  const files = ctx.request.files.files

  if (Array.isArray(files) && files.length > 1) {
    ctx.throw(400, 'file_upload_limit_exceeded')
  }

  const file = Array.isArray(files) ? files[0] : files
  const ALLOWED_IMAGE_TYPES = [
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
  ]

  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype!)) {
    ctx.throw(400, 'file_upload_invalid_file_type')
  }

  try {
    assert(file.originalFilename)

    const { url, fileName } = await upload(file.filepath, file.originalFilename)

    const data = await imageEntity.create({
      name: fileName,
      url,
    })

    console.log('dbwrite', data)

    ctx.body = {
      status: 'success',
      payload: {
        ...data
      },
    }
  } catch (error) {
    console.error(error);
    ctx.throw(500)
  }
}

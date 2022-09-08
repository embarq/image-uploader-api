import { Context } from 'koa'
import assert from 'assert'
import * as imageEntity from '../entities/image'
import { getFile } from '../lib/file-fetch'

export const handleGetImage = async (ctx: Context) => {
  const data = await imageEntity.findOneByName(ctx.params.name)

  if (data == null) {
    ctx.status = 404
    ctx.body = {
      status: 'error',
      code: 'entity_not_found',
    }
    return
  }

  try {
    const res = await getFile(data.name)

    assert(res)

    ctx.body = res
  } catch (error) {
    console.error(error);
    ctx.status = 500
    ctx.body = {
      status: 'error',
      code: 'unknown'
    }
  }
}

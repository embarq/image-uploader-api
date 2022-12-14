import { Context } from 'koa'
import assert from 'assert'
import * as imageEntity from '../entities/image'
import { getFile } from '../lib/file-fetch'

export const handleGetImage = async (ctx: Context) => {
  const data = await imageEntity.findOneByName(encodeURI(ctx.params.name))

  if (data == null) {
    ctx.throw(404)
    return
  }

  try {
    const res = await getFile(data.name)

    assert(res)

    ctx.body = res
  } catch (error) {
    console.error(error);
    ctx.throw(500)
  }
}

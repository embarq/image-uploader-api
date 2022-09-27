import { Context } from 'koa'

export const handleIndex = (ctx: Context) => {
  ctx.body = {
    v: process.env.APP_VERSION
  }
}

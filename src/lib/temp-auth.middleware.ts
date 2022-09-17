import { Context, Next } from 'koa'
import * as accessTokenStore from './access-token-store'

export const tempAuthMiddleware = async (ctx: Context, next: Next) => {
  const tempToken = ctx.headers.authorization

  if (tempToken == null) {
    ctx.throw(401)
  }

  const tempTokenEntry = await accessTokenStore.get(tempToken)

  if (tempTokenEntry != null && !accessTokenStore.isExpired(tempTokenEntry)) {
    next()
    return
  }

  ctx.throw(401)
}

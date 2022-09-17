import { Context } from 'koa'
import got from 'got'
import * as accessTokenStore from '../lib/access-token-store'
import { ReCaptchaSiteVerifyResponse } from '../model/vendor'

export const handleValidateRecaptcha = async (ctx: Context) => {
  const res = await got
    .post('https://www.google.com/recaptcha/api/siteverify', {
      searchParams: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: ctx.request.body.response,
        remoteip: ctx.request.ip
      }
    })
    .json<ReCaptchaSiteVerifyResponse>()

  if (!res.success) {
    console.error(res)
    ctx.status = 400
    ctx.body = {
      status: 'error',
      payload: {
        code: res['error-codes'],
      }
    }
    return
  }

  const token = await accessTokenStore.create({ clientIP: ctx.request.ip })

  ctx.body = {
    status: res.success ? 'success' : 'error',
    payload: {
      temp_token: token.value
    }
  }
}

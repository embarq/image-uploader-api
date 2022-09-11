import { Context } from 'koa'
import got from 'got'
import * as accessTokenStore from '../lib/access-token-store'

interface SiteVerifyResponse {
  "success": boolean,
  "challenge_ts": number,
  "hostname": string,
  "error-codes": unknown[]
}

export const handleValidateRecaptcha = async (ctx: Context) => {
  const res = await got
    .post('https://www.google.com/recaptcha/api/siteverify', {

      json: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: ctx.request.body.response,
        remoteip: ctx.request.ip
      }
    })
    .json<SiteVerifyResponse>()

  if (!res.success) {
    console.error(res)
    ctx.status = 400
    ctx.body = {
      status: 'error',
      payload: {
        detail: res['error-codes']
      }
    }
    return
  }

  // TODO: remove
  console.log(res)
  const token = await accessTokenStore.create({ clientIP: ctx.request.ip })

  ctx.body = {
    status: res.success ? 'success' : 'error',
    payload: {
      temp_token: token.value
    }
  }
}

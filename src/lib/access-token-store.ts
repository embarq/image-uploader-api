import assert from 'assert'
import { randomUUID } from 'crypto'

assert(process.env.TEMP_TOKEN_TTL)
const TEMP_TOKEN_TTL = parseInt(process.env.TEMP_TOKEN_TTL)
const store = new Map<TempAccessTokenStoreKey, TempAccessToken>()

export type TempAccessTokenStoreKey = string

export interface TempAccessToken {
  createdAt: number,
  value: TempAccessTokenStoreKey,
  clientIP: string,
}

export const create = ({ clientIP }: Pick<TempAccessToken, 'clientIP'>): Promise<TempAccessToken> => {
  const value = randomUUID()
  const payload: TempAccessToken = {
    value,
    clientIP,
    createdAt: Date.now(),
  }
  store.set(value, payload)
  return Promise.resolve(payload)
}

export const get = (
  value: TempAccessTokenStoreKey
): Promise<TempAccessToken | void> => {
  return Promise.resolve(store.get(value))
}

export const remove = (value: TempAccessTokenStoreKey): Promise<void> => {
  store.delete(value)
  return Promise.resolve()
}

export const isExpired = (token: TempAccessToken) => {
  return (Date.now() - token.createdAt) >= TEMP_TOKEN_TTL
}

export const invalidate = (): Promise<void> => {
  store.forEach(token => {
    if (isExpired(token)) {
      remove(token.value)
    }
  })
  return Promise.resolve()
}

/**
 * @param {number} period - check period. defaults to 2 min
 * @returns {() => void} cleanup callback
 */
export const startPeriodicCheck = (period = 1e3 * 60 * 2) => {
  const tid = setInterval(async () => {
    await invalidate()
  }, period)
  return () => clearInterval(tid)
}

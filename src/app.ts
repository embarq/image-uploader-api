import { createServer, Server } from 'http'
import Koa from 'koa'
import koaBody from 'koa-body'
import logger from 'koa-logger'
import cors from '@koa/cors'
import * as db from './lib/db'
import { router } from './router'

export const app = new Koa()

app.use(logger())
app.use(koaBody({
  multipart: true,
  text: false,
}))
app.use(cors())
app.use(router.routes())

const httpServer = createServer(app.callback())

export interface StartResult {
  server: Server,
  stop: () => Promise<void>
}

export const start = async (): Promise<StartResult> => {
  const port = process.env.PORT

  await db.init()

  return new Promise((resolve) => {
    httpServer.listen(process.env.PORT, () => {
      console.log('App started on port', port)
      resolve({
        server: httpServer,
        stop: () => {
          console.log('App cleanup before exit')
          return db.close()
        }
      })
    })
  })
}

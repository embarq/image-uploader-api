import { createServer, Server } from 'http'
import Koa from 'koa'
import koaBody from 'koa-body'
import logger from 'koa-logger'
import { router } from './router'

export const app = new Koa()

app.use(logger())
app.use(koaBody({ multipart: true }))
app.use(router.routes())

const httpServer = createServer(app.callback())

export interface StartResult {
  server: Server,
  stop: () => Promise<void>
}

export const start = (): Promise<StartResult> => {
  const port = process.env.PORT

  return new Promise((resolve) => {
    httpServer.listen(process.env.PORT, () => {
      console.log('App started on port', port)
      resolve({
        server: httpServer,
        stop: () => {
          console.log('App cleanup before exit')
          return Promise.resolve()
        }
      })
    })
  })
}

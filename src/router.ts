import Router from 'koa-router'
import { handleImageUpload } from './controllers/post-upload'
import { AppContext } from './model'

export const router = new Router<unknown, AppContext>()

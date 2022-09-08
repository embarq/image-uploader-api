import Router from 'koa-router'
import { handleImageUpload } from './controllers/post-image-upload'
import { AppContext } from './model'

export const router = new Router<unknown, AppContext>()

router.post('/image/upload', handleImageUpload)

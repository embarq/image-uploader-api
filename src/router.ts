import Router from 'koa-router'
import { handleGetImage } from './controllers/get-image'
import { handleImageUpload } from './controllers/post-image-upload'
import { AppContext } from './model'

export const router = new Router<unknown, AppContext>()

router.post('/v1/image/upload', handleImageUpload)
router.get('/v1/image/:name', handleGetImage)

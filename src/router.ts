import Router from 'koa-router'
import { handleGetImage } from './controllers/get-image'
import { handleImageUpload } from './controllers/post-image-upload'
import { handleValidateRecaptcha } from './controllers/post-validate-recaptcha'
import { tempAuthMiddleware } from './lib/temp-auth.middleware'
import { AppContext } from './model'

export const router = new Router<unknown, AppContext>()

router.post('/v1/validate-recaptcha', handleValidateRecaptcha)
router.post('/v1/image/upload', tempAuthMiddleware, handleImageUpload)
router.get('/v1/image/:name', handleGetImage)

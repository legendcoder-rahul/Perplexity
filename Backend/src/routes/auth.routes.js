import {Router} from 'express'
import { registerValidator, loginValidator } from '../validator/auth.validator.js'
import { register,verifyEmail, login, getMe, logout } from '../controllers/auth.controller.js'
import {authUser} from '../middleware/auth.middleware.js'

const authRouter = Router()

authRouter.post('/register', registerValidator, register)
authRouter.post('/login',loginValidator, login )
authRouter.get('/get-me', authUser, getMe)
authRouter.get('/verify-email', verifyEmail)
authRouter.get('/logout', authUser, logout)

export default authRouter
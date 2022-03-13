import express from 'express'
import { userController } from '*/controllers/user.controller'
import { userValidation } from '*/validations/user.validation'

const router = express.Router()

router.route('/register')
  .post(userValidation.register, userController.register)

export const userRoutes = router
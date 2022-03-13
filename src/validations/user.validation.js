import Joi from 'joi'
import { HttpStatusCode } from '*/utilities/constants'

const register = async (req, res, next) => {
  const condition = Joi.object({
    name: Joi.string().required().min(3).max(20).trim(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().min(3).max(40).trim(),
    password: Joi.string().required().min(3).max(20).trim()
  })
  try {
    await condition.validateAsync(req.body, { abortEarly: false })
    //Nếu thỏa mãn condition => controller
    next()
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message
    })
  }
}

export const userValidation = {
  register
}
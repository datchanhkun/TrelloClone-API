import { userService } from '*/services/user.service'
import { HttpStatusCode } from '*/utilities/constants'

const register = async (req, res) => {
  try {
    const result = await userService.register(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error
    })
  }
}


export const userController = {
  register
}
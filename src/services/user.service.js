import { UserModel } from '*/models/user.model'
// import { cloneDeep } from 'lodash'
const register = async (data) => {
  try {
    const result = await UserModel.register(data)
    return result
  } catch (error) {
    throw new Error(error)
  }
}


export const userService = {
  register
}
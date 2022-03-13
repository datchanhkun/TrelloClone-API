import Joi from 'joi'
import { getDB } from '*/config/mongodb'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// import { ObjectId } from 'mongodb'
//Định nghĩa 'user' collection
const userCollectionName = 'user'
const userCollectionSchema = Joi.object({
  name: Joi.string().required().min(3).max(20).trim(),
  email: Joi.string().required().min(3).max(40).trim(),
  password: Joi.string().required().min(3).max(20).trim(),
  role: Joi.number().default(0), // 0 = user , 1 = admin
  avatar: Joi.string().default('https://res.cloudinary.com/foochat/image/upload/v1646592930/Trello-Clone/avatardefault_92824_dbthmt.png'),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})

//Sử dụng abortEarly để hiển thị đầy đủ lỗi -> mặc định chỉ hiển thị line đầu tiên rồi dừng
const validateSchema = async (data) => {
  return await userCollectionSchema.validateAsync(data, { abortEarly: false })
}

const register = async (data) => {
  try {
    //data đã được validate
    const value = await validateSchema(data)

    //validate user
    const doesExist = await getDB().collection(userCollectionName).findOne({ email: data.email })
    const hashPassword = await bcrypt.hash(data.password, 12)

    const newUser = {
      ...value,
      password: hashPassword
    }
    console.log( data.password, hashPassword)
    if (doesExist) {
      throw new Error(`${data.email} is already been registered`)
    }
    // //Await đến hàm GetDB rồi insert cái value đã validate vào
    // const result = await getDB().collection(userCollectionName).insertOne(value)
    // return await getDB().collection(userCollectionSchema).findOne(result.insertedId)
  } catch (error) {
    throw new Error(error)
  }
}

export const UserModel = {
  register
}
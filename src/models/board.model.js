import Joi from 'joi'
import { getDB } from '*/config/mongodb'
//Định nghĩa 'board' collection
const boardCollectionName = 'boards'
const boardCollectionSchema = Joi.object({
  title: Joi.string().required().min(3).max(20),
  columnOrder: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})

//Sử dụng abortEarly để hiển thị đầy đủ lỗi -> mặc định chỉ hiển thị line đầu tiên rồi dừng
const validateSchema = async (data) => {
  return await boardCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    //data đã được validate
    const value = await validateSchema(data)
    //Await đến hàm GetDB rồi insert cái value đã validate vào
    const result = await getDB().collection(boardCollectionName).insertOne(value)
    return await getDB().collection(boardCollectionName).findOne(result.insertedId)
  } catch (error) {
    console.log(error)
  }
}

export const BoardModel = {
  createNew
}
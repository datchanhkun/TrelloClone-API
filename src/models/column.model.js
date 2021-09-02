import Joi from 'joi'
import { getDB } from '*/config/mongodb'
//Định nghĩa 'column' collection
const columnCollectionName = 'columns'
const columnCollectionSchema = Joi.object({
  boardId: Joi.string().required(),
  title: Joi.string().required().min(3).max(20),
  cardOrder: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})

//Sử dụng abortEarly để hiển thị đầy đủ lỗi -> mặc định chỉ hiển thị line đầu tiên rồi dừng
const validateSchema = async (data) => {
  return await columnCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    //data đã được validate
    const value = await validateSchema(data)
    //Await đến hàm GetDB rồi insert cái value đã validate vào
    const result = await getDB().collection(columnCollectionName).insertOne(value)
    return await getDB().collection(columnCollectionName).findOne(result.insertedId)
  } catch (error) {
    console.log(error)
  }
}

export const ColumnModel = {
  createNew
}
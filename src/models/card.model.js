import Joi from 'joi'
import { getDB } from '*/config/mongodb'
import { ObjectId } from 'mongodb'

//Định nghĩa 'card' collection
const cardCollectionName = 'cards'
const cardCollectionSchema = Joi.object({
  boardId: Joi.string().required(), //Mặc định là string -> ObjectId để truy vấn
  columnId: Joi.string().required(), //Mặc định là string -> ObjectId để truy vấn
  title: Joi.string().required().min(3).max(30).trim(),
  cover: Joi.string().default(null),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})

//Sử dụng abortEarly để hiển thị đầy đủ lỗi -> mặc định chỉ hiển thị line đầu tiên rồi dừng
const validateSchema = async (data) => {
  return await cardCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    //data đã được validate
    const valueValidate = await validateSchema(data)
    //Clone lại value và ghi đè id từ string -> ObjectId
    const valueInsert = {
      ...valueValidate,
      boardId: ObjectId(valueValidate.boardId),
      columnId: ObjectId(valueValidate.columnId)
    }
    //Await đến hàm GetDB rồi insert cái value đã validate vào
    const result = await getDB().collection(cardCollectionName).insertOne(valueInsert)
    return await getDB().collection(cardCollectionName).findOne(result.insertedId)
  } catch (error) {
    throw new Error(error)
  }
}

/**
 *
 * @param {Array of string card id} ids
 */
const deleteMany = async (ids) => {
  try {
    //Chuyển đổi các phần tử id:string -> id:object trong mảng ids
    const transformIds = ids.map(i => ObjectId(i))
    //Await đến hàm GetDB rồi insert cái value đã validate vào
    const result = await getDB().collection(cardCollectionName).updateMany(
      { _id: { $in: transformIds } }, //Update những _id nào nằm trong mảng ids
      { $set: { _destroy: true } } //Update lại _destroy = true
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const CardModel = {
  createNew,
  deleteMany
}
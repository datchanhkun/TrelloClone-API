import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '*/config/mongodb'
//Định nghĩa 'column' collection
const columnCollectionName = 'columns'
const columnCollectionSchema = Joi.object({
  boardId: Joi.string().required(), //Mặc định là string -> ObjectId để truy vấn
  title: Joi.string().required().min(3).max(20).trim(),
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
    const valueValidate = await validateSchema(data)
    //Clone lại value và ghi đè id từ string -> ObjectId
    const valueInsert = {
      ...valueValidate,
      boardId: ObjectId(valueValidate.boardId)
    }
    //Await đến hàm GetDB rồi insert cái value đã validate vào
    const result = await getDB().collection(columnCollectionName).insertOne(valueInsert)
    return await getDB().collection(columnCollectionName).findOne(result.insertedId)
  } catch (error) {
    throw new Error(error)
  }
}

/**
 *
 * @param {string} boardId
 * @param {string} columnId
 */
const pushCardOrder = async (columnId, cardId) => {
  try {
    const result = await getDB().collection(columnCollectionName).findOneAndUpdate(
      { _id: ObjectId(columnId) }, //tìm đến id của column cần update
      { $push: { cardOrder: cardId } }, //push cardId vừa tạo vào CardOrder Array
      { returnDocument: 'after' } //trả về bản ghi đã update, true -> bản ghi chưa update
    )
    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    //Await đến hàm GetDB rồi insert cái value đã validate vào
    const result = await getDB().collection(columnCollectionName).findOneAndUpdate(
      { _id: ObjectId(id) }, //tìm đến id của column cần update
      { $set: data }, //data update từ service truyền qua
      { returnDocument: 'after' } //trả về bản ghi đã update, true -> bản ghi chưa update
    )
    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

export const ColumnModel = {
  createNew,
  pushCardOrder,
  update
}

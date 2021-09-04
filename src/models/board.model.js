import Joi from 'joi'
import { getDB } from '*/config/mongodb'
import { ObjectId } from 'mongodb'
//Định nghĩa 'board' collection
const boardCollectionName = 'boards'
const boardCollectionSchema = Joi.object({
  title: Joi.string().required().min(3).max(20).trim(),
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
    throw new Error(error)
  }
}
/**
 *
 * @param {string} boardId
 * @param {string} columnId
 */
const pushColumnOrder = async (boardId, columnId) => {
  try {
    const result = await getDB().collection(boardCollectionName).findOneAndUpdate(
      { _id: ObjectId(boardId) }, //tìm đến id của board cần update
      { $push: { columnOrder: columnId } }, //push columnId vừa tạo vào columnOrder Array
      { returnDocument: 'after' } //trả về bản ghi đã update, true -> bản ghi chưa update
    )
    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

const getFullBoard = async (boardId) => {
  try {
    //Await đến hàm GetDB rồi insert cái value đã validate vào
    const result = await getDB().collection(boardCollectionName).aggregate([
      {
        //So sánh _id trong db với id truyền vào, lọc _destroy: false->lookup
        $match: {
          _id: ObjectId(boardId),
          _destroy: false
        }
      },
      {
        //left join data từ collection columns
        $lookup: {
          from: 'columns', //collection name
          localField: '_id', //lấy ra cái _id vừa match được
          foreignField: 'boardId', // Key của collection -> so sánh với localField
          as: 'columns' //Key để hiển thị ra trong json
        }
      },
      {
        //left join data từ collection cards
        $lookup: {
          from: 'cards', //collection name
          localField: '_id', //lấy ra cái _id vừa match được
          foreignField: 'boardId', // Key của collection -> so sánh với localField
          as: 'cards' //Key để hiển thị ra trong json
        }
      }
    ]).toArray() //toArray -> để trả về duy nhất mảng không lấy mọi thứ trong mongodb trả về

    //trả về 1 object của array và trường hợp sai id thì trả về object rỗng
    return result[0] || {}
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    //Ghi đè id từ string thành objectID
    const updateData = { ...data }
    //Await đến hàm GetDB rồi insert cái value đã validate vào
    const result = await getDB().collection(boardCollectionName).findOneAndUpdate(
      { _id: ObjectId(id) }, //tìm đến id của column cần update
      { $set: updateData }, //data update từ service truyền qua
      { returnDocument: 'after' } //trả về bản ghi đã update, true -> bản ghi chưa update
    )
    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

export const BoardModel = {
  createNew,
  pushColumnOrder,
  getFullBoard,
  update
}
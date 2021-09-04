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

const update = async (id, data) => {
  try {
    //Ghi đè id từ string thành objectID
    const updateData = { ...data }
    //Kiểm tra nếu data đẩy lên server có tồn tại boardId thì convert boardId từ string -> objectID
    if (data.boardId) {
      updateData.boardId = ObjectId(data.boardId)
    }
    //Kiểm tra nếu data đẩy lên server có tồn tại columnId thì convert columnId từ string -> objectID
    if (data.columnId) {
      updateData.columnId = ObjectId(data.columnId)
    }
    //Await đến hàm GetDB rồi insert cái value đã validate vào
    const result = await getDB().collection(cardCollectionName).findOneAndUpdate(
      { _id: ObjectId(id) }, //tìm đến id của column cần update
      { $set: updateData }, //data update từ service truyền qua
      { returnDocument: 'after' } //trả về bản ghi đã update, true -> bản ghi chưa update
    )
    return result.value
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
  update,
  deleteMany
}
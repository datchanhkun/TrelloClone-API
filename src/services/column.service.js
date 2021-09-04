import { ColumnModel } from '*/models/column.model'
import { BoardModel } from '*/models/board.model'
import { CardModel } from '*/models/card.model'
const createNew = async (data) => {
  try {
    const newColumn = await ColumnModel.createNew(data)
    newColumn.cards = []
    //update columnOrder Array in board Collection
    const boardId = newColumn.boardId.toString()
    const newColumnId = newColumn._id.toString()
    await BoardModel.pushColumnOrder(boardId, newColumnId)
    return newColumn
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }
    //fix lỗi call api
    if (updateData._id) delete updateData._id
    if (updateData.cards) delete updateData.cards


    const updatedColumn = await ColumnModel.update(id, updateData)
    //Kiểm tra _destroy: true thì delete many cards in this column
    if (updatedColumn._destroy) {
      CardModel.deleteMany(updatedColumn.cardOrder)
    }
    return updatedColumn
  } catch (error) {
    throw new Error(error)
  }
}


export const columnService = {
  createNew,
  update
}

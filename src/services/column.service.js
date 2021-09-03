import { ColumnModel } from '*/models/column.model'
import { BoardModel } from '*/models/board.model'
const createNew = async (data) => {
  try {
    const newColumn = await ColumnModel.createNew(data)

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
    const result = await ColumnModel.update(id, updateData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}


export const columnService = {
  createNew,
  update
}

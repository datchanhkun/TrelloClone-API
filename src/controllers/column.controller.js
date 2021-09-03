import { columnService } from '*/services/column.service'
import { HttpStatusCode } from '*/utilities/constants'

const createNew = async (req, res) => {
  try {
    const result = await columnService.createNew(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error
    })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params //id column update
    const result = await columnService.update(id, req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error
    })
  }
}

export const columnController = {
  createNew,
  update
}
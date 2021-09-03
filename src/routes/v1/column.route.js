import express from 'express'
import { columnController } from '*/controllers/column.controller'
import { columnValidation } from '*/validations/column.validation'

const router = express.Router()

//create column
router.route('/')
  .post(columnValidation.createNew, columnController.createNew)

//update column
router.route('/:id')
  .put(columnValidation.update, columnController.update)
export const columnRoutes = router
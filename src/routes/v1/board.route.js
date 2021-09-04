import express from 'express'
import { boardController } from '*/controllers/board.controller'
import { boardValidation } from '*/validations/board.validation'

const router = express.Router()

//Route Create new Board
router.route('/')
  .post(boardValidation.createNew, boardController.createNew)
//Route get full board
router.route('/:id')
  .get(boardController.getFullBoard)
  .put(boardValidation.update, boardController.update)
export const boardRoutes = router
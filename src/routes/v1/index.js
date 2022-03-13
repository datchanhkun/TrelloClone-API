import express from 'express'
import { HttpStatusCode } from '*/utilities/constants'
import { boardRoutes } from './board.route'
import { columnRoutes } from './column.route'
import { cardRoutes } from './card.route'
import { userRoutes } from './user.route'
const router = express.Router()

//GET v1/status
router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({ status: 'OK!' }))
/* Board APIs */
router.use('/boards', boardRoutes)
/* Column APIs */
router.use('/columns', columnRoutes)
/* Column APIs */
router.use('/cards', cardRoutes)
/* Auth User APIs */
router.use('/auth', userRoutes)

export const apiV1 = router
import express from 'express'
import { HttpStatusCode } from '*/utilities/constants'
import { boardRoutes } from './board.route'

const router = express.Router()

//GET v1/status
router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({ status: 'OK!' }))

router.use('/boards', boardRoutes)
/* Board APIs */
export const apiV1 = router
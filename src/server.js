import express from 'express'
import { connectDB } from '*/config/mongodb'
import { env } from '*/config/environment'
import { BoardModel } from '*/models/board.model'

//Connect DB
connectDB()
  .then(() => console.log('Connected to MongoDB Server Successfully!'))
  .then(() => bootServer())
  .catch(error => {
    console.log(error)
    process.exit(1) //crash app
  })

const bootServer = () => {
  const app = express()

  app.get('/test', async (req, res) => {
    let fakeData = {
      title: 'board-1'
    }
    const newBoard = await BoardModel.createNew(fakeData)
    console.log(newBoard)
    res.end('test nodejs')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`App is running at ${env.APP_HOST}:${env.APP_PORT}`)
  })
}

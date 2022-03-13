import express from 'express'
import cors from 'cors'
import { connectDB } from '*/config/mongodb'
// import { env } from '*/config/environment'
import { apiV1 } from '*/routes/v1'
import corsOptions from '*/config/cors'
//Connect DB
connectDB()
  .then(() => console.log('Connected to MongoDB Server Successfully!'))
  .then(() => bootServer())
  .catch(error => {
    console.log(error)
    process.exit(1) //crash app
  })
const PORT = process.env.PORT || 5000
const bootServer = () => {
  const app = express()

  app.use(cors(corsOptions))
  //Enable req.body data
  app.use(express.json())

  //Use APIs v1
  app.use('/v1', apiV1)

  // app.listen(env.APP_PORT, env.APP_HOST, () => {
  //   console.log(`App is running at ${env.APP_HOST}:${env.APP_PORT}`)
  // })
  app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`)
  })
}

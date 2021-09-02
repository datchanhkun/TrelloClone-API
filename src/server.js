import express from 'express'
import { connectDB } from '*/config/mongodb'
import { env } from '*/config/environment'

const app = express()

//Connect DB
connectDB().catch(console.log)
app.get('/', (req, res) => {
  res.end('test nodejs')
})

app.listen(env.PORT, env.HOST, () => {
  console.log(`App is running at ${env.HOST}:${env.PORT}`)
})


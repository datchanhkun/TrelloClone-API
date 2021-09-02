import { MongoClient } from 'mongodb'
import { env } from '*/config/environment'

let dbInstance = null


//Connection URL
const uri = env.MONGODB_URI

export const connectDB = async () => {
  const client = new MongoClient(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  //Connect the client to the server
  await client.connect()

  //Gán clientDB cho dbInstance
  dbInstance = client.db(env.DATABASE_NAME)
}

//Get Database Instance
export const getDB = () => {
  //Khi dbInstance chưa kết nối được thì throw error message
  if (!dbInstance) throw new Error('Must connect to Database first!')
  return dbInstance
}

// const listDatabases = async (client) => {
//   const databasesList = await client.db().admin().listDatabases()
//   console.log(databasesList)
//   console.log('Your Databases List: ')
//   databasesList.databases.forEach(db => console.log(` - ${db.name}`))
// }


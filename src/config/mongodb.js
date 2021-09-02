import { MongoClient } from 'mongodb'
import { env } from '*/config/environment'

//Connection URL
const uri = env.MONGODB_URI

export const connectDB = async () => {
  const client = new MongoClient(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })

  try {
    //Connect the client to the server
    await client.connect()
    console.log('Connected Successfully to server!')

    //List databases
    await listDatabases(client)
  } finally {
    // Đảm bảo client sẽ đóng connect khi kết thúc hoặc gặp lỗi
    await client.close()
  }
}

const listDatabases = async (client) => {
  const databasesList = await client.db().admin().listDatabases()
  console.log(databasesList)
  console.log('Your Databases List: ')
  databasesList.databases.forEach(db => console.log(` - ${db.name}`))
}
//fixing git

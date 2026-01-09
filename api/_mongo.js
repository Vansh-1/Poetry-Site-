import { MongoClient } from 'mongodb'

const mongoUri = process.env.MONGODB_URI

if (!mongoUri) {
  throw new Error('MONGODB_URI is not set in environment variables')
}

let client
let db
let contentCollection
let messagesCollection

export async function getMongo() {
  if (!client) {
    client = new MongoClient(mongoUri)
    await client.connect()
    console.log('Connected to MongoDB')
  }

  if (!db) {
    db = client.db('poetry_site')
  }

  if (!contentCollection) {
    contentCollection = db.collection('writer_content')
    await contentCollection.updateOne(
      { _id: 1 },
      {
        $setOnInsert: {
          english_micro: '',
          hinglish_micro: '',
          hinglish_shayari: '',
        },
      },
      { upsert: true },
    )
  }

  if (!messagesCollection) {
    messagesCollection = db.collection('messages')
  }

  return { contentCollection, messagesCollection }
}

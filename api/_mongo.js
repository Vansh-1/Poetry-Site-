import { MongoClient } from 'mongodb'

const mongoUri = process.env.MONGODB_URI

if (!mongoUri) {
  throw new Error('MONGODB_URI is not set in environment variables')
}

let client
let db
let englishCollection
let hinglishMicroCollection
let shayariCollection
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

  if (!englishCollection) {
    englishCollection = db.collection('english_micro')
    await englishCollection.updateOne(
      { _id: 1 },
      {
        $setOnInsert: {
          text: '',
        },
      },
      { upsert: true },
    )
  }

  if (!hinglishMicroCollection) {
    hinglishMicroCollection = db.collection('hinglish_micro')
    await hinglishMicroCollection.updateOne(
      { _id: 1 },
      {
        $setOnInsert: {
          text: '',
        },
      },
      { upsert: true },
    )
  }

  if (!shayariCollection) {
    shayariCollection = db.collection('hinglish_shayari')
    await shayariCollection.updateOne(
      { _id: 1 },
      {
        $setOnInsert: {
          text: '',
        },
      },
      { upsert: true },
    )
  }

  if (!messagesCollection) {
    messagesCollection = db.collection('messages')
  }

  return {
    englishCollection,
    hinglishMicroCollection,
    shayariCollection,
    messagesCollection,
  }
}

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')

const app = express()
const port = process.env.PORT || 3001

// MongoDB connection URI (MongoDB Atlas)
const mongoUri = process.env.MONGODB_URI
if (!mongoUri) {
  console.error('MONGODB_URI is not set in .env')
  process.exit(1)
}

let client
let db
let collection
let messagesCollection

async function initMongo() {
  if (collection && db && messagesCollection) return { collection, messagesCollection }

  if (!client) {
    client = new MongoClient(mongoUri)
    await client.connect()
    console.log('Connected to MongoDB')
  }

  if (!db) {
    db = client.db('poetry_site') // you can rename this DB in the URI if you want
  }

  if (!collection) {
    collection = db.collection('writer_content')

    // Ensure there is always a single document we read/write for main content
    await collection.updateOne(
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

  return { collection, messagesCollection }
}

app.use(cors())
app.use(express.json())

// Main content (writer-controlled section)
app.get('/api/content', async (_req, res) => {
  try {
    const { collection: coll } = await initMongo()
    const doc = (await coll.findOne({ _id: 1 })) || {}

    res.json({
      englishMicro: doc.english_micro || '',
      hinglishMicro: doc.hinglish_micro || '',
      hinglishShayari: doc.hinglish_shayari || '',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch content' })
  }
})

app.put('/api/content', async (req, res) => {
  const { englishMicro, hinglishMicro, hinglishShayari } = req.body || {}

  try {
    const { collection: coll } = await initMongo()

    await coll.updateOne(
      { _id: 1 },
      {
        $set: {
          english_micro: englishMicro || '',
          hinglish_micro: hinglishMicro || '',
          hinglish_shayari: hinglishShayari || '',
        },
      },
      { upsert: true },
    )

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save content' })
  }
})

// People & Me interaction messages
app.get('/api/messages', async (_req, res) => {
  try {
    const { messagesCollection: msgs } = await initMongo()

    const results = await msgs
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray()

    const formatted = results.map((m) => ({
      id: m._id,
      name: m.name || 'Someone',
      message: m.message || '',
      createdAt: m.createdAt,
    }))

    res.json({ messages: formatted })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

app.post('/api/messages', async (req, res) => {
  const { name, message } = req.body || {}

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' })
  }

  try {
    const { messagesCollection: msgs } = await initMongo()

    const doc = {
      name: typeof name === 'string' && name.trim() ? name.trim() : 'Anonymous',
      message: message.trim(),
      createdAt: new Date(),
    }

    const result = await msgs.insertOne(doc)

    res.status(201).json({
      id: result.insertedId,
      ...doc,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save message' })
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

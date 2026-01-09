import { getMongo } from './_mongo.js'

export default async function handler(req, res) {
  const { method } = req

  try {
    const { messagesCollection } = await getMongo()

    if (method === 'GET') {
      const results = await messagesCollection
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

      return res.status(200).json({ messages: formatted })
    }

    if (method === 'POST') {
      const { name, message } = req.body || {}

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' })
      }

      const doc = {
        name: typeof name === 'string' && name.trim() ? name.trim() : 'Anonymous',
        message: message.trim(),
        createdAt: new Date(),
      }

      const result = await messagesCollection.insertOne(doc)

      return res.status(201).json({
        id: result.insertedId,
        ...doc,
      })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${method} Not Allowed`)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to handle messages request' })
  }
}

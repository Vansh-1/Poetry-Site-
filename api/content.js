import { getMongo } from './_mongo.js'

export default async function handler(req, res) {
  const { method } = req

  try {
    const { contentCollection } = await getMongo()

    if (method === 'GET') {
      const doc = (await contentCollection.findOne({ _id: 1 })) || {}

      return res.status(200).json({
        englishMicro: doc.english_micro || '',
        hinglishMicro: doc.hinglish_micro || '',
        hinglishShayari: doc.hinglish_shayari || '',
      })
    }

    if (method === 'PUT') {
      const { englishMicro, hinglishMicro, hinglishShayari } = req.body || {}

      await contentCollection.updateOne(
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

      return res.status(200).json({ success: true })
    }

    res.setHeader('Allow', ['GET', 'PUT'])
    return res.status(405).end(`Method ${method} Not Allowed`)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to handle content request' })
  }
}

import { getMongo } from './_mongo.js'

const writerSecret = process.env.WRITER_SECRET

export default async function handler(req, res) {
  const { method } = req

  try {
    const { englishCollection, hinglishMicroCollection, shayariCollection } =
      await getMongo()

    if (method === 'GET') {
      const englishDoc = (await englishCollection.findOne({ _id: 1 })) || {}
      const hinglishMicroDoc =
        (await hinglishMicroCollection.findOne({ _id: 1 })) || {}
      const shayariDoc = (await shayariCollection.findOne({ _id: 1 })) || {}

      return res.status(200).json({
        englishMicro: englishDoc.text || '',
        hinglishMicro: hinglishMicroDoc.text || '',
        hinglishShayari: shayariDoc.text || '',
      })
    }

    if (method === 'PUT') {
      const { englishMicro, hinglishMicro, hinglishShayari } = req.body || {}

      // Only allow updates if the correct writer secret header is present
      if (writerSecret) {
        const provided = req.headers['x-writer-secret']
        if (!provided || provided !== writerSecret) {
          return res.status(403).json({ error: 'Not allowed to update content' })
        }
      }

      await englishCollection.updateOne(
        { _id: 1 },
        {
          $set: {
            text: englishMicro || '',
          },
        },
        { upsert: true },
      )

      await hinglishMicroCollection.updateOne(
        { _id: 1 },
        {
          $set: {
            text: hinglishMicro || '',
          },
        },
        { upsert: true },
      )

      await shayariCollection.updateOne(
        { _id: 1 },
        {
          $set: {
            text: hinglishShayari || '',
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

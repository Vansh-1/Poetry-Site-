require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
const port = process.env.PORT || 3001

// Prefer DATABASE_URL for compatibility, but fall back to STACK_SECRET_SERVER_KEY
const connectionString =
  process.env.DATABASE_URL || process.env.STACK_SECRET_SERVER_KEY

const pool = new Pool({
  connectionString,
})

app.use(cors())
app.use(express.json())

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS writer_content (
      id INTEGER PRIMARY KEY,
      english_micro TEXT,
      hinglish_micro TEXT,
      hinglish_shayari TEXT
    );
  `)

  await pool.query(
    `INSERT INTO writer_content (id, english_micro, hinglish_micro, hinglish_shayari)
     VALUES (1, '', '', '')
     ON CONFLICT (id) DO NOTHING;`,
  )
}

app.get('/api/content', async (_req, res) => {
  try {
    await ensureTable()
    const { rows } = await pool.query('SELECT * FROM writer_content WHERE id = 1;')
    const row = rows[0] || {}

    res.json({
      englishMicro: row.english_micro || '',
      hinglishMicro: row.hinglish_micro || '',
      hinglishShayari: row.hinglish_shayari || '',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch content' })
  }
})

app.put('/api/content', async (req, res) => {
  const { englishMicro, hinglishMicro, hinglishShayari } = req.body || {}

  try {
    await ensureTable()
    await pool.query(
      `UPDATE writer_content
       SET english_micro = $1,
           hinglish_micro = $2,
           hinglish_shayari = $3
       WHERE id = 1;`,
      [englishMicro || '', hinglishMicro || '', hinglishShayari || ''],
    )

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save content' })
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

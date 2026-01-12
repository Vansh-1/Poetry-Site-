import React, { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [englishMicro, setEnglishMicro] = useState(
    'We were a poem left unfinished,\na bookmark in a story we never confessed.',
  )
  const [hinglishMicro, setHinglishMicro] = useState(
    '"Theek ho na?" poocha usne,\n"Haan" likh ke maine, poora sach mita diya.',
  )
  const [hinglishShayari, setHinglishShayari] = useState(
    'Raat ki siyahi mein teri yaadein ghulti rahi,\ndil ne har dhadkan par tera naam likh daala.',
  )
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // People & Me interaction box state (we only send to DB, not show history)
  const [guestName, setGuestName] = useState('')
  const [guestMessage, setGuestMessage] = useState('')
  const [submittingMessage, setSubmittingMessage] = useState(false)
  const [messageError, setMessageError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/content')
        if (!res.ok) return
        const data = await res.json()
        if (data.englishMicro) setEnglishMicro(data.englishMicro)
        if (data.hinglishMicro) setHinglishMicro(data.hinglishMicro)
        if (data.hinglishShayari) setHinglishShayari(data.hinglishShayari)
      } catch (err) {
        console.error(err)
      }
    }

    load()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      setSaveMessage('')
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          englishMicro,
          hinglishMicro,
          hinglishShayari,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')
      setSaveMessage('Saved to database ✅')
    } catch (err) {
      console.error(err)
      setSaveMessage('Error saving to database')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessageError('')

    if (!guestMessage.trim()) {
      setMessageError('Write a few words before sending.')
      return
    }

    try {
      setSubmittingMessage(true)
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: guestName,
          message: guestMessage,
        }),
      })

      if (!res.ok) throw new Error('Failed to send message')

      const data = await res.json()
      // We don't show past messages on screen, just clear the box after saving.
      console.debug('Saved message to DB', data)
      setGuestMessage('')
    } catch (err) {
      console.error(err)
      setMessageError('Something went wrong while sending your words.')
    } finally {
      setSubmittingMessage(false)
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-tag">Poety • Shayari • Stories</p>
          <h1 className="hero-title">Whispers of the Heart</h1>
          <p className="hero-subtitle">
            Soulful <span>Hindi</span> and <span>English</span> words, crafted to
            heal, inspire, and stay with you long after you&apos;ve left.
          </p>
          <div className="hero-actions">
            <a href="#featured" className="btn btn-primary">
              Read Featured Pieces
            </a>
            <a href="#about" className="btn btn-ghost">
              About the Poet
            </a>
          </div>
        </div>
      </header>

      <main className="main">
        <section id="featured" className="section">
          <div className="section-header">
            <p className="section-eyebrow">Start reading</p>
            <h2 className="section-title">Micro Tales & Shayari</h2>
            <p className="section-description">
              Short, sharp feelings you can read in seconds and feel for hours.
            </p>
          </div>

          <div className="grid">
            {/* 1 — Micro Tales in English */}
            <article className="card poem">
              <p className="pill">Micro Tale • English</p>
              <h3 className="card-title">Almost Love</h3>
              <p className="card-snippet">
                {englishMicro.split('\n').map((line) => (
                  <>
                    {line}
                    <br />
                  </>
                ))}
              </p>
              <button className="read-more">More micro tales</button>
            </article>

            {/* 2 — Hindi emotions written in English letters */}
            <article className="card poem">
              <p className="pill">Micro Tale • Hindi (English script)</p>
              <h3 className="card-title">Adhoori Baat</h3>
              <p className="card-snippet">
                {hinglishMicro.split('\n').map((line) => (
                  <>
                    {line}
                    <br />
                  </>
                ))}
              </p>
              <button className="read-more">Read more in Hinglish</button>
            </article>

            {/* 3 — Pure Shayari (Hindi in English letters) */}
            <article className="card poem">
              <p className="pill">Shayari • Hinglish</p>
              <h3 className="card-title">Raat Ki Siyahi</h3>
              <p className="card-snippet">
                {hinglishShayari.split('\n').map((line) => (
                  <>
                    {line}
                    <br />
                  </>
                ))}
              </p>
              <button className="read-more">More shayari</button>
            </article>
          </div>
        </section>

        <section id="about" className="section section-alt">
          <div className="about">
            <div className="about-highlight" />
            <div className="about-content">
              <p className="section-eyebrow">About the writer</p>
              <h2 className="section-title">Vansh — a heart that writes</h2>
              <p className="section-description">
                This space is a safe corner of the internet for overthinkers,
                silent lovers, night owls, and old-school romantics. Every
                piece is drawn from real emotions — yours, mine, ours.
              </p>
              <p className="section-description">
                Whether you&apos;re here for healing, nostalgia, or just a
                beautifully written line to send someone special, stay a
                while — you might find your feelings put into words.
              </p>
              <div className="about-meta">
                <div>
                  <p className="meta-number">2</p>
                  <p className="meta-label">Languages</p>
                </div>
                <div>
                  <p className="meta-number">∞</p>
                  <p className="meta-label">Emotions</p>
                </div>
                <div>
                  <p className="meta-number">Daily</p>
                  <p className="meta-label">New lines</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Writer controls */}
        <section className="section section-writer" id="writer">
          <div className="section-header">
            <p className="section-eyebrow">Writer&apos;s Corner</p>
            <h2 className="section-title">Update your lines</h2>
            <p className="section-description">
              Use these boxes to quickly update what readers see in the three
              cards above. Changes are local to your browser for now.
            </p>
          </div>

          <div className="writer-grid">
            <div className="writer-card">
              <p className="pill">Micro Tale • English</p>
              <label className="writer-label">Lines shown in first card</label>
              <textarea
                className="writer-textarea"
                value={englishMicro}
                onChange={(e) => setEnglishMicro(e.target.value)}
              />
            </div>

            <div className="writer-card">
              <p className="pill">Micro Tale • Hinglish</p>
              <label className="writer-label">
                Hindi feelings written in English letters
              </label>
              <textarea
                className="writer-textarea"
                value={hinglishMicro}
                onChange={(e) => setHinglishMicro(e.target.value)}
              />
            </div>

            <div className="writer-card">
              <p className="pill">Shayari • Hinglish</p>
              <label className="writer-label">Lines shown in third card</label>
              <textarea
                className="writer-textarea"
                value={hinglishShayari}
                onChange={(e) => setHinglishShayari(e.target.value)}
              />
            </div>
          </div>

          <div className="writer-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save all to database'}
            </button>
            {saveMessage && <p className="save-message">{saveMessage}</p>}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <p className="section-eyebrow">People &amp; Me</p>
            <h2 className="section-title">Random chat corner</h2>
            <p className="section-description">
              Not a newsletter, not a form — just a tiny chat space where you
              and I can drop thoughts, lines, and late-night feelings.
            </p>
          </div>

          <div className="interaction chat-box">
            {/* We keep this as a private box: messages go to the database only. */}
            <form className="chat-input" onSubmit={handleSubmitMessage}>
                type="text"
                placeholder="Your name (optional)"
                className="input chat-name-input"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
              <textarea
                className="writer-textarea chat-textarea"
                placeholder="Type a message like you would in a DM…"
                value={guestMessage}
                onChange={(e) => setGuestMessage(e.target.value)}
              />
              <div className="interaction-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingMessage}
                >
                  {submittingMessage ? 'Sending…' : 'Send'}
                </button>
                {messageError && <p className="save-message">{messageError}</p>}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Pinak • Poetry & Shayari</p>
        <p className="footer-note">
          Crafted with love, late nights, and way too much overthinking.
        </p>
      </footer>
    </div>
  )
}

export default App

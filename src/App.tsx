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

  // Simple routing: normal visitors at "/" (viewer), you at "/editor" (editor)
  const [route, setRoute] = useState<'viewer' | 'editor'>('viewer')

  // Which piece is currently being read (acts like 3 separate pages)
  const [activePiece, setActivePiece] = useState<
    'english' | 'hinglishMicro' | 'hinglishShayari'
  >('english')

  // Writer controls state
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isWriter, setIsWriter] = useState(false)
  const [writerSecret, setWriterSecret] = useState('')
  const [writerKeyInput, setWriterKeyInput] = useState('')
  const [writerAuthError, setWriterAuthError] = useState('')

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

    // decide route based on query ?editor=1
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const isEditor = params.get('editor') === '1'
        setRoute(isEditor ? 'editor' : 'viewer')
      }
    } catch (err) {
      console.error(err)
    }

    load()
  }, [])

  // Load writer secret from localStorage (so only you can save)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('writerSecret')
      if (stored) {
        setWriterSecret(stored)
        setIsWriter(true)
      }
    } catch (err) {
      console.error(err)
    }
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      setSaveMessage('')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (writerSecret) {
        // This header is checked on the server so only you can write
        ;(headers as any)['x-writer-secret'] = writerSecret
      }

      const res = await fetch('/api/content', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          englishMicro,
          hinglishMicro,
          hinglishShayari,
        }),
      })

      if (!res.ok) {
        if (res.status === 403) {
          setIsWriter(false)
          setSaveMessage('You are not allowed to save. Enter your writer key.')
          return
        }
        throw new Error('Failed to save')
      }

      setSaveMessage('Saved to database ✅')
    } catch (err) {
      console.error(err)
      if (!saveMessage) setSaveMessage('Error saving to database')
    } finally {
      setSaving(false)
    }
  }

  const handleWriterLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = writerKeyInput.trim()
    if (!trimmed) {
      setWriterAuthError('Enter your writer key to unlock editing.')
      return
    }
    setWriterSecret(trimmed)
    setIsWriter(true)
    setWriterAuthError('')
    try {
      localStorage.setItem('writerSecret', trimmed)
    } catch (err) {
      console.error(err)
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
              Choose a section to read — English, Hinglish micro, or full shayari.
            </p>
          </div>

          {/* Simple tabs to act like 3 separate pages */}
          <div className="piece-tabs">
            <button
              type="button"
              className={
                'btn tab-btn ' + (activePiece === 'english' ? 'tab-btn-active' : '')
              }
              onClick={() => setActivePiece('english')}
            >
              English micro tale
            </button>
            <button
              type="button"
              className={
                'btn tab-btn ' + (activePiece === 'hinglishMicro' ? 'tab-btn-active' : '')
              }
              onClick={() => setActivePiece('hinglishMicro')}
            >
              Hinglish micro
            </button>
            <button
              type="button"
              className={
                'btn tab-btn ' +
                (activePiece === 'hinglishShayari' ? 'tab-btn-active' : '')
              }
              onClick={() => setActivePiece('hinglishShayari')}
            >
              Full shayari
            </button>
          </div>

          <div className="piece-panel">
            {activePiece === 'english' && (
              <article className="card poem">
                <p className="pill">Micro Tale • English</p>
                <h3 className="card-title">Almost Love</h3>
                <p className="card-snippet">
                  {englishMicro.split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </article>
            )}

            {activePiece === 'hinglishMicro' && (
              <article className="card poem">
                <p className="pill">Micro Tale • Hindi (English script)</p>
                <h3 className="card-title">Adhoori Baat</h3>
                <p className="card-snippet">
                  {hinglishMicro.split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </article>
            )}

            {activePiece === 'hinglishShayari' && (
              <article className="card poem">
                <p className="pill">Shayari • Hinglish</p>
                <h3 className="card-title">Raat Ki Siyahi</h3>
                <p className="card-snippet">
                  {hinglishShayari.split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </article>
            )}
          </div>
        </section>

        <section id="about" className="section section-alt">
          <div className="about">
            <div className="about-highlight" />
            <div className="about-content">
              <p className="section-eyebrow">About the writer</p>
              <h2 className="section-title">Vansh — A heart that writes</h2>
              <p className="section-description">
                This space is a safe corner of the internet for overthinkers,
                silent lovers, night owls, and old-school romantics. Every
                piece is drawn from real emotions yours, mine, ours.
              </p>
              <p className="section-description">
                Whether you&apos;re here for healing, nostalgia, or just a
                beautifully written line to send someone special, stay a
                while, you might find your feelings put into words.
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

        {/* Writer controls — only visible on /editor route */}
        {route === 'editor' && (
          <section className="section section-writer" id="writer">
          <div className="section-header">
            <p className="section-eyebrow">Writer&apos;s Corner</p>
            <h2 className="section-title">Update your lines</h2>
            <p className="section-description">
              Only you can edit and save to the database. Visitors can read, but
              they can&apos;t change the words.
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
                disabled={!isWriter}
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
                disabled={!isWriter}
              />
            </div>

            <div className="writer-card">
              <p className="pill">Shayari • Hinglish</p>
              <label className="writer-label">Lines shown in third card</label>
              <textarea
                className="writer-textarea"
                value={hinglishShayari}
                onChange={(e) => setHinglishShayari(e.target.value)}
                disabled={!isWriter}
              />
            </div>
          </div>

          <div className="writer-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving || !isWriter}
            >
              {saving ? 'Saving…' : 'Save all to database'}
            </button>
            {saveMessage && <p className="save-message">{saveMessage}</p>}
          </div>

          <div className="writer-auth">
            <p className="section-description">Writer login (only you know this key)</p>
            <form className="writer-auth-form" onSubmit={handleWriterLogin}>
              <input
                type="password"
                placeholder="Enter writer key to unlock editing"
                className="input"
                value={writerKeyInput}
                onChange={(e) => setWriterKeyInput(e.target.value)}
              />
              <button type="submit" className="btn btn-ghost">
                Unlock writer mode
              </button>
            </form>
            {writerAuthError && <p className="save-message">{writerAuthError}</p>}
          </div>
        </section>
        )}

        <section className="section">
          <div className="section-header">
            <p className="section-eyebrow">People &amp; Me</p>
            <h2 className="section-title">Random chat corner</h2>
            <p className="section-description">
              Not a newsletter, not a form, Just a tiny chat space where you
              and I can drop thoughts, lines, and late-night feelings.
            </p>
          </div>

          <div className="interaction chat-box">
            {/* We keep this as a private box: messages go to the database only. */}
            <form className="chat-input" onSubmit={handleSubmitMessage}>
              <input
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
        <p>© {new Date().getFullYear()} Vansh • Poetry & Shayari</p>
        <p className="footer-note">
          Crafted with love, late nights, and way too much overthinking.
        </p>
      </footer>
    </div>
  )
}

export default App

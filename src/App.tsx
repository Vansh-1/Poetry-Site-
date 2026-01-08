import { useState } from 'react'
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

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-tag">Poetry • Shayari • Stories</p>
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
              <h2 className="section-title">Pinak — a heart that writes</h2>
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
        </section>

        <section className="section">
          <div className="section-header">
            <p className="section-eyebrow">Stay connected</p>
            <h2 className="section-title">Get a piece in your inbox</h2>
            <p className="section-description">
              No spam. Just occasional verses, thoughts, and
              heart-to-heart letters from me.
            </p>
          </div>

          <form
            className="subscribe"
            onSubmit={(e) => {
              e.preventDefault()
              alert('Thank you for subscribing to my poetry!')
            }}
          >
            <input
              type="email"
              required
              placeholder="Your best email address"
              className="input"
            />
            <button type="submit" className="btn btn-primary">
              Notify me
            </button>
          </form>
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

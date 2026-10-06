import React, { useEffect, useState, useRef } from "react";

const birthday = new Date(2026, 9, 7);

function getTimeLeft() {
  const difference = birthday.getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isBirthday: true };
  }

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference % 86_400_000) / 3_600_000),
    minutes: Math.floor((difference % 3_600_000) / 60_000),
    seconds: Math.floor((difference % 60_000) / 1000),
    isBirthday: false,
  };
}

const memories = [
  {
    number: "01",
    title: "Your Smile",
    detail: "My favourite view in the entire world, lighting up every room you walk into.",
    icon: "✨",
  },
  {
    number: "02",
    title: "Your Heart",
    detail: "The kindest, warmest, and most caring place I have ever known.",
    icon: "💖",
  },
  {
    number: "03",
    title: "Our Story",
    detail: "My absolute favourite journey is the one we are creating together day by day.",
    icon: "🌸",
  },
];

const galleryPhotos = [
  { src: "/photos/richa-1.jpg", caption: "Radiant & Beautiful — Birthday Girl" },
  { src: "/photos/richa-2.jpg", caption: "Sweet Moments & Endless Smiles" },
  { src: "/photos/richa-3.jpg", caption: "Elegance & Grace in Every Frame" },
  { src: "/photos/richa-4.jpg", caption: "Unforgettable Memories Together" },
  { src: "/photos/richa-5.jpg", caption: "Celebrating You Today & Always" },
];

// Web Audio API Sound Synthesizer (No external assets required)
function playIgniteSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.07);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + index * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.07 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + index * 0.07);
      osc.stop(ctx.currentTime + index * 0.07 + 0.5);
    });
  } catch (e) {
    // Audio context fallback
  }
}

function playBlowOutSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(380, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
}

export default function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const [surpriseIsOpen, setSurpriseIsOpen] = useState(false);
  const [candleLit, setCandleLit] = useState(false); // Default unlit so clicking lights it!
  const [celebration, setCelebration] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);
  const [sparkles, setSparkles] = useState([]);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const musicCtxRef = useRef(null);
  const musicTimerRef = useRef(null);

  // Background Birthday Chime Music Synthesizer
  const toggleMusic = () => {
    if (isPlayingMusic) {
      if (musicTimerRef.current) clearTimeout(musicTimerRef.current);
      if (musicCtxRef.current) {
        musicCtxRef.current.close();
        musicCtxRef.current = null;
      }
      setIsPlayingMusic(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        musicCtxRef.current = ctx;

        const melody = [
          { f: 392.00, d: 0.35 }, { f: 392.00, d: 0.35 }, { f: 440.00, d: 0.7 }, { f: 392.00, d: 0.7 }, { f: 523.25, d: 0.7 }, { f: 493.88, d: 1.1 },
          { f: 392.00, d: 0.35 }, { f: 392.00, d: 0.35 }, { f: 440.00, d: 0.7 }, { f: 392.00, d: 0.7 }, { f: 587.33, d: 0.7 }, { f: 523.25, d: 1.1 },
          { f: 392.00, d: 0.35 }, { f: 392.00, d: 0.35 }, { f: 783.99, d: 0.7 }, { f: 659.25, d: 0.7 }, { f: 523.25, d: 0.7 }, { f: 493.88, d: 0.7 }, { f: 440.00, d: 0.9 },
          { f: 698.46, d: 0.35 }, { f: 698.46, d: 0.35 }, { f: 659.25, d: 0.7 }, { f: 523.25, d: 0.7 }, { f: 587.33, d: 0.7 }, { f: 523.25, d: 1.3 }
        ];

        let idx = 0;
        const playNext = () => {
          if (!musicCtxRef.current || musicCtxRef.current.state === "closed") return;
          const note = melody[idx];
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(note.f, ctx.currentTime);
          gain.gain.setValueAtTime(0.09, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.d * 0.95);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + note.d);

          idx = (idx + 1) % melody.length;
          musicTimerRef.current = setTimeout(playNext, note.d * 1000 + 40);
        };

        playNext();
        setIsPlayingMusic(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (musicTimerRef.current) clearTimeout(musicTimerRef.current);
      if (musicCtxRef.current) musicCtxRef.current.close();
    };
  }, []);

  // Update scene scroll & cursor glow
  useEffect(() => {
    const updateScene = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
    };
    const moveGlow = (event) => {
      document.documentElement.style.setProperty("--glow-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--glow-y", `${event.clientY}px`);
    };

    updateScene();
    window.addEventListener("scroll", updateScene, { passive: true });
    window.addEventListener("pointermove", moveGlow, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScene);
      window.removeEventListener("pointermove", moveGlow);
    };
  }, []);

  // Cake Click Handler: Light up candle, trigger particle burst & sound!
  const handleCakeClick = (event) => {
    const nextState = !candleLit;
    setCandleLit(nextState);

    if (nextState) {
      // Candle is now LIT!
      playIgniteSound();
      setCelebration((count) => count + 1);

      // Generate dynamic sparkle particle burst from click coordinates / cake tip
      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.15; // Near candle top

      const newSparkles = Array.from({ length: 32 }, (_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        const speed = 40 + Math.random() * 90;
        return {
          id: Date.now() + i,
          x: centerX,
          y: centerY,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed - 30, // upward bias
          size: 4 + Math.random() * 8,
          color: ["#f2b86b", "#ed9d9a", "#fff5ed", "#ffd700", "#ff69b4"][i % 5],
          duration: 0.8 + Math.random() * 0.6,
        };
      });

      setSparkles(newSparkles);
      setTimeout(() => setSparkles([]), 1500);
    } else {
      // Candle blown out
      playBlowOutSound();
    }
  };

  const toggleSurprise = () => {
    if (!surpriseIsOpen) setCelebration((count) => count + 1);
    setSurpriseIsOpen((isOpen) => !isOpen);
  };

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -20px 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const countdownItems = [
    ["days", "Days"],
    ["hours", "Hours"],
    ["minutes", "Minutes"],
    ["seconds", "Seconds"],
  ];

  return (
    <main className={candleLit ? "candle-lit-theme" : ""}>
      {/* Ambient background stars & glowing balloons */}
      <div className="ambient-sky" aria-hidden="true">
        {Array.from({ length: 30 }, (_, index) => (
          <span
            className="ambient-star"
            key={index}
            style={{
              left: `${(index * 37 + 7) % 100}%`,
              top: `${(index * 53 + 3) % 100}%`,
              "--star-delay": `${(index % 8) * -0.6}s`,
              "--star-duration": `${2.5 + (index % 5)}s`,
            }}
          />
        ))}
        {/* Floating Animated Balloons */}
        {Array.from({ length: 7 }, (_, index) => (
          <div
            className="floating-balloon"
            key={`balloon-${index}`}
            style={{
              left: `${12 + index * 13}%`,
              animationDelay: `${index * 2.8}s`,
              animationDuration: `${14 + (index % 4) * 3}s`,
              "--balloon-color": [
                "rgba(242, 184, 107, 0.4)",
                "rgba(237, 157, 154, 0.4)",
                "rgba(180, 138, 212, 0.35)",
                "rgba(248, 228, 193, 0.4)",
              ][index % 4],
            }}
          >
            <span className="balloon-body" />
            <span className="balloon-string" />
          </div>
        ))}
      </div>

      <div className="scroll-progress" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />

      {/* Sparkle Particles Burst on Candle Light up */}
      {sparkles.map((sp) => (
        <span
          key={sp.id}
          className="sparkle-particle"
          style={{
            left: `${sp.x}px`,
            top: `${sp.y}px`,
            "--dx": `${sp.dx}px`,
            "--dy": `${sp.dy}px`,
            "--size": `${sp.size}px`,
            "--color": sp.color,
            "--duration": `${sp.duration}s`,
          }}
        />
      ))}

      {/* Confetti Explosion Layer */}
      {celebration > 0 && (
        <div className="confetti-layer" key={celebration} aria-hidden="true">
          {Array.from({ length: 48 }, (_, index) => (
            <span
              className="confetti-piece"
              key={index}
              style={{
                left: `${(index * 29 + 2) % 100}%`,
                "--confetti-delay": `${(index % 12) * 0.03}s`,
                "--confetti-turn": `${index % 2 === 0 ? 1 : -1}`,
              }}
            />
          ))}
        </div>
      )}

      {/* Navigation Topbar */}
      <nav className="topbar" aria-label="Main navigation">
        <a className="wordmark" href="#home" aria-label="For my love, home">
          <span className="wordmark-heart" aria-hidden="true">♥</span>
          just for you
        </a>
        <div className="nav-actions">
          <button
            type="button"
            className={`music-toggle-button ${isPlayingMusic ? "is-playing" : ""}`}
            onClick={toggleMusic}
            title={isPlayingMusic ? "Mute Birthday Music" : "Play Birthday Music"}
          >
            <span className="music-icon">{isPlayingMusic ? "🎵" : "🎶"}</span>
            <span>{isPlayingMusic ? "Music ON" : "Play Music"}</span>
          </button>
          <a className="nav-link" href="#love-note">
            A little love note <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-copy hero-enter">
          <p className="eyebrow">
            <span className="eyebrow-line" /> MADE JUST FOR RICHA SHARMA
          </p>
          <h1 className="hero-title">
            Happy birthday,<br />
            <em className="hero-name">Richa Sharma.</em>
          </h1>
          <p className="hero-description">
            And somehow, my little corner of the world got brighter, softer, and so much more beautiful because of you.
          </p>
          <div className="birthday-date">
            <span className="date-icon" aria-hidden="true">✳</span>
            <span>
              <strong>October 07, 2026</strong>
              <small>A day worth celebrating forever</small>
            </span>
          </div>
          <a className="primary-button pulse-button" href="#love-note">
            There&apos;s something special for you <span aria-hidden="true">↓</span>
          </a>
        </div>

        {/* Hero Interactive Cake & Art */}
        <div className="hero-art hero-art-enter" aria-label="Interactive Birthday Cake">
          <div className={`art-sun ${candleLit ? "sun-glowing" : ""}`} />
          <span className="art-sparkle sparkle-one" aria-hidden="true">✳</span>
          <span className="art-sparkle sparkle-two" aria-hidden="true">✦</span>
          <span className="art-sparkle sparkle-three" aria-hidden="true">✧</span>
          <span className="art-heart heart-one" aria-hidden="true">♥</span>
          <span className="art-heart heart-two" aria-hidden="true">♥</span>
          <div className="cake-plate" />

          {/* Interactive Cake Button */}
          <button
            className={`cake cake-button ${candleLit ? "is-lit" : "is-unlit"}`}
            type="button"
            onClick={handleCakeClick}
            aria-pressed={candleLit}
            aria-label={candleLit ? "Extinguish candle" : "Light up the birthday candle"}
          >
            <div className="cake-icing">
              <span /><span /><span /><span /><span />
            </div>
            <div className="cake-layer">
              <i className="berry berry-one" />
              <i className="berry berry-two" />
              <i className="berry berry-three" />
            </div>
            <div className="cake-bottom" />

            {/* Candle & Animated Flame */}
            <div className="cake-candle">
              {candleLit ? (
                <div className="flame-container">
                  <span className="flame-core" />
                  <span className="flame-outer" />
                  <span className="flame-glow" />
                  <span className="flame-sparks" />
                </div>
              ) : (
                <div className="wick-unlit" />
              )}
            </div>
          </button>

          {/* Interactive Hint Banner */}
          <div className={`candle-hint ${candleLit ? "hint-lit" : "hint-unlit"}`}>
            {candleLit ? "✨ Mombatti Jal Gayi! Make a Wish! ✨" : "🎂 Click the Cake to Light the Candle! 🕯️"}
          </div>

          <div className="flower flower-left">
            <span className="flower-head">✿</span>
            <span className="flower-stem" />
          </div>
          <div className="flower flower-right">
            <span className="flower-head">✿</span>
            <span className="flower-stem" />
          </div>
          <div className="art-caption">
            <span>made with</span>
            <span className="caption-heart" aria-hidden="true">♥</span>
            <span>for you</span>
          </div>
        </div>

        <span className="hero-index">
          A LITTLE PAGE, A LOT OF LOVE <span>— 01</span>
        </span>
      </section>

      {/* Countdown Section */}
      <section className="countdown-section" aria-label="Birthday countdown">
        <div className="countdown-intro reveal">
          <span className="section-kicker">THE BIG DAY</span>
          <h2>{timeLeft.isBirthday ? "It’s your day, my love!" : "Counting down to your special day."}</h2>
          <p>
            {timeLeft.isBirthday
              ? "Today, all the love, happiness, and magic in the world is yours."
              : "Counting down to the day you made the world a whole lot brighter."}
          </p>
        </div>
        <div className="countdown" aria-live="polite">
          {countdownItems.map(([key, label]) => (
            <div className="countdown-item reveal" key={key}>
              <span className="countdown-number">{String(timeLeft[key]).padStart(2, "0")}</span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Photo Gallery Section */}
      <section className="portrait-section" aria-label="Photo gallery of Richa Sharma">
        <div className="portrait-frame reveal">
          <div className="portrait-glow" aria-hidden="true" />
          <div className="portrait-card polaroid-style">
            <img
              key={activePhoto}
              src={galleryPhotos[activePhoto].src}
              alt={galleryPhotos[activePhoto].caption}
              className="gallery-image fade-in-image"
            />
            <div className="photo-caption-bar">
              <span>{galleryPhotos[activePhoto].caption}</span>
            </div>
          </div>

          {/* Gallery Carousel Controls */}
          <div className="gallery-controls">
            <button
              type="button"
              className="gallery-nav-btn"
              onClick={() => setActivePhoto((prev) => (prev === 0 ? galleryPhotos.length - 1 : prev - 1))}
              aria-label="Previous photo"
            >
              ❮
            </button>
            <div className="gallery-dots">
              {galleryPhotos.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`dot ${idx === activePhoto ? "active" : ""}`}
                  onClick={() => setActivePhoto(idx)}
                  aria-label={`Go to photo ${idx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="gallery-nav-btn"
              onClick={() => setActivePhoto((prev) => (prev === galleryPhotos.length - 1 ? 0 : prev + 1))}
              aria-label="Next photo"
            >
              ❯
            </button>
          </div>

          <span className="portrait-badge badge-top">Birthday Queen ✦</span>
          <span className="portrait-badge badge-bottom">07 · 10 · 2026</span>
        </div>

        <div className="portrait-copy reveal">
          <span className="section-kicker">THE STAR OF TODAY</span>
          <h2>
            Meet the girl who<br />
            makes every day <em>magical.</em>
          </h2>
          <p>
            Richa Sharma — thoughtful, radiant, kind-hearted, and truly unforgettable. Today is completely yours, and the whole world should know how wonderful you are.
          </p>

          <div className="photo-thumbs-container">
            <span className="thumbs-label">Photo Gallery</span>
            <div className="photo-thumbs">
              {galleryPhotos.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  className={`thumb-btn ${i === activePhoto ? "selected" : ""}`}
                  onClick={() => setActivePhoto(i)}
                >
                  <img src={photo.src} alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <ul className="wish-tags">
            <li>✨ Kind soul</li>
            <li>💖 Beautiful smile</li>
            <li>🌸 My favourite person</li>
            <li>🌟 Pure magic</li>
          </ul>
        </div>
      </section>

      {/* Reasons Section */}
      <section className="reasons-section">
        <div className="section-heading reveal">
          <span className="section-kicker">A FEW OF MY FAVOURITE THINGS</span>
          <h2>
            Just a few reasons<br />
            I <em>adore</em> you.
          </h2>
        </div>
        <div className="reasons-grid">
          {memories.map((memory) => (
            <article className="reason-card reveal" key={memory.number}>
              <span className="reason-number">{memory.number}</span>
              <span className="reason-flower" aria-hidden="true">
                {memory.icon}
              </span>
              <h3>{memory.title}</h3>
              <p>{memory.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Love Note Section */}
      <section className="love-note-section" id="love-note">
        <div className="note-decoration" aria-hidden="true">“</div>
        <div className="love-note-content reveal">
          <span className="section-kicker">JUST BETWEEN US</span>
          <h2>
            A little note<br />
            from <em>my heart.</em>
          </h2>
          <p className="note-teaser">
            Because one birthday wish could never hold all the warmth and love I want to share with you.
          </p>
          <button
            className="primary-button note-button pulse-button"
            type="button"
            onClick={toggleSurprise}
            aria-expanded={surpriseIsOpen}
            aria-controls="surprise-message"
          >
            {surpriseIsOpen ? "Close your note" : "Open your little surprise 💌"}
            <span aria-hidden="true">{surpriseIsOpen ? "↑" : "♥"}</span>
          </button>
          {surpriseIsOpen && (
            <div className="surprise-message surprise-unfold" id="surprise-message">
              <p>
                Happy birthday, Richa! I hope your day is filled with all the laughter, warmth, and little joys you bring into my life. You make ordinary moments feel extraordinary just by being you. I&apos;m so grateful for every memory we share, and I can&apos;t wait for all the beautiful ones still to come.
              </p>
              <p className="message-signoff">
                All my love, today and always <span aria-hidden="true">♥</span>
              </p>
            </div>
          )}
        </div>
        <div className="note-side-art" aria-hidden="true">
          <span className="note-orbit orbit-one" />
          <span className="note-orbit orbit-two" />
          <span className="note-big-heart">♥</span>
          <span className="note-side-sparkle">✦</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>
          Made with <span className="footer-heart" aria-label="love">♥</span> just for you
        </span>
        <span>YOUR DAY. YOUR MAGIC. ALWAYS.</span>
      </footer>
    </main>
  );
}

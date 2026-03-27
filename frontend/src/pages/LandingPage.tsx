import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: "↑",
    title: "Send Instantly",
    desc: "Transfer money to anyone by username in seconds. No bank details needed.",
  },
  {
    icon: "+",
    title: "Add Money",
    desc: "Top up your wallet securely via card. Powered by Stripe.",
  },
  {
    icon: "≡",
    title: "Full History",
    desc: "Every transaction logged. Filter by type, status, and date.",
  },
  {
    icon: "🤖",
    title: "AI Assistant",
    desc: "Gemini-powered chatbot to guide you through every feature.",
  },
  {
    icon: "🔒",
    title: "Bank-grade Security",
    desc: "JWT auth, httpOnly cookies, bcrypt passwords, Stripe PCI compliance.",
  },
  {
    icon: "⚡",
    title: "Daily Limits",
    desc: "Set your own daily transfer cap. Stay in control of your spending.",
  },
];

const steps = [
  { num: "01", title: "Create Account", desc: "Sign up with your email and verify via OTP." },
  { num: "02", title: "Add Money",      desc: "Top up your wallet securely using your card." },
  { num: "03", title: "Send & Receive", desc: "Transfer funds to anyone on PayYou by username." },
];

const LandingPage = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="landing">
      {/* ── Navbar ── */}
      <nav className="nav">
        <div className="nav-inner">
          <span className="logo">PayYou</span>
          <div className="nav-links">
            <Link to="/login"  className="btn-ghost">Sign in</Link>
            <Link to="/signup" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="grid-overlay" />
        </div>

        <div className="hero-content">
          <div className="badge reveal">
            <span className="badge-dot" />
            Secure · Fast · Simple
          </div>

          <h1 className="hero-title reveal">
            Your Money,<br />
            <span className="gradient-text">Your Way.</span>
          </h1>

          <p className="hero-sub reveal">
            A digital wallet built for speed. Send money, add funds,
            and manage transactions — all in one clean dashboard.
          </p>

          <div className="hero-ctas reveal">
            <Link to="/signup" className="btn-primary btn-lg">
              Create Free Account
            </Link>
            <Link to="/login" className="btn-outline btn-lg">
              Sign In
            </Link>
          </div>

          <div className="hero-stats reveal">
            {[
              { val: "₹0",    label: "Setup fee"         },
              { val: "15s",   label: "To send money"     },
              { val: "100%",  label: "Secure payments"   },
            ].map((s) => (
              <div key={s.label} className="stat">
                <span className="stat-val">{s.val}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating wallet card */}
        <div className="hero-visual reveal">
          <div className="wallet-card">
            <div className="card-header">
              <span className="card-logo">PayYou</span>
              <span className="card-chip">◈</span>
            </div>
            <div className="card-balance-label">Total Balance</div>
            <div className="card-balance">₹24,850.00</div>
            <div className="card-footer">
              <div>
                <div className="card-meta-label">Daily Limit</div>
                <div className="card-meta-val">₹10,000</div>
              </div>
              <div className="card-limit-bar">
                <div className="card-limit-fill" style={{ width: "42%" }} />
              </div>
            </div>
          </div>

          {/* Floating transaction pills */}
          <div className="tx-pill tx-pill-1">
            <span className="tx-icon tx-out">↑</span>
            <div>
              <div className="tx-name">To @rahul</div>
              <div className="tx-time">Just now</div>
            </div>
            <span className="tx-amt tx-amt-out">−₹500</span>
          </div>

          <div className="tx-pill tx-pill-2">
            <span className="tx-icon tx-in">↓</span>
            <div>
              <div className="tx-name">From @priya</div>
              <div className="tx-time">2 min ago</div>
            </div>
            <span className="tx-amt tx-amt-in">+₹1,200</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <div className="section-inner">
          <div className="section-label reveal">Features</div>
          <h2 className="section-title reveal">
            Everything you need,<br className="hide-mobile" /> nothing you don't.
          </h2>

          <div className="features-grid">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="feature-card reveal"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section">
        <div className="section-inner">
          <div className="section-label reveal">How it works</div>
          <h2 className="section-title reveal">Up and running in minutes.</h2>

          <div className="steps">
            {steps.map((s, i) => (
              <div key={s.num} className="step reveal" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="step-num">{s.num}</div>
                <div className="step-line" />
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-section">
        <div className="cta-inner reveal">
          <div className="cta-orb" />
          <h2 className="cta-title">Ready to get started?</h2>
          <p className="cta-sub">
            Join thousands of users who trust PayYou for fast, secure transfers.
          </p>
          <Link to="/signup" className="btn-primary btn-lg btn-white">
            Create Your Free Wallet →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="logo">PayYou</span>
          <p className="footer-copy">© {new Date().getFullYear()} PayYou. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </footer>

      {/* ── Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Reset & Base ── */
        .landing * { box-sizing: border-box; margin: 0; padding: 0; }

        .landing {
          font-family: 'DM Sans', sans-serif;
          background: #09090b;
          color: #e4e4e7;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Scroll reveal ── */
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Navbar ── */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(9,9,11,0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .nav-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 20px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.25rem;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .nav-links { display: flex; align-items: center; gap: 10px; }

        /* ── Buttons ── */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #6366f1;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          padding: 8px 18px;
          border-radius: 8px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .btn-primary:hover { background: #4f46e5; transform: translateY(-1px); }
        .btn-primary.btn-lg { font-size: 1rem; padding: 12px 28px; border-radius: 10px; }
        .btn-primary.btn-white { background: #fff; color: #18181b; }
        .btn-primary.btn-white:hover { background: #f4f4f5; }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          color: #a1a1aa;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          padding: 8px 14px;
          border-radius: 8px;
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
        }
        .btn-ghost:hover { color: #fff; background: rgba(255,255,255,0.06); }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          color: #e4e4e7;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 1rem;
          padding: 12px 28px;
          border-radius: 10px;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.15);
          transition: border-color 0.2s, background 0.2s;
        }
        .btn-outline:hover { border-color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); }

        /* ── Hero ── */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 20px 60px;
          position: relative;
          gap: 60px;
        }
        @media (min-width: 1024px) {
          .hero {
            flex-direction: row;
            padding: 120px 60px 80px;
            max-width: 1200px;
            margin: 0 auto;
            gap: 80px;
          }
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: #6366f1;
          top: -100px; left: -100px;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: #8b5cf6;
          top: 50%; right: -80px;
          transform: translateY(-50%);
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: #06b6d4;
          bottom: -50px; left: 40%;
        }
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
          text-align: center;
        }
        @media (min-width: 1024px) {
          .hero-content { text-align: left; max-width: 560px; }
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          color: #a5b4fc;
          font-size: 0.8rem;
          font-weight: 500;
          padding: 5px 14px;
          border-radius: 99px;
          width: fit-content;
          margin: 0 auto;
          letter-spacing: 0.03em;
        }
        @media (min-width: 1024px) { .badge { margin: 0; } }

        .badge-dot {
          width: 6px; height: 6px;
          background: #6366f1;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.6rem, 7vw, 4.5rem);
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #fff;
        }
        .gradient-text {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: 1.05rem;
          line-height: 1.7;
          color: #71717a;
          max-width: 480px;
          margin: 0 auto;
        }
        @media (min-width: 1024px) { .hero-sub { margin: 0; } }

        .hero-ctas {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }
        @media (min-width: 1024px) { .hero-ctas { justify-content: flex-start; } }

        .hero-stats {
          display: flex;
          gap: 32px;
          justify-content: center;
          padding-top: 8px;
        }
        @media (min-width: 1024px) { .hero-stats { justify-content: flex-start; } }

        .stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-val {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.4rem;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .stat-label { font-size: 0.75rem; color: #52525b; }

        /* ── Hero Visual ── */
        .hero-visual {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        @media (min-width: 1024px) { .hero-visual { width: auto; } }

        .wallet-card {
          background: linear-gradient(135deg, #1e1b4b, #312e81, #1e1b4b);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 20px;
          padding: 28px;
          width: 280px;
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.1),
            0 20px 60px rgba(99,102,241,0.2),
            0 4px 20px rgba(0,0,0,0.5);
          position: relative;
        }
        @media (min-width: 480px) { .wallet-card { width: 300px; } }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }
        .card-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          color: rgba(255,255,255,0.9);
        }
        .card-chip {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.4);
        }
        .card-balance-label {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .card-balance {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.9rem;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
        }
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .card-meta-label {
          font-size: 0.68rem;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 3px;
        }
        .card-meta-val {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
        }
        .card-limit-bar {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 99px;
          overflow: hidden;
        }
        .card-limit-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 99px;
        }

        /* Transaction pills */
        .tx-pill {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(24,24,27,0.95);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 10px 14px;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          white-space: nowrap;
        }
        .tx-pill-1 {
          bottom: -20px;
          left: -40px;
          animation: floatA 4s ease-in-out infinite;
        }
        .tx-pill-2 {
          top: -20px;
          right: -40px;
          animation: floatB 4s ease-in-out infinite 2s;
        }
        @media (max-width: 480px) {
          .tx-pill-1 { left: -10px; }
          .tx-pill-2 { right: -10px; }
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(8px); }
        }

        .tx-icon {
          width: 30px; height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
          flex-shrink: 0;
        }
        .tx-in  { background: rgba(34,197,94,0.15);  color: #22c55e; }
        .tx-out { background: rgba(239,68,68,0.15);   color: #ef4444; }
        .tx-name { font-size: 0.78rem; font-weight: 500; color: #e4e4e7; }
        .tx-time { font-size: 0.68rem; color: #52525b; }
        .tx-amt  { font-size: 0.82rem; font-weight: 600; margin-left: 4px; }
        .tx-amt-in  { color: #22c55e; }
        .tx-amt-out { color: #ef4444; }

        /* ── Section shared ── */
        .section-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .section-label {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6366f1;
          margin-bottom: 14px;
        }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          letter-spacing: -0.03em;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 48px;
        }
        .hide-mobile { display: none; }
        @media (min-width: 768px) { .hide-mobile { display: block; } }

        /* ── Features ── */
        .features-section {
          padding: 80px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 640px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .features-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 28px;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }
        .feature-card:hover {
          border-color: rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.05);
          transform: translateY(-2px);
        }
        .feature-icon {
          font-size: 1.4rem;
          margin-bottom: 14px;
          display: block;
          width: 44px; height: 44px;
          background: rgba(99,102,241,0.12);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .feature-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }
        .feature-desc {
          font-size: 0.875rem;
          line-height: 1.65;
          color: #71717a;
        }

        /* ── How it works ── */
        .how-section {
          padding: 80px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .steps {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .steps { grid-template-columns: repeat(3, 1fr); gap: 32px; }
        }

        .step {
          position: relative;
          padding: 28px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
        }
        .step-num {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 2.5rem;
          color: rgba(99,102,241,0.2);
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 16px;
        }
        .step-line {
          width: 32px; height: 2px;
          background: #6366f1;
          border-radius: 2px;
          margin-bottom: 16px;
        }
        .step-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }
        .step-desc {
          font-size: 0.875rem;
          line-height: 1.65;
          color: #71717a;
        }

        /* ── CTA ── */
        .cta-section {
          padding: 80px 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .cta-inner {
          max-width: 640px;
          margin: 0 auto;
          text-align: center;
          position: relative;
        }
        .cta-orb {
          position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%);
          border-radius: 50%;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .cta-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 5vw, 3rem);
          color: #fff;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
          position: relative;
        }
        .cta-sub {
          font-size: 1rem;
          color: #71717a;
          line-height: 1.7;
          margin-bottom: 32px;
          position: relative;
        }

        /* ── Footer ── */
        .footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 24px 20px;
        }
        .footer-inner {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
        }
        @media (min-width: 640px) {
          .footer-inner {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }
        .footer-copy { font-size: 0.8rem; color: #3f3f46; }
        .footer-links {
          display: flex;
          gap: 20px;
        }
        .footer-links a {
          font-size: 0.8rem;
          color: #52525b;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links a:hover { color: #a1a1aa; }
      `}</style>
    </div>
  );
};

export default LandingPage;
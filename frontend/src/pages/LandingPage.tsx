import { useEffect } from "react";
import { Link } from "react-router-dom";

// ─── Data ─────────────────────────────────────────────────

const features = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Instant Transfers",
    desc: "Send money to any PayYou user by username in under 3 seconds. No account numbers, no IFSC codes.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    title: "Card Top-ups",
    desc: "Add funds securely using any debit or credit card. Powered by Stripe with full PCI compliance.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
    title: "Smart History",
    desc: "Every rupee tracked. Filter transactions by type, date, and status with a clean audit trail.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    title: "Bank-grade Security",
    desc: "httpOnly cookies, bcrypt hashing, JWT with refresh rotation, and Stripe-level card security.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    title: "Daily Spend Limits",
    desc: "Set your own daily transfer cap from ₹100 to ₹1,00,000. Full control over your spending.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
    title: "AI Assistant",
    desc: "Gemini-powered chatbot guides you through every feature — available on every page, always.",
  },
];

const steps = [
  {
    num: "01",
    title: "Create Your Account",
    desc: "Sign up with your email and verify your identity with a secure OTP. Takes under a minute.",
  },
  {
    num: "02",
    title: "Fund Your Wallet",
    desc: "Add money using any debit or credit card. Stripe handles the payment — we just credit your balance.",
  },
  {
    num: "03",
    title: "Send & Receive",
    desc: "Transfer money to any user by their PayYou username. Instant, feeless, and fully recorded.",
  },
];

const stats = [
  { val: "₹0", label: "Setup fee" },
  { val: "< 3s", label: "Transfer time" },
  { val: "256", label: "Bit encryption" },
  { val: "24/7", label: "AI support" },
];


const LandingPage = () => {
  useEffect(() => {
    // Google Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.08 },
    );

    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen bg-[#080810] text-zinc-300 overflow-x-hidden"
      style={{ fontFamily: "'Instrument Sans', sans-serif" }}
    >
      {/* ── Google Font preload style ── */}
      <style>{`
        .font-display { font-family: 'Bricolage Grotesque', sans-serif; }
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s cubic-bezier(.16,1,.3,1), transform 0.65s cubic-bezier(.16,1,.3,1);
        }
        .card-shine {
          position: relative;
          overflow: hidden;
        }
        .card-shine::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%);
          pointer-events: none;
        }
        @keyframes float-up {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes float-down {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%    { transform: scale(1);   opacity: 0.4; }
          100%  { transform: scale(1.6); opacity: 0; }
        }
        .float-up   { animation: float-up   5s ease-in-out infinite; }
        .float-down { animation: float-down 5s ease-in-out infinite 2.5s; }
        .spin-slow  { animation: spin-slow  20s linear infinite; }
        .pulse-ring { animation: pulse-ring 2s ease-out infinite; }
        .gradient-text {
          background: linear-gradient(135deg, #fff 30%, #818cf8 70%, #38bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .noise-bg::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      {/* ── Navbar ─────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#080810]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <span className="font-display font-bold text-xl text-white tracking-tight">
            Pay<span className="text-indigo-400">You</span>
          </span>

          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how" className="hover:text-white transition-colors">
              How it works
            </a>
            <a href="#security" className="hover:text-white transition-colors">
              Security
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-400 rounded-lg transition-colors"
            >
              Get Started
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-225 h-150 bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-100 h-100 bg-violet-600/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-75 h-75 bg-sky-500/8 rounded-full blur-[80px]" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />

          {/* Diagonal accent line */}
          <div className="absolute top-0 right-0 w-px h-full bg-linear-to-b from-transparent via-indigo-500/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — copy */}
            <div className="space-y-8">
              {/* Badge */}
              <div
                data-reveal
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 text-xs font-medium text-indigo-300 tracking-wide uppercase"
              >
                <span className="relative flex h-2 w-2">
                  <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-indigo-400" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
                </span>
                Digital Wallet Platform
              </div>

              {/* Headline */}
              <div data-reveal style={{ transitionDelay: "80ms" }}>
                <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-[4.25rem] leading-[1.04] tracking-tight text-white">
                  Money moves{" "}
                  <span className="gradient-text">at the speed</span>{" "}
                  <br className="hidden sm:block" />
                  of a username.
                </h1>
              </div>

              {/* Subheading */}
              <p
                data-reveal
                style={{ transitionDelay: "140ms" }}
                className="text-base sm:text-lg leading-relaxed text-zinc-400 max-w-lg"
              >
                PayYou is a digital wallet built for simplicity. Send money, top
                up with a card, and track every transaction — from one clean,
                secure dashboard.
              </p>

              {/* CTAs */}
              <div
                data-reveal
                style={{ transitionDelay: "200ms" }}
                className="flex flex-wrap gap-3"
              >
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25"
                >
                  Create Free Account
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-medium text-sm rounded-xl transition-all duration-200 hover:bg-white/5"
                >
                  Sign In
                </Link>
              </div>

              {/* Stats row */}
              <div
                data-reveal
                style={{ transitionDelay: "260ms" }}
                className="pt-2 flex flex-wrap gap-x-8 gap-y-4"
              >
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display font-bold text-2xl text-white tracking-tight">
                      {s.val}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — wallet card visual */}
            <div
              data-reveal
              style={{ transitionDelay: "160ms" }}
              className="relative flex items-center justify-center lg:justify-end"
            >
              <div className="relative w-72 sm:w-80">
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-indigo-500/20 rounded-3xl blur-3xl scale-110" />

                {/* Main wallet card */}
                <div className="relative card-shine bg-linear-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] border border-white/10 rounded-3xl p-7 shadow-2xl">
                  {/* Card top row */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-display font-bold text-white text-base tracking-tight">
                      Pay<span className="text-indigo-400">You</span>
                    </span>
                    <div className="flex gap-1.5">
                      <div className="w-7 h-7 rounded-full bg-white/10" />
                      <div className="w-7 h-7 rounded-full bg-indigo-400/40 -ml-3" />
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="mb-7">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 mb-1.5">
                      Total Balance
                    </p>
                    <p className="font-display font-bold text-3xl text-white tracking-tight">
                      ₹24,850
                      <span className="text-zinc-500 text-lg font-medium">
                        .00
                      </span>
                    </p>
                  </div>

                  {/* Daily limit bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-500">Daily limit used</span>
                      <span className="text-zinc-300">₹4,200 / ₹10,000</span>
                    </div>
                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full"
                        style={{ width: "42%" }}
                      />
                    </div>
                  </div>

                  {/* Card bottom */}
                  <div className="mt-6 pt-5 border-t border-white/6 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                        Card holder
                      </p>
                      <p className="text-sm text-zinc-300 font-medium mt-0.5">
                        Sushil Kumar
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Floating pill — incoming */}
                <div className="float-up absolute -left-10 sm:-left-16 top-8 flex items-center gap-3 bg-[#13131f] border border-white/8 rounded-2xl px-4 py-3 shadow-xl">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-sm shrink-0">
                    ↓
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-200">
                      From @priya
                    </p>
                    <p className="text-[10px] text-zinc-500">2 min ago</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400 ml-1">
                    +₹1,200
                  </span>
                </div>

                {/* Floating pill — outgoing */}
                <div className="float-down absolute -right-8 sm:-right-12 bottom-12 flex items-center gap-3 bg-[#13131f] border border-white/8 rounded-2xl px-4 py-3 shadow-xl">
                  <div className="w-8 h-8 rounded-full bg-red-500/12 flex items-center justify-center text-red-400 text-sm shrink-0">
                    ↑
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-200">
                      To @rahul
                    </p>
                    <p className="text-[10px] text-zinc-500">Just now</p>
                  </div>
                  <span className="text-sm font-semibold text-red-400 ml-1">
                    −₹500
                  </span>
                </div>

                {/* Spinning ring decoration */}
                <div className="spin-slow absolute -bottom-8 -right-8 w-24 h-24 rounded-full border border-dashed border-indigo-500/20 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-[#080810] to-transparent pointer-events-none" />
      </section>

      {/* ── Divider strip ──────────────────────────────── */}
      <div className="border-y border-white/5 bg-white/2 py-5">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-xs font-medium text-zinc-500 uppercase tracking-widest">
            {[
              "End-to-End Encrypted",
              "Stripe Powered",
              "Gemini AI",
              "Zero Fees",
              "Instant Settlement",
            ].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-indigo-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ───────────────────────────────────── */}
      <section id="features" className="py-28 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 w-125 h-125 bg-violet-600/6 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5">
          <div className="max-w-2xl mb-16">
            <p
              data-reveal
              className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400 mb-4"
            >
              Features
            </p>
            <h2
              data-reveal
              style={{ transitionDelay: "60ms" }}
              className="font-display font-bold text-4xl sm:text-5xl text-white leading-tight tracking-tight"
            >
              Built for speed.
              <br />
              <span className="text-zinc-500">Designed for clarity.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {features.map((f, i) => (
              <div
                key={f.title}
                data-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
                className="group bg-[#080810] hover:bg-white/2.5 p-7 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400 mb-5 group-hover:bg-indigo-500/15 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-base text-white mb-2.5 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────── */}
      <section id="how" className="py-28 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-2xl mb-16">
            <p
              data-reveal
              className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400 mb-4"
            >
              How it works
            </p>
            <h2
              data-reveal
              style={{ transitionDelay: "60ms" }}
              className="font-display font-bold text-4xl sm:text-5xl text-white leading-tight tracking-tight"
            >
              Three steps to{" "}
              <span className="text-zinc-500">your first transfer.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div
                key={s.num}
                data-reveal
                style={{ transitionDelay: `${i * 100}ms` }}
                className="relative"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[calc(100%+12px)] w-[calc(100%-24px)] h-px bg-linear-to-r from-white/10 to-transparent z-10" />
                )}

                <div className="card-shine bg-white/2.5 border border-white/8 rounded-2xl p-7 h-full hover:border-indigo-500/25 transition-colors duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-display font-bold text-4xl text-indigo-500/25 leading-none tracking-tight">
                      {s.num}
                    </span>
                    <div className="w-px h-8 bg-white/8" />
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white mb-3 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security section ───────────────────────────── */}
      <section id="security" className="py-28 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <p
                data-reveal
                className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400 mb-4"
              >
                Security
              </p>
              <h2
                data-reveal
                style={{ transitionDelay: "60ms" }}
                className="font-display font-bold text-4xl sm:text-5xl text-white leading-tight tracking-tight mb-6"
              >
                Your money is{" "}
                <span className="text-zinc-500">always protected.</span>
              </h2>
              <p
                data-reveal
                style={{ transitionDelay: "120ms" }}
                className="text-base leading-relaxed text-zinc-400 mb-8"
              >
                PayYou is built with security at every layer — from how we store
                your password to how we handle your card details. We never see
                your card number. Ever.
              </p>

              <div
                data-reveal
                style={{ transitionDelay: "180ms" }}
                className="space-y-3"
              >
                {[
                  "Passwords hashed with bcrypt (12 salt rounds)",
                  "Access tokens expire in 15 minutes",
                  "Refresh tokens stored in httpOnly cookies only",
                  "Card data handled exclusively by Stripe",
                  "Webhook signature verification on every payment",
                  "Atomic database transactions — no partial states",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-zinc-400"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                      <svg
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        className="w-3 h-3 text-emerald-400"
                      >
                        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                      </svg>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual */}
            <div
              data-reveal
              style={{ transitionDelay: "100ms" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-3xl" />
              <div className="relative card-shine bg-white/3 border border-white/8 rounded-3xl p-8 space-y-4">
                {[
                  {
                    label: "Authentication",
                    val: "JWT + Refresh Token",
                    status: "secure",
                  },
                  {
                    label: "Password Storage",
                    val: "bcrypt hash",
                    status: "secure",
                  },
                  {
                    label: "Card Processing",
                    val: "Stripe (PCI DSS L1)",
                    status: "secure",
                  },
                  {
                    label: "Data Transit",
                    val: "TLS 1.3 encrypted",
                    status: "secure",
                  },
                  {
                    label: "Session Tokens",
                    val: "httpOnly cookie",
                    status: "secure",
                  },
                  {
                    label: "Transactions",
                    val: "Atomic DB operations",
                    status: "secure",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        {row.label}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">{row.val}</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Secure
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

            <p
              data-reveal
              className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400 mb-6"
            >
              Get Started Today
            </p>
            <h2
              data-reveal
              style={{ transitionDelay: "60ms" }}
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-6"
            >
              Your wallet is{" "}
              <span className="gradient-text">one click away.</span>
            </h2>
            <p
              data-reveal
              style={{ transitionDelay: "120ms" }}
              className="text-base text-zinc-400 leading-relaxed mb-10 max-w-xl mx-auto"
            >
              No setup fees. No hidden charges. Create your free PayYou wallet
              in under a minute and start sending money instantly.
            </p>

            <div
              data-reveal
              style={{ transitionDelay: "180ms" }}
              className="flex flex-wrap gap-3 justify-center"
            >
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                Create Free Wallet
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3.5 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-medium text-sm rounded-xl transition-all duration-200 hover:bg-white/5"
              >
                I have an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display font-bold text-lg text-white tracking-tight">
            Pay<span className="text-indigo-400">You</span>
          </span>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} PayYou. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-zinc-600">
            <Link to="/login" className="hover:text-zinc-300 transition-colors">
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:text-zinc-300 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

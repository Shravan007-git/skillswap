"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, TrendingUp, Award, Users, ChevronRight, Star } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const FEATURED_SWAPS = [
  { from: "Python", to: "Guitar", user: "Arjun, IIT Delhi", rating: 4.9 },
  { from: "Figma", to: "Spanish", user: "Priya, BITS Pilani", rating: 5.0 },
  { from: "Excel", to: "Yoga", user: "Rohit, TCS Hyd", rating: 4.8 },
  { from: "React", to: "Chess", user: "Sneha, NIT Warangal", rating: 4.9 },
  { from: "Marketing", to: "Python", user: "Vikram, Startup founder", rating: 5.0 },
  { from: "Piano", to: "Data Science", user: "Ananya, Manipal", rating: 4.7 },
];

const STATS = [
  { label: "Active Swappers", value: "12,400+" },
  { label: "Skills Available", value: "200+" },
  { label: "Sessions Completed", value: "38,000+" },
  { label: "Avg. Rating", value: "4.9 / 5" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "List your skills",
    desc: "Tell us what you can teach and what you want to learn. Takes two minutes.",
  },
  {
    step: "02",
    title: "Get verified",
    desc: "Take a short quiz to earn a Verified badge. It shows others you actually know your stuff.",
  },
  {
    step: "03",
    title: "Find a match",
    desc: "We surface people whose teach list matches your learn list, and vice versa. No awkward cold outreach.",
  },
  {
    step: "04",
    title: "Swap and earn",
    desc: "Teach a session, earn SwapCoins. Spend them on anything else you want to learn.",
  },
];

const SKILLS = [
  "Python", "JavaScript", "React", "Figma", "Excel", "Machine Learning",
  "TypeScript", "Next.js", "Node.js", "SQL", "MongoDB", "AWS",
  "Docker", "Git", "Data Science", "Photoshop", "Illustrator", "UI/UX Design",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "var(--bg-primary)" }}>

      {/* ── Nav ───────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b" style={{ background: "rgba(6,10,18,0.85)", backdropFilter: "blur(16px)", borderColor: "var(--border)" }}>
        <div className="max-w-screen-xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--brand)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h5M9 8h5M8 2v5M8 9v5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">Skill Swap</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--text-secondary)" }}>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#stats" className="hover:text-white transition-colors">Stats</a>
            <a href="#swaps" className="hover:text-white transition-colors">Live swaps</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium transition-colors" style={{ color: "var(--text-secondary)" }}>
              Sign in
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm py-2 px-5">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -left-64 w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: "rgba(0,200,150,0.12)" }} />
          <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: "rgba(255,107,74,0.10)" }} />
        </div>

        <div className="relative max-w-screen-xl mx-auto px-8 text-center">
          <motion.div variants={stagger} initial="initial" animate="animate">

            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
              style={{ border: "1px solid rgba(0,200,150,0.25)", background: "rgba(0,200,150,0.08)", color: "#4de4c3" }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--brand)" }} />
              India's first verified skill-barter platform
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl font-black leading-[1.08] tracking-tight mb-6"
            >
              Trade what you know<br />
              <span className="gradient-text">for what you want.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              You teach Python, I teach Figma. You teach Excel, I teach guitar.
              No money changes hands — just people trading what they know.
              Over 12,400 students and professionals are already on here.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link href="/auth/signup" className="btn-primary flex items-center justify-center gap-2 text-base">
                Start swapping — it's free
                <ArrowRight size={18} />
              </Link>
              <a href="#how" className="btn-secondary flex items-center justify-center gap-2 text-base">
                See how it works
                <ChevronRight size={18} />
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto"
            >
              {SKILLS.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.04 }}
                  className="px-3 py-1.5 rounded-lg text-sm cursor-default transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section id="stats" className="py-20" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-black gradient-text mb-2">{s.value}</div>
                <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────── */}
      <section id="how" className="py-24" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-screen-xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-black mb-4">How it works</h2>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              Simple enough that you can do your first swap today.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="p-6 rounded-2xl card-hover"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div className="text-xs font-mono font-bold mb-4" style={{ color: "var(--brand)" }}>{step.step}</div>
                <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live swaps ────────────────────────────────── */}
      <section id="swaps" className="py-24" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-screen-xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-black mb-3">Real swaps, real people</h2>
            <p style={{ color: "var(--text-secondary)" }}>These are actual trades happening on the platform right now.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_SWAPS.map((swap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-4 rounded-xl flex items-center gap-4 card-hover"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{swap.from}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>Teaching</div>
                </div>
                <div className="font-bold text-sm px-2" style={{ color: "var(--brand)" }}>
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                    <path d="M1 6h18M13 1l5 5-5 5M7 11L2 6l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{swap.to}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>Learning</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{swap.user}</div>
                  <div className="text-xs flex items-center justify-end gap-0.5 mt-0.5" style={{ color: "#F59E0B" }}>
                    <Star size={10} fill="currentColor" />
                    {swap.rating}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="py-24" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black mb-4 leading-tight">
                Built to actually work,<br />
                <span className="gradient-text">not just look good</span>
              </h2>
              <p className="mb-10 text-lg" style={{ color: "var(--text-secondary)" }}>
                Most platforms let anyone claim they can teach anything. We don't. Every feature here is designed around one idea — trust.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Shield, title: "Verified teachers only", desc: "Every person who lists a teaching skill has taken a short quiz to prove they know it. No self-reported 'expert' badges." },
                  { icon: TrendingUp, title: "SwapCoin economy", desc: "Teach a session and earn coins. Spend them on any skill you want to learn. You're never locked into a one-to-one trade." },
                  { icon: Award, title: "Auto-issued certificates", desc: "Finish three sessions in any skill and we generate a shareable certificate. Add it to LinkedIn in one click." },
                  { icon: Users, title: "Built for India", desc: "Most matching platforms assume everyone has the same schedule and language. We don't. Timezone and college filters are built in." },
                ].map((f) => (
                  <div key={f.title} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.15)" }}>
                      <f.icon size={18} style={{ color: "var(--brand)" }} />
                    </div>
                    <div>
                      <div className="font-semibold mb-1 text-sm">{f.title}</div>
                      <div className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="font-bold">Your matches today</div>
                  <div className="coin-badge">340 coins</div>
                </div>
                {[
                  { name: "Priya S.", college: "BITS Pilani", offers: "React", wants: "Guitar", compat: 94, avatar: "PS" },
                  { name: "Arjun K.", college: "IIT Delhi", offers: "ML", wants: "Figma", compat: 88, avatar: "AK" },
                  { name: "Sneha R.", college: "NIT Warangal", offers: "Excel", wants: "Python", compat: 82, avatar: "SR" },
                ].map((m) => (
                  <div key={m.name} className="flex items-center gap-3 mb-3 p-3 rounded-xl cursor-pointer transition-all" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--brand), #4de4c3)" }}>
                      {m.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{m.name}</div>
                      <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{m.college}</div>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-0.5 rounded skill-chip-teach">Teaches {m.offers}</span>
                        <span className="text-xs px-2 py-0.5 rounded skill-chip-learn">Wants {m.wants}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-black gradient-text">{m.compat}%</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>match</div>
                    </div>
                  </div>
                ))}
                <Link href="/auth/signup" className="btn-primary w-full text-sm py-3 mt-2 flex items-center justify-center gap-2">
                  See your matches
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-32" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-screen-xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              Stop paying for courses.<br />
              <span className="gradient-text">Start trading skills.</span>
            </h2>
            <p className="text-xl mb-10" style={{ color: "var(--text-secondary)" }}>
              Sign up in under a minute. You get 50 SwapCoins on the house.
              Use them to book your first learning session before you've taught anything.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link href="/auth/signup" className="btn-primary text-base py-4 px-8 flex items-center gap-2">
                Create a free account
                <ArrowRight size={18} />
              </Link>
              <div className="flex items-center gap-2 text-sm py-4" style={{ color: "var(--text-muted)" }}>
                No credit card. No subscription. No catch.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="py-12" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-screen-xl mx-auto px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-bold text-lg mb-1">Skill Swap</div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>Trade what you know for what you want.</div>
          </div>
          <div className="flex gap-8 text-sm" style={{ color: "var(--text-muted)" }}>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <Link href="/auth/signup" className="hover:text-white transition-colors">Sign up</Link>
            <Link href="/auth/login" className="hover:text-white transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

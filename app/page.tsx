"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, TrendingUp, Award, Users, Star, ChevronRight } from "lucide-react";

const FEATURED_SWAPS = [
  { from: "Python", to: "Guitar", user: "Arjun M., IIT Delhi", rating: 4.9 },
  { from: "Figma", to: "Spanish", user: "Priya S., BITS Pilani", rating: 5.0 },
  { from: "Excel", to: "Yoga", user: "Rohit K., TCS", rating: 4.8 },
  { from: "React", to: "Chess", user: "Sneha R., NIT Warangal", rating: 4.9 },
  { from: "Marketing", to: "Python", user: "Vikram B., Startup", rating: 5.0 },
  { from: "Piano", to: "Data Science", user: "Ananya P., Manipal", rating: 4.7 },
];

const STATS = [
  { value: "12,400+", label: "Active members" },
  { value: "200+",    label: "Skills available" },
  { value: "38,000+", label: "Sessions done" },
  { value: "4.9",     label: "Average rating" },
];

const HOW = [
  {
    n: "01",
    title: "List your skills",
    body: "Tell us what you're good at and what you want to learn. Takes two minutes. No resume needed.",
  },
  {
    n: "02",
    title: "Get verified",
    body: "Take a short quiz for each skill you want to teach. A badge on your profile tells others you actually know it.",
  },
  {
    n: "03",
    title: "Find your match",
    body: "We show you people whose teach list lines up with your learn list. No cold messages to strangers.",
  },
  {
    n: "04",
    title: "Swap and earn",
    body: "Teach a session, earn SwapCoins. Spend them learning anything else on the platform.",
  },
];

const SKILLS = [
  "Python", "JavaScript", "React", "Figma", "Excel",
  "Machine Learning", "TypeScript", "Next.js", "Node.js", "SQL",
  "MongoDB", "AWS", "Docker", "Git", "Data Science",
  "Photoshop", "UI/UX Design", "Digital Marketing", "Content Writing",
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroY       = useTransform(scrollY, [0, 500], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)" }}>

      {/* ── Ambient orbs ────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="orb animate-pulse-slow"
          style={{
            width: 640, height: 640,
            top: "5%", left: "-18%",
            background: "radial-gradient(circle, rgba(155,27,48,0.10) 0%, transparent 70%)"
          }}
        />
        <div
          className="orb animate-pulse-slow"
          style={{
            width: 500, height: 500,
            top: "45%", right: "-12%",
            background: "radial-gradient(circle, rgba(78,111,133,0.08) 0%, transparent 70%)",
            animationDelay: "1.8s"
          }}
        />
        <div
          className="orb"
          style={{
            width: 400, height: 400,
            bottom: "8%", left: "28%",
            background: "radial-gradient(circle, rgba(155,27,48,0.06) 0%, transparent 70%)"
          }}
        />
      </div>

      {/* ── Nav ─────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50"
        style={{
          background: "rgba(8,12,16,0.82)",
          backdropFilter: "blur(24px) saturate(1.5)",
          WebkitBackdropFilter: "blur(24px) saturate(1.5)",
          borderBottom: "1px solid var(--border-soft)"
        }}
      >
        <div className="max-w-screen-xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #9B1B30, #620018)", boxShadow: "0 2px 12px rgba(155,27,48,0.45)" }}
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h5M9 8h5M8 2v5M8 9v5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold tracking-tight" style={{ color: "var(--text)" }}>Skill Swap</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--text-2)" }}>
            <a href="#how"  className="transition-colors hover:text-white">How it works</a>
            <a href="#swaps" className="transition-colors hover:text-white">Live swaps</a>
            <a href="#why"  className="transition-colors hover:text-white">Why us</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm transition-colors hover:text-white" style={{ color: "var(--text-2)" }}>
              Sign in
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm" style={{ padding: "0.5rem 1.2rem" }}>
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-screen-xl mx-auto px-8 w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
              style={{
                background: "rgba(155,27,48,0.08)",
                border: "1px solid rgba(155,27,48,0.22)",
                letterSpacing: "0.1em",
                color: "var(--burg-bright)"
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--burg-bright)" }} />
              India's first verified skill-barter platform
            </motion.div>

            <h1
              className="font-black leading-[1.04] tracking-tighter mb-8"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)", color: "var(--text)" }}
            >
              Trade what you know<br />
              <span className="gradient-text">for what you want.</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="text-lg leading-relaxed mb-10 max-w-xl"
              style={{ color: "var(--text-2)" }}
            >
              You teach Python, I teach Figma. You teach Excel, I teach guitar.
              No money changes hands — just two people trading what they know.
              Over 12,400 students and professionals are already here.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-20"
            >
              <Link href="/auth/signup" className="btn-primary flex items-center gap-2">
                Start swapping — it's free
                <ArrowRight size={16} />
              </Link>
              <a href="#how" className="btn-secondary flex items-center gap-2">
                See how it works
                <ChevronRight size={16} />
              </a>
            </motion.div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.03, duration: 0.35, ease: "easeOut" }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-soft)",
                    color: "var(--text-2)"
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ───────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--border-soft)", borderBottom: "1px solid var(--border-soft)" }}>
        <div className="max-w-screen-xl mx-auto px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="text-4xl font-black mb-1 gradient-text">{s.value}</div>
                <div className="text-sm" style={{ color: "var(--text-2)" }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────── */}
      <section id="how" className="py-32">
        <div className="max-w-screen-xl mx-auto px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <div className="section-label mb-4">How it works</div>
            <h2 className="font-black tracking-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text)" }}>
              Simple enough to do<br />your first swap today.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW.map((step, i) => (
              <motion.div
                key={step.n}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.13, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="card p-6"
              >
                <div
                  className="text-xs font-black mb-5 font-mono"
                  style={{ color: "var(--burg-bright)", letterSpacing: "0.05em" }}
                >
                  {step.n}
                </div>
                <h3 className="font-bold text-base mb-3" style={{ color: "var(--text)" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live swaps ──────────────────────────────── */}
      <section id="swaps" className="py-24" style={{ borderTop: "1px solid var(--border-soft)" }}>
        <div className="max-w-screen-xl mx-auto px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-12"
          >
            <div className="section-label mb-4">Live swaps</div>
            <h2 className="font-black tracking-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text)" }}>
              Real trades, real people.
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--text-2)" }}>
              These aren't made-up examples. These are actual swaps happening right now.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_SWAPS.map((swap, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="card-flat p-4 flex items-center gap-4"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{swap.from}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>Teaching</div>
                </div>
                <div className="flex-shrink-0 px-1" style={{ color: "var(--text-3)" }}>
                  <svg width="18" height="10" viewBox="0 0 20 12" fill="none">
                    <path d="M1 6h18M13 1l5 5-5 5M7 11L2 6l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{swap.to}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>Learning</div>
                </div>
                <div className="flex-shrink-0 text-right pl-2" style={{ borderLeft: "1px solid var(--border-soft)" }}>
                  <div className="text-xs" style={{ color: "var(--text-2)" }}>{swap.user}</div>
                  <div className="flex items-center justify-end gap-0.5 mt-1" style={{ color: "var(--coin)" }}>
                    <Star size={9} fill="currentColor" />
                    <span className="text-xs font-semibold">{swap.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why us ──────────────────────────────────── */}
      <section id="why" className="py-32" style={{ borderTop: "1px solid var(--border-soft)" }}>
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="section-label mb-6">Why it works</div>
              <h2 className="font-black tracking-tight mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text)" }}>
                Built around trust,<br />
                <span className="gradient-text-steel">not just listings.</span>
              </h2>
              <p className="text-base leading-relaxed mb-10" style={{ color: "var(--text-2)" }}>
                Most platforms let anyone claim they can teach anything. We verify every teacher before they show up in your feed. That one decision changes the quality of everyone you meet here.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "Verified teachers only",
                    desc: "Every person listing a teaching skill has taken a quiz to prove they know it. No self-reported expert badges."
                  },
                  {
                    icon: TrendingUp,
                    title: "SwapCoin economy",
                    desc: "Teach a session and earn coins. Spend them on any skill you want. Not locked into one-to-one trades."
                  },
                  {
                    icon: Award,
                    title: "Auto-issued certificates",
                    desc: "Three sessions in any skill and we issue a shareable certificate. Add it to LinkedIn in one click."
                  },
                  {
                    icon: Users,
                    title: "Built for India",
                    desc: "College filters, local timezone matching, and a community that actually understands your context."
                  },
                ].map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, x: -22 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex gap-4 items-start"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(155,27,48,0.10)", border: "1px solid rgba(155,27,48,0.18)" }}
                    >
                      <f.icon size={16} style={{ color: "var(--burg-bright)" }} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm mb-1" style={{ color: "var(--text)" }}>{f.title}</div>
                      <div className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{f.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* App preview card */}
            <motion.div
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "var(--bg-card-2)",
                  border: "1px solid var(--border-soft)",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.55), 0 0 50px rgba(155,27,48,0.07)"
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>Your matches today</div>
                  <div className="coin-badge">340 coins</div>
                </div>
                {[
                  { name: "Priya S.", college: "BITS Pilani", offers: "React", wants: "Guitar", compat: 94, initials: "PS" },
                  { name: "Arjun K.", college: "IIT Delhi", offers: "ML", wants: "Figma", compat: 88, initials: "AK" },
                  { name: "Sneha R.", college: "NIT Warangal", offers: "Excel", wants: "Python", compat: 82, initials: "SR" },
                ].map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center gap-3 mb-3 p-3 rounded-xl cursor-pointer transition-all"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-soft)" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(155,27,48,0.24)";
                      (e.currentTarget as HTMLElement).style.background  = "rgba(155,27,48,0.05)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border-soft)";
                      (e.currentTarget as HTMLElement).style.background  = "rgba(255,255,255,0.02)";
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #9B1B30, #620018)", color: "white" }}
                    >
                      {m.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm" style={{ color: "var(--text)" }}>{m.name}</div>
                      <div className="text-xs mt-0.5 mb-1.5" style={{ color: "var(--text-3)" }}>{m.college}</div>
                      <div className="flex gap-1.5">
                        <span className="skill-chip-teach text-xs px-2 py-0.5">Teaches {m.offers}</span>
                        <span className="skill-chip-learn text-xs px-2 py-0.5">Wants {m.wants}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xl font-black gradient-text">{m.compat}%</div>
                      <div className="text-xs" style={{ color: "var(--text-3)" }}>match</div>
                    </div>
                  </div>
                ))}
                <Link href="/auth/signup" className="btn-primary w-full mt-2 flex items-center justify-center gap-2" style={{ padding: "0.7rem" }}>
                  See your matches
                  <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ borderTop: "1px solid var(--border-soft)" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(155,27,48,0.08) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-screen-xl mx-auto px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="section-label mb-6">Get started today</div>
            <h2
              className="font-black tracking-tight mb-6 leading-tight"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "var(--text)" }}
            >
              Stop paying for courses.<br />
              <span className="gradient-text">Start trading skills.</span>
            </h2>
            <p className="text-lg mb-10 max-w-xl" style={{ color: "var(--text-2)" }}>
              Sign up in under a minute. You get 50 SwapCoins on the house —
              enough to book your first learning session before you've taught anything.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/auth/signup" className="btn-primary flex items-center gap-2" style={{ fontSize: "1rem", padding: "0.85rem 1.8rem" }}>
                Create a free account
                <ArrowRight size={17} />
              </Link>
              <p className="text-sm py-3" style={{ color: "var(--text-3)" }}>
                No credit card. No subscription. No catch.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="py-12" style={{ borderTop: "1px solid var(--border-soft)" }}>
        <div className="max-w-screen-xl mx-auto px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-bold text-sm mb-1" style={{ color: "var(--text)" }}>Skill Swap</div>
            <div className="text-xs" style={{ color: "var(--text-3)" }}>Trade what you know for what you want.</div>
          </div>
          <div className="flex gap-8 text-xs" style={{ color: "var(--text-3)" }}>
            <a href="#how" className="transition-colors hover:text-white">How it works</a>
            <Link href="/auth/signup" className="transition-colors hover:text-white">Sign up</Link>
            <Link href="/auth/login"  className="transition-colors hover:text-white">Sign in</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

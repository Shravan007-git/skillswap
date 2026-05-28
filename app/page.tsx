"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, Zap, Shield, TrendingUp, Award, ChevronRight } from "lucide-react";
import { getSkillEmoji, SKILLS_LIST } from "@/lib/utils";

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
  { label: "Active Swappers", value: "12,400+", icon: Users },
  { label: "Skills Available", value: "200+", icon: Zap },
  { label: "Sessions Completed", value: "38,000+", icon: Award },
  { label: "Avg. Rating", value: "4.9 ★", icon: Star },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "List Your Skills",
    desc: "Tell us what you can teach and what you want to learn. AI instantly suggests perfect matches.",
    icon: "🎯",
    color: "from-brand-400 to-brand-600",
  },
  {
    step: "02",
    title: "Get Verified",
    desc: "Take a 5-min AI quiz to earn a Verified badge. Trust is everything here.",
    icon: "✅",
    color: "from-accent-400 to-accent-600",
  },
  {
    step: "03",
    title: "Match & Chat",
    desc: "Browse mutual matches. Request a swap. Agree on a time.",
    icon: "🤝",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    step: "04",
    title: "Swap & Earn",
    desc: "Teach → earn SwapCoins. Spend coins to learn anything on the platform.",
    icon: "🪙",
    color: "from-amber-400 to-amber-600",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ── Nav ───────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔄</span>
            <span className="text-xl font-bold gradient-text">Skill Swap</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#stats" className="hover:text-white transition-colors">Stats</a>
            <a href="#swaps" className="hover:text-white transition-colors">Live swaps</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-slate-300 hover:text-white transition-colors font-medium">
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
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-brand-500/20 blur-[120px]" />
          <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-accent-500/20 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-brand-500/5 to-accent-500/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              India&apos;s first verified skill-barter platform
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl font-black leading-tight mb-6"
            >
              Trade what you know<br />
              <span className="gradient-text">for what you want.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              You teach Python, I teach Figma. You teach Excel, I teach guitar.
              <strong className="text-white"> No money. Just skills.</strong> Join 12,400+ students
              and professionals already swapping.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/auth/signup" className="btn-primary flex items-center gap-2 text-base">
                Start swapping free
                <ArrowRight size={18} />
              </Link>
              <a href="#how" className="btn-secondary flex items-center gap-2 text-base bg-white/5 border-white/20 text-white hover:bg-white/10">
                See how it works
                <ChevronRight size={18} />
              </a>
            </motion.div>

            {/* Floating skill bubbles */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto"
            >
              {SKILLS_LIST.slice(0, 18).map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                >
                  {getSkillEmoji(skill)} {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section id="stats" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
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
                <div className="text-slate-400 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────── */}
      <section id="how" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black mb-4">How Skill Swap works</h2>
            <p className="text-slate-400 text-lg">Four steps to your first swap.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur hover:border-white/20 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>
                <div className="text-xs text-slate-500 font-mono font-bold mb-2">{step.step}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live swaps ticker ─────────────────────────── */}
      <section id="swaps" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black mb-3">Live swaps happening now 🔥</h2>
            <p className="text-slate-400">Real skill trades from real users across India.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_SWAPS.map((swap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center gap-4 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-2xl">{getSkillEmoji(swap.from)}</span>
                  <div>
                    <div className="text-sm font-semibold">{swap.from}</div>
                    <div className="text-xs text-slate-500">Teaching</div>
                  </div>
                </div>
                <div className="text-accent-400 font-bold text-sm">⇌</div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-2xl">{getSkillEmoji(swap.to)}</span>
                  <div>
                    <div className="text-sm font-semibold">{swap.to}</div>
                    <div className="text-xs text-slate-500">Learning</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">{swap.user}</div>
                  <div className="text-xs text-amber-400">★ {swap.rating}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black mb-6">
                Built different from<br />
                <span className="gradient-text">every alternative</span>
              </h2>
              <div className="space-y-5">
                {[
                  { icon: Shield, title: "AI Skill Verification", desc: "Every teacher is quiz-verified. No fakes." },
                  { icon: TrendingUp, title: "SwapCoin Economy", desc: "Earn coins teaching. Spend them learning. No direct barter needed." },
                  { icon: Award, title: "LinkedIn Certificates", desc: "Complete 3 sessions → auto-generate a shareable certificate." },
                  { icon: Users, title: "College Leaderboards", desc: "Be the #1 Python teacher at your college. Real social status." },
                ].map((f) => (
                  <div key={f.title} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                      <f.icon size={18} className="text-brand-400" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">{f.title}</div>
                      <div className="text-slate-400 text-sm">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mock app card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-lg font-bold">Your matches today</div>
                  <span className="coin-badge">🪙 340 coins</span>
                </div>
                {[
                  { name: "Priya S.", college: "BITS Pilani", offers: "React", wants: "Guitar", compat: 94, avatar: "PS" },
                  { name: "Arjun K.", college: "IIT Delhi", offers: "ML", wants: "Figma", compat: 88, avatar: "AK" },
                  { name: "Sneha R.", college: "NIT Warangal", offers: "Excel", wants: "Python", compat: 82, avatar: "SR" },
                ].map((m) => (
                  <div key={m.name} className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {m.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{m.name}</div>
                      <div className="text-xs text-slate-400">{m.college}</div>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Teaches {m.offers}</span>
                        <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">Wants {m.wants}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-black gradient-text">{m.compat}%</div>
                      <div className="text-xs text-slate-500">match</div>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-2 btn-primary text-sm py-2.5">
                  View all matches →
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-5xl font-black mb-6">
              Ready to start<br />
              <span className="gradient-text">your first swap?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              Join free. Get 50 SwapCoins instantly. Start learning today.
            </p>
            <Link href="/auth/signup" className="btn-primary text-lg py-4 px-10 inline-flex items-center gap-3">
              Create your free account
              <ArrowRight size={20} />
            </Link>
            <p className="mt-4 text-slate-500 text-sm">No credit card. No fees. Ever.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="py-10 border-t border-white/5 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xl">🔄</span>
          <span className="font-bold text-white">Skill Swap 2.0</span>
        </div>
        <p>Trade what you know for what you want — no money, just skills.</p>
        <p className="mt-2 text-slate-600">Made with ❤️ for India</p>
      </footer>
    </div>
  );
}
